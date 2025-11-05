"use client";

import { useMemo, useRef, useState } from "react";
import { TrendingUp, Wand2, RefreshCw, Download } from "lucide-react";
import { toPng } from "html-to-image";
import clsx from "clsx";

type Topic = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
};

type Generated = {
  headline: string;
  caption: string;
  hashtags: string[];
  slides: Array<{ title: string; bullets: string[] }>; 
  imagePrompt: string;
};

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [generated, setGenerated] = useState<Generated | null>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);

  const fetchTrends = async () => {
    setLoading(true);
    setGenerated(null);
    try {
      const res = await fetch("/api/topics", { cache: "no-cache" });
      const data = (await res.json()) as { topics: Topic[] };
      setTopics(data.topics);
    } catch (e) {
      console.error(e);
      alert("Failed to fetch trends");
    } finally {
      setLoading(false);
    }
  };

  const pickTopic = (t: Topic) => {
    setSelected(t);
    setGenerated(null);
  };

  const generate = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selected }),
      });
      const data = (await res.json()) as { generated: Generated };
      setGenerated(data.generated);
    } catch (e) {
      console.error(e);
      alert("Failed to generate post");
    } finally {
      setLoading(false);
    }
  };

  const downloadSlide = async (idx: number) => {
    const node = slideRefs.current[idx];
    if (!node) return;
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#0b0b12",
    });
    const link = document.createElement("a");
    link.download = `slide-${idx + 1}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Pre-highlight top 1 by default for UX
  const topTopic = useMemo(() => topics[0], [topics]);

  return (
    <main className="space-y-8">
      <section className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-brand" />
            <h2 className="text-lg font-semibold">Trending Tech Topics</h2>
          </div>
          <button onClick={fetchTrends} className="button-primary" disabled={loading}>
            <RefreshCw size={18} /> {loading ? "Fetching..." : "Fetch latest"}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {topics.length === 0 && (
            <div className="text-white/70">Click "Fetch latest" to pull trends from multiple tech sources.</div>
          )}
          {topics.map((t) => (
            <article
              key={t.id}
              className={clsx(
                "rounded-lg p-4 border transition-colors",
                selected?.id === t.id ? "border-brand bg-white/10" : "border-white/10 bg-white/5"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <a href={t.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                    {t.title}
                  </a>
                  <div className="text-xs text-white/60 mt-1">
                    {t.source} {t.publishedAt ? `? ${new Date(t.publishedAt).toLocaleString()}` : ""}
                  </div>
                </div>
                <button className="button-secondary shrink-0" onClick={() => pickTopic(t)}>
                  Select
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Wand2 className="text-brand" />
            <h2 className="text-lg font-semibold">Generate Instagram Post</h2>
          </div>
          <button className="button-primary" onClick={generate} disabled={!selected || loading}>
            <Wand2 size={18} /> {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {!selected && (
          <div className="text-white/70 mt-4">Select a topic to generate a post.</div>
        )}
        {generated && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">{generated.headline}</h3>
              <div className="mt-2 text-white/80 whitespace-pre-wrap">{generated.caption}</div>
              <div className="mt-2 text-brand-light">
                {generated.hashtags.map((h) => (
                  <span key={h} className="mr-2">{h}</span>
                ))}
              </div>
              <div className="mt-2 text-xs text-white/60">Image prompt: {generated.imagePrompt}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generated.slides.map((s, idx) => (
                <div key={idx} className="relative">
                  <div
                    ref={(el) => {
                      if (el) slideRefs.current[idx] = el;
                    }}
                    className="aspect-square rounded-xl p-6 bg-gradient-to-br from-indigo-950 to-fuchsia-900 border border-white/10 shadow-xl flex flex-col"
                  >
                    <div className="text-xs text-white/60">Slide {idx + 1}</div>
                    <div className="mt-2 text-lg font-semibold leading-tight">
                      {s.title}
                    </div>
                    <ul className="mt-3 space-y-2 text-white/90 text-sm">
                      {s.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-brand">?</span>
                          <span className="flex-1">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-4 text-xs text-white/50">@yourhandle ? Trendy Tech IG Agent</div>
                  </div>
                  <button onClick={() => downloadSlide(idx)} className="button-secondary mt-2 w-full">
                    <Download size={16} /> Download PNG
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {topTopic && !selected && (
        <div className="text-sm text-white/60">Tip: preselected top trend: {topTopic.title}</div>
      )}
    </main>
  );
}
