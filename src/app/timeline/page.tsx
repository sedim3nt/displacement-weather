"use client";
import { useState } from "react";
import timeline from "@/data/timeline.json";

type TimelineEvent = {
  id: number;
  date: string;
  company: string;
  event: string;
  magnitude: string;
  industry: string;
  jobsAffected: number;
  source: string;
};

const events = (timeline as TimelineEvent[]).sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const magnitudeColor: Record<string, string> = {
  high: "#EF4444",
  medium: "#F97316",
  low: "#EAB308",
};

const magnitudeBg: Record<string, string> = {
  high: "#FEF2F2",
  medium: "#FFF7ED",
  low: "#FEFCE8",
};

export default function TimelinePage() {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const filtered = filter === "all" ? events : events.filter((e) => e.magnitude === filter);
  const totalJobs = filtered.reduce((sum, e) => sum + e.jobsAffected, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
        Displacement Timeline
      </h1>
      <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: 32 }}>
        {filtered.length} events — {(totalJobs / 1000).toFixed(0)}K jobs affected
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {(["all", "high", "medium", "low"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background: filter === f ? "#8B5CF6" : "#F3F4F6",
              color: filter === f ? "#fff" : "#555",
              transition: "all 0.2s",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ position: "relative", paddingLeft: 32 }}>
        <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: "#E5E7EB" }} />
        {filtered.map((event, i) => (
          <div key={event.id} style={{ position: "relative", paddingBottom: 28 }}>
            <div style={{
              position: "absolute",
              left: -27,
              top: 6,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: magnitudeColor[event.magnitude] || "#999",
              border: "2px solid #fff",
              boxShadow: "0 0 0 2px #E5E7EB",
            }} />
            <div style={{ fontSize: 12, color: "#999", fontFamily: "monospace", marginBottom: 4 }}>
              {event.date}
            </div>
            <div style={{
              background: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "16px 20px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{event.company}</div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: 12,
                  background: magnitudeBg[event.magnitude] || "#F3F4F6",
                  color: magnitudeColor[event.magnitude] || "#555",
                  whiteSpace: "nowrap",
                }}>
                  {event.magnitude} · {(event.jobsAffected / 1000).toFixed(event.jobsAffected >= 1000 ? 0 : 1)}K jobs
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.6, marginBottom: 8 }}>
                {event.event}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#999", background: "#F3F4F6", padding: "2px 8px", borderRadius: 8 }}>
                  {event.industry.replace(/-/g, " ")}
                </span>
                <span style={{ fontSize: 11, color: "#999" }}>
                  Source: {event.source}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
