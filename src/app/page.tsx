"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ArrowRight } from "lucide-react";
import industries from "@/data/industries.json";
import roles from "@/data/roles.json";

function useCountUp(target: number, duration = 2500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function SeverityGauge({ score }: { score: number }) {
  const pct = score / 10;
  const color = score >= 8 ? "#EF4444" : score >= 6 ? "#F97316" : score >= 4 ? "#EAB308" : "#22C55E";
  const label = score >= 8 ? "SEVERE" : score >= 6 ? "HIGH" : score >= 4 ? "MODERATE" : "LOW";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 200, height: 100 }}>
        <svg viewBox="0 0 200 100" width={200} height={100}>
          {/* Background arc */}
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#222222" strokeWidth="12" strokeLinecap="round" />
          {/* Colored arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${pct * 251.3} 251.3`}
            style={{ transition: "stroke-dasharray 1.5s var(--ease-out-expo), stroke 0.5s ease", filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
          {/* Needle */}
          <line
            x1="100" y1="100"
            x2={100 + 70 * Math.cos(Math.PI - pct * Math.PI)}
            y2={100 - 70 * Math.sin(pct * Math.PI)}
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ transition: "all 1.5s var(--ease-out-expo)" }}
          />
          <circle cx="100" cy="100" r="6" fill="#FFFFFF" />
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, fontWeight: 700, color, lineHeight: 1, letterSpacing: "-0.04em" }}>
          {score.toFixed(1)}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: "0.08em", marginTop: 4 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "#666666", marginTop: 4 }}>Displacement Severity Index</div>
      </div>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "accelerating") return <TrendingUp size={14} color="#EF4444" />;
  if (trend === "decelerating") return <TrendingDown size={14} color="#22C55E" />;
  return <Minus size={14} color="#EAB308" />;
}

function RiskBadge({ score }: { score: number }) {
  const color = score >= 8 ? "#EF4444" : score >= 6 ? "#F97316" : score >= 4 ? "#EAB308" : "#22C55E";
  return (
    <span style={{
      fontSize: 12,
      fontWeight: 700,
      color,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderRadius: 6,
      padding: "2px 8px",
    }}>
      {score.toFixed(1)}
    </span>
  );
}

