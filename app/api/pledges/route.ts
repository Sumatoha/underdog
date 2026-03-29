import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Rate limit: track IPs in memory (resets on deploy, good enough for MVP)
const ipCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 3600000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipCounts.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// GET: check slug availability
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("check");
  if (!slug) {
    return NextResponse.json({ error: "Missing check param" }, { status: 400 });
  }

  const { data } = await supabase
    .from("pledges")
    .select("id")
    .eq("slug", slug)
    .single();

  return NextResponse.json({ taken: !!data });
}

// POST: create pledge
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many pledges. Try again later." }, { status: 429 });
  }

  let body: { slug: string; goal: string; author_name: string; deadline: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, goal, author_name, deadline } = body;

  // Validate
  if (!slug || !goal || !author_name || !deadline) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!/^[a-z0-9_-]{1,20}$/.test(slug)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  if (goal.length > 500) {
    return NextResponse.json({ error: "Goal too long" }, { status: 400 });
  }

  if (author_name.length > 40) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }

  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime()) || deadlineDate.getTime() <= Date.now()) {
    return NextResponse.json({ error: "Invalid deadline" }, { status: 400 });
  }

  // Check slug not taken
  const { data: existing } = await supabase
    .from("pledges")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json({ error: "This handle is taken" }, { status: 409 });
  }

  // Insert
  const { data, error } = await supabase
    .from("pledges")
    .insert({
      slug,
      goal,
      author_name,
      deadline: deadlineDate.toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create pledge" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH: mark done
export async function PATCH(req: NextRequest) {
  let body: { slug: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug } = body;
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Check pledge exists and is active
  const { data: pledge } = await supabase
    .from("pledges")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!pledge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (pledge.status !== "active") {
    return NextResponse.json({ error: "Pledge is not active" }, { status: 400 });
  }

  if (new Date(pledge.deadline).getTime() <= Date.now()) {
    return NextResponse.json({ error: "Deadline has passed" }, { status: 400 });
  }

  const { error } = await supabase
    .from("pledges")
    .update({ status: "done", completed_at: new Date().toISOString() })
    .eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
