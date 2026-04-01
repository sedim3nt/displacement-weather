"use client";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import industries from "@/data/industries.json";

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function TrendBadge({ trend }: { trend: string }) {
  const config = {
    accelerating: { icon: <TrendingUp size={12} />, color: "#EF4444", label: "Accelerating" },
    stable: { icon: <Minus size={12} />, color: "#EAB308", label: "Stable" },
    decelerating: { icon: <TrendingDown size={12} />, color: "#22C55E", label: "Decelerating" },
  }[trend] || { icon: <Minus size={12} />, color: "#666666", label: trend };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 600,
      color: config.color,
      background: `${config.color}15`,
      border: `1px solid ${config.color}30`,
      borderRadius: 6, padding: "2px 8px",
    }}>
      {config.icon} {config.label}
    </span>
  );
}

export default function IndustriesPage() {
  const sorted = [...industries].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
          Industry Deep Dives
        </h1>
        <p style={{ fontSize: 16, color: "#ABABAB", maxWidth: 540 }}>
          {sorted.length} industries tracked. Risk scores based on automation potential, AI tool maturity, and displacement velocity.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {sorted.map((ind) => (
          <Link key={ind.id} href={`/industry/${ind.id}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#111111",
              border: `1px solid ${ind.color}20`,
              borderRadius: 20,
              padding: "28px",
              cursor: "pointer",
              transition: "all 200ms ease",
              height: "100%",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${ind.color}50`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px ${ind.color}12`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = `${ind.color}20`;
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.01em" }}>{ind.name}</h2>
                <div style={{ fontSize: 28, fontWeight: 700, color: ind.color, letterSpacing: "-0.04em" }}>
                  {ind.riskScore.toFixed(1)}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Jobs at risk</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#ABABAB" }}>{formatNumber(ind.jobsAtRisk)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Trend</div>
                  <TrendBadge trend={ind.trend} />
                </div>
              </div>

              {/* AI Tools */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Key AI Tools</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ind.keyAITools.slice(0, 4).map((tool) => (
                    <span key={tool} style={{
                      fontSize: 11, color: "#888888",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 5, padding: "2px 7px",
                    }}>
                      {tool}
                    </span>
                  ))}
                  {ind.keyAITools.length > 4 && (
                    <span style={{ fontSize: 11, color: "#555555" }}>+{ind.keyAITools.length - 4} more</span>
                  )}
                </div>
              </div>

              {/* Risk bar */}
              <div>
                <div style={{ height: 4, background: "#1A1A1A", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${ind.riskScore * 10}%`,
                    background: `linear-gradient(90deg, ${ind.color}88, ${ind.color})`,
                    borderRadius: 4,
                    boxShadow: `0 0 8px ${ind.color}40`,
                  }} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