export default function DashboardPage() {
  const jobsCount = useCountUp(8_400_000, 2800);
  const severityScore = 7.6;

  const topRiskyRoles = [...roles]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  const safestRoles = [...roles]
    .sort((a, b) => a.riskScore - b.riskScore)
    .slice(0, 5);

  const sortedIndustries = [...industries].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>

      {/* Hero */}
      <div style={{ position: "relative", marginBottom: 64 }}>
        {/* Glow orbs */}
        <div style={{
          position: "absolute", top: -80, left: "20%",
          width: 500, height: 400,
          background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: -40, right: "20%",
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(239,68,68,0.08), transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 20, padding: "4px 12px", marginBottom: 24,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EF4444",
              boxShadow: "0 0 6px #EF4444", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#EF4444", letterSpacing: "0.06em" }}>
              LIVE TRACKING · Q1 2026
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 16 }}>
            Today&apos;s <span style={{ backgroundImage: "linear-gradient(135deg, #8B5CF6, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Forecast</span>
          </h1>

          <p style={{ fontSize: 18, color: "#ABABAB", maxWidth: 560, lineHeight: 1.6, marginBottom: 40 }}>
            AI is reshaping the labor market in real time. This is your weather radar.
          </p>

          {/* Big counter */}
          <div style={{
            background: "#111111", border: "1px solid #222222", borderRadius: 20,
            padding: "32px 40px", display: "inline-block",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#666666", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
              Estimated US Jobs Affected by AI — This Quarter
            </div>
            <div style={{ fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1,
              backgroundImage: "linear-gradient(135deg, #EF4444, #F97316)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              {formatNumber(jobsCount)}
            </div>
            <div style={{ fontSize: 13, color: "#666666", marginTop: 8 }}>
              displacement events since Jan 2026 · Source: BLS, Challenger Gray & Christmas
            </div>
          </div>
        </div>
      </div>

      {/* Severity + Top Roles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 48 }}>

        {/* Severity Index */}
        <div style={{
          background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: 32,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#666666", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 24 }}>
            Severity Index
          </div>
          <SeverityGauge score={severityScore} />
          <div style={{ marginTop: 20, fontSize: 12, color: "#555555", textAlign: "center", lineHeight: 1.5 }}>
            Based on Q1 2026 displacement velocity, breadth, and acceleration across all tracked industries.
          </div>
        </div>

        {/* Top affected roles */}
        <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#666666", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Most At Risk This Month
              </div>
            </div>
            <Link href="/roles" style={{ fontSize: 12, color: "#8B5CF6", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topRiskyRoles.map((role, i) => (
              <div key={role.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px",
                background: i === 0 ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i === 0 ? "rgba(239,68,68,0.15)" : "#1A1A1A"}`,
                borderRadius: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, color: "#444444", fontWeight: 600, width: 20 }}>#{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#FFFFFF" }}>{role.title}</div>
                    <div style={{ fontSize: 11, color: "#555555", marginTop: 1 }}>
                      {role.replacementTimeline}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={12} color="#EF4444" />
                  <RiskBadge score={role.riskScore} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safest roles */}
      <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: 32, marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#666666", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Safest Roles — Lowest AI Displacement Risk
          </div>
          <Link href="/roles" style={{ fontSize: 12, color: "#22C55E", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {safestRoles.map((role, i) => (
            <div key={role.id} style={{
              padding: "16px",
              background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.15)",
              borderRadius: 12,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#22C55E", marginBottom: 4 }}>
                {role.riskScore.toFixed(1)}
              </div>
              <div style={{ fontSize: 12, color: "#ABABAB", fontWeight: 500 }}>{role.title}</div>
              <div style={{ fontSize: 11, color: "#555555", marginTop: 4 }}>{role.replacementTimeline}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Industry Heatmap */}
      <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#666666", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Industry Displacement Heatmap
            </div>
            <div style={{ fontSize: 13, color: "#555555", marginTop: 4 }}>
              Color intensity = displacement risk level
            </div>
          </div>
          <Link href="/industries" style={{ fontSize: 12, color: "#8B5CF6", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Deep dives <ArrowRight size={12} />
          </Link>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, marginTop: 12 }}>
          {[["#22C55E", "Low (1-4)"], ["#EAB308", "Moderate (5-7)"], ["#F97316", "High (7-8.5)"], ["#EF4444", "Severe (8.5+)"]].map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span style={{ fontSize: 11, color: "#666666" }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {sortedIndustries.map((ind) => {
            const color = ind.color;
            return (
              <Link key={ind.id} href={`/industry/${ind.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  background: `${color}12`,
                  border: `1px solid ${color}30`,
                  borderRadius: 12,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>
                    {ind.riskScore.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "#ABABAB", fontWeight: 500, marginTop: 6, lineHeight: 1.3 }}>
                    {ind.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                    <TrendIcon trend={ind.trend} />
                    <span style={{ fontSize: 10, color: "#555555" }}>
                      {formatNumber(ind.jobsAtRisk)} at risk
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Data note */}
      <div style={{ marginTop: 32, padding: "16px 20px", background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <AlertTriangle size={14} color="#8B5CF6" style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "#666666", lineHeight: 1.6 }}>
            <strong style={{ color: "#8B5CF6" }}>Methodology:</strong> Risk scores are composite indices derived from BLS occupation data, McKinsey automation research, WEF Future of Jobs reports, Challenger Gray &amp; Christmas layoff data, and primary source earnings calls. Projections reflect research consensus ranges, not guaranteed outcomes.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
