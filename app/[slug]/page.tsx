import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Pledge } from "@/types/pledge";
import TimerClient from "./TimerClient";

interface Props {
  params: { slug: string };
}

async function getPledge(slug: string): Promise<Pledge | null> {
  const { data, error } = await supabase
    .from("pledges")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Pledge;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pledge = await getPledge(params.slug);
  if (!pledge) return { title: "Not Found | Underdog" };

  return {
    title: `${pledge.author_name} — ${pledge.goal} | Underdog`,
    description: `${pledge.author_name} publicly committed: "${pledge.goal}". Watch the countdown.`,
    openGraph: {
      title: `${pledge.author_name}: "${pledge.goal}"`,
      description: "Can they do it? The clock is ticking.",
      images: [`/api/og?slug=${params.slug}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pledge.author_name}: "${pledge.goal}"`,
      images: [`/api/og?slug=${params.slug}`],
    },
  };
}

export const revalidate = 0; // always fresh

export default async function PledgePage({ params }: Props) {
  const pledge = await getPledge(params.slug);
  if (!pledge) notFound();

  return <TimerClient pledge={pledge} />;
}
