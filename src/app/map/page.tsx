"use client";
import { useState } from "react";
import Link from "next/link";
import states from "@/data/states.json";

type StateData = {
  name: string;
  riskScore: number;
  topIndustries: string[];
  topRoles: string[];
  jobsAtRisk: number;
};

const stateEntries = Object.entries(states as Record<string, StateData>).sort(
  (a, b) => b[1].riskScore - a[1].riskScore
);

function riskColor(score: number): string {
  if (score >= 8) return "#EF4444";
  if (score >= 7) return "#F97316";
  if (score >= 6) return "#EAB308";
  if (score >= 5) return "#22C55E";
  return "#3B82F6";
}

function riskLabel(score: number): string {
  if (score >= 8) return "Severe";
  if (score >= 7) return "High";
  if (score >= 6) return "Elevated";
  if (score >= 5) return "Moderate";
  return "Low";
}

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const totalJobs = stateEntries.reduce((sum, [, s]) => sum + s.jobsAtRisk, 0);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>
        Displacement Map
      </h1>
      <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: 32 }}>
        AI-driven job displacement risk by state — {(totalJobs / 1_000_000).toFixed(1)}M positions at risk nationally
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {[["#EF4444", "Severe (8+)"], ["#F97316", "High (7-8)"], ["#EAB308", "Elevated (6-7)"], ["#22C55E", "Moderate (5-6)"], ["#3B82F6", "Low (<5)"]].map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
            <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {stateEntries.map(([code, state]) => (
          <div
            key={code}
            onClick={() => setSelected(selected === code ? null : code)}
            style={{
              background: selected === code ? "rgba(139,92,246,0.08)" : "#FAFAFA",
              border: `1px solid ${selected === code ? "rgba(139,92,246,0.3)" : "#E5E7EB"}`,
              borderRadius: 12,
              padding: "16px 20px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: "1rem" }}>{state.name}</span>
                <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>{code}</span>
              </div>
              <div style={{
                background: riskColor(state.riskScore),
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
              }}>
                {state.riskScore} — {riskLabel(state.riskScore)}
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
              <strong>{(state.jobsAtRisk / 1000).toFixed(0)}K</strong> positions at risk
            </div>
            {selected === code && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Top Industries</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {state.topIndustries.map((ind) => (
                    <span key={ind} style={{ background: "#F3F4F6", padding: "2px 10px", borderRadius: 12, fontSize: 11, color: "#555" }}>
                      {ind.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Most Affected Roles</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {state.topRoles.map((role) => (
                    <span key={role} style={{ background: "#FEF2F2", padding: "2px 10px", borderRadius: 12, fontSize: 11, color: "#B91C1C" }}>
                      {role.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
