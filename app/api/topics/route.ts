import { NextResponse } from "next/server";
import { fetchTrends } from "@/lib/rss";

export const revalidate = 0;

export async function GET() {
  try {
    const topics = await fetchTrends(24);
    return NextResponse.json({ topics });
  } catch (e) {
    return NextResponse.json({ topics: [] }, { status: 200 });
  }
}
