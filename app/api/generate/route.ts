import { NextResponse } from "next/server";
import { z } from "zod";
import type { Trend } from "@/lib/rss";
import { generatePost } from "@/lib/generator";

const TopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
  url: z.string().url(),
  publishedAt: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = z.object({ topic: TopicSchema }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const topic = parsed.data.topic as Trend;
  const generated = generatePost(topic);
  return NextResponse.json({ generated });
}
