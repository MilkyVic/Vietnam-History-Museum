"use client";

import { EventItem, Source } from "@/types";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  events: EventItem[];
  sources: Source[];
};

function formatDate(d: string) {
  try {
    const date = new Date(d);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
  } catch {}
  return d;
}

function viPerspective(p?: string) {
  if (p === "VN") return "Việt Nam";
  if (p === "US") return "Mỹ";
  if (p === "International") return "Quốc tế";
  return "Nguồn";
}

export default function Timeline({ events, sources }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (!q) return list;
    return list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        (e.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [events, query]);

  const sourceMap = useMemo(
    () => new Map(sources.map((s) => [s.id, s])),
    [sources]
  );

  return (
    <div className="timeline">
      <div className="timeline-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm sự kiện, thẻ, tóm tắt..."
          className="timeline-input"
        />
        <span className="timeline-count">{filtered.length} mục</span>
      </div>
      <ol className="timeline-list">
        {filtered.map((e) => (
          <li key={e.id} className="timeline-item">
            <div className="timeline-marker">
              {new Date(e.date).getFullYear()}
            </div>
            <div className="timeline-body">
              <div className="timeline-date">{formatDate(e.date)}</div>
              <Link href={`/events/${e.slug}`} className="timeline-title">
                {e.title}
              </Link>
              <p className="timeline-summary">{e.summary}</p>
              {e.sources.length > 0 && (
                <div className="timeline-tags">
                  {e.sources.map((sid) => {
                    const s = sourceMap.get(sid);
                    if (!s) return null;
                    return (
                      <a
                        key={sid}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="timeline-source"
                        title={s.title}
                      >
                        <span>{viPerspective(s.perspective)}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
