import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { getTimeLeft } from "@/lib/time";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const { data: pledge } = await supabase
    .from("pledges")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!pledge) {
    return new Response("Not found", { status: 404 });
  }

  const time = getTimeLeft(pledge.deadline);
  const status =
    pledge.status === "done" ? "done" : time.total <= 0 ? "failed" : "active";

  const statusText =
    status === "done"
      ? "DONE ✓"
      : status === "failed"
        ? "FAILED ✗"
        : `${time.days}d ${time.hours}h ${time.minutes}m left`;

  const statusColor =
    status === "done" ? "#10ff64" : status === "failed" ? "#ff1e1e" : "#ffffff";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#050505",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            fontSize: 48,
            color: "#ffffff",
            letterSpacing: 8,
            marginBottom: 40,
            opacity: 0.3,
          }}
        >
          UNDERDOG
        </div>

        <div
          style={{
            fontSize: 52,
            color: "#ffffff",
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 900,
            marginBottom: 40,
          }}
        >
          &ldquo;{pledge.goal.length > 80 ? pledge.goal.slice(0, 80) + "..." : pledge.goal}&rdquo;
        </div>

        <div
          style={{
            fontSize: 64,
            color: statusColor,
            fontWeight: 700,
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          {statusText}
        </div>

        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          by {pledge.author_name}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
