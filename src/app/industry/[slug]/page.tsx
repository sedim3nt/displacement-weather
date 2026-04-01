"use client";
import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import industries from "@/data/industries.json";
import roles from "@/data/roles.json";

function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

const CustomTooltip = ({ active, payload, label, color }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; color?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#161616", border: "1px solid #333333", borderRadius: 10,
        padding: "10px 14px", fontSize: 12,
      }}>
        <div style={{ color: "#888888", marginBottom: 4 }}>{label}</div>
        <div style={{ color: color || "#8B5CF6", fontWeight: 600 }}>
          Risk: {payload[0]?.value?.toFixed(1)}
        </div>
        {payload[1] && (
          <div style={{ color: "#ABABAB", marginTop: 2 }}>
            Displaced: {formatNumber(payload[1].value)}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const industry = industries.find((i) => i.id === slug);
  if (!industry) notFound();

  const industryRoles = roles.filter((r) => r.industry === industry.id);
  const sortedRoles = [...industryRoles].sort((a, b) => b.riskScore - a.riskScore);

  const color = industry.color;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      {/* Back */}
      <Link href="/industries" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, color: "#666666", textDecoration: "none",
        marginBottom: 32,
        padding: "6px 12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        transition: "all 150ms ease",
      }}>
        <ArrowLeft size={14} /> Back to Industries
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em" }}>
              {industry.name}
            </h1>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: industry.trend === "accelerating" ? "#EF4444" : industry.trend === "stable" ? "#EAB308" : "#22C55E",
              background: industry.trend === "accelerating" ? "rgba(239,68,68,0.1)" : industry.trend === "stable" ? "rgba(234,179,8,0.1)" : "rgba(34,197,94,0.1)",
              border: `1px solid ${industry.trend === "accelerating" ? "rgba(239,68,68,0.3)" : industry.trend === "stable" ? "rgba(234,179,8,0.3)" : "rgba(34,197,94,0.3)"}`,
              borderRadius: 6, padding: "4px 10px",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              {industry.trend === "accelerating" ? <TrendingUp size={11} /> : industry.trend === "stable" ? <Minus size={11} /> : <TrendingDown size={11} />}
              {industry.trend.charAt(0).toUpperCase() + industry.trend.slice(1)}
            </span>
          </div>
          <p style={{ fontSize: 16, color: "#ABABAB", maxWidth: 600, lineHeight: 1.6 }}>{industry.description}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color, letterSpacing: "-0.06em", lineHeight: 1 }}>
            {industry.riskScore.toFixed(1)}
          </div>
          <div style={{ fontSize: 11, color: "#555555", letterSpacing: "0.06em", textTransform: "uppercase" }}>Risk Score</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
        {[
          { label: "Jobs at Risk", value: formatNumber(industry.jobsAtRisk), color: "#ABABAB" },
          { label: "2030 Projection", value: formatNumber(industry.timeline[industry.timeline.length - 1].jobsDisplaced), color },
          { label: "Displacement Events", value: industry.notableEvents.length.toString(), color: "#8B5CF6" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "#111111", border: "1px solid #222222", borderRadius: 16, padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, letterSpacing: "-0.03em" }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#555555", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Timeline Chart */}
      <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: "32px", marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: "#FFFFFF" }}>Risk Trajectory (2024–2030)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={industry.timeline} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id={`grad-${industry.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1A1A1A" strokeDasharray="4 4" />
            <XAxis dataKey="year" tick={{ fill: "#555555", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="risk"
              domain={[0, 10]}
              tick={{ fill: "#555555", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip color={color} />} />
            <Area
              yAxisId="risk"
              type="monotone"
              dataKey="riskScore"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#grad-${industry.id})`}
              dot={{ fill: color, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: color, stroke: "#111111", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* AI Capabilities */}
        <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: "28px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "#FFFFFF" }}>Key AI Capabilities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {industry.keyCapabilities.map((cap, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: color,
                  marginTop: 5, flexShrink: 0,
                  boxShadow: `0 0 6px ${color}`,
                }} />
                <span style={{ fontSize: 13, color: "#ABABAB", lineHeight: 1.5 }}>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notable Events */}
        <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: "28px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "#FFFFFF" }}>Notable Events</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {industry.notableEvents.map((evt, i) => (
              <div key={i} style={{
                padding: "12px 14px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #1A1A1A",
                borderRadius: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={11} color="#555555" />
                    <span style={{ fontSize: 11, color: "#555555" }}>
                      {new Date(evt.date + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: evt.magnitude === "high" ? "#EF4444" : "#EAB308",
                    background: evt.magnitude === "high" ? "rgba(239,68,68,0.1)" : "rgba(234,179,8,0.1)",
                    borderRadius: 4, padding: "1px 6px",
                  }}>
                    {evt.magnitude.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", marginBottom: 2 }}>{evt.company}</div>
                <div style={{ fontSize: 12, color: "#888888", lineHeight: 1.5 }}>{evt.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles at risk */}
      {sortedRoles.length > 0 && (
        <div style={{ background: "#111111", border: "1px solid #222222", borderRadius: 20, padding: "28px", marginBottom: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: "#FFFFFF" }}>
            Roles Within {industry.name} — By Vulnerability
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sortedRoles.map((role) => (
              <div key={role.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px",
                background: "rgba(255,255,255,0.02)", border: "1px solid #1A1A1A", borderRadius: 10,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#FFFFFF" }}>{role.title}</div>
                  <div style={{ fontSize: 11, color: "#555555", marginTop: 2 }}>
                    Timeline: {role.replacementTimeline} · Salary: ${role.medianSalary.toLocaleString()}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ height: 4, width: 80, background: "#1A1A1A", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${role.riskScore * 10}%`, background: color, borderRadius: 4 }} />
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color,
                    minWidth: 32, textAlign: "right",
                  }}>{role.riskScore.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What to do */}
      <div style={{
        background: "rgba(34,197,94,0.04)",
        border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: 20, padding: "28px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <CheckCircle size={18} color="#22C55E" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#22C55E" }}>What to Do — Reskilling Paths</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {industry.reskillingSuggestions.map((s, i) => (
            <div key={i} style={{
              padding: "12px 14px",
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.1)",
              borderRadius: 10,
              fontSize: 12, color: "#ABABAB", lineHeight: 1.5,
            }}>
              <span style={{ color: "#22C55E", fontWeight: 600, marginRight: 6 }}>→</span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
