"use client";
import { useState, useMemo } from "react";
import { Search, SortAsc, SortDesc } from "lucide-react";
import Fuse from "fuse.js";
import roles from "@/data/roles.json";
import industries from "@/data/industries.json";

type SortKey = "riskScore" | "medianSalary" | "replacementTimeline";
type SortDir = "asc" | "desc";

const statusConfig: Record<string, { label: string; color: string }> = {
  "actively-displaced": { label: "Active", color: "#EF4444" },
  "at-risk": { label: "At Risk", color: "#F97316" },
  "monitoring": { label: "Monitoring", color: "#EAB308" },
  "safe": { label: "Safe", color: "#22C55E" },
};

export default function RolesPage() {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const fuse = useMemo(() => new Fuse(roles, {
    keys: ["title", "industry", "aiTools"],
    threshold: 0.35,
  }), []);

  const filtered = useMemo(() => {
    let result = query
      ? fuse.search(query).map((r) => r.item)
      : [...roles];

    if (filterStatus) {
      result = result.filter((r) => r.status === filterStatus);
    }

    result.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "desc" ? bv - av : av - bv;
      }
      return sortDir === "desc"
        ? String(bv).localeCompare(String(av))
        : String(av).localeCompare(String(bv));
    });

    return result;
  }, [query, sortKey, sortDir, filterStatus, fuse]);

  const getIndustryName = (id: string) =>
    industries.find((i) => i.id === id)?.name || id;

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12 }}>
          Role Explorer
        </h1>
        <p style={{ fontSize: 16, color: "#ABABAB" }}>
          {roles.length}+ tracked roles — sorted by AI displacement risk
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={14} color="#555555" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search roles, industries, AI tools..."
            style={{
              width: "100%",
              background: "#111111",
              border: "1px solid #2A2A2A",
              borderRadius: 10,
              padding: "10px 16px 10px 38px",
              fontSize: 14, color: "#FFFFFF",
              outline: "none",
            }}
            onFocus={e => (e.target.style.borderColor = "#7C3AED")}
            onBlur={e => (e.target.style.borderColor = "#2A2A2A")}
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{
            background: "#111111", border: "1px solid #2A2A2A", borderRadius: 10,
            padding: "10px 16px", fontSize: 13, color: filterStatus ? "#FFFFFF" : "#888888",
            outline: "none", cursor: "pointer",
          }}
        >
          <option value="">All Status</option>
          <option value="actively-displaced">Actively Displaced</option>
          <option value="at-risk">At Risk</option>
          <option value="monitoring">Monitoring</option>
          <option value="safe">Safe</option>
        </select>

        {/* Sort buttons */}
        {(["riskScore", "medianSalary", "replacementTimeline"] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => toggleSort(key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: sortKey === key ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${sortKey === key ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 8, padding: "8px 14px",
              fontSize: 12, fontWeight: 500,
              color: sortKey === key ? "#8B5CF6" : "#888888",
              cursor: "pointer",
            }}
          >
            {sortDir === "desc" ? <SortDesc size={12} /> : <SortAsc size={12} />}
            {key === "riskScore" ? "Risk" : key === "medianSalary" ? "Salary" : "Timeline"}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: "#555555", marginBottom: 16 }}>
        Showing {filtered.length} roles
      </div>

      {/* Roles table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((role) => {
          const status = statusConfig[role.status] || statusConfig["monitoring"];
          const riskColor = role.riskScore >= 8 ? "#EF4444" : role.riskScore >= 6 ? "#F97316" : role.riskScore >= 4 ? "#EAB308" : "#22C55E";

          return (
            <div key={role.id} style={{
              background: "#111111",
              border: "1px solid #1A1A1A",
              borderRadius: 12,
              padding: "16px 20px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 16,
              transition: "border-color 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#2A2A2A")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#1A1A1A")}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#FFFFFF" }}>{role.title}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: status.color,
                    background: `${status.color}15`,
                    border: `1px solid ${status.color}30`,
                    borderRadius: 5, padding: "1px 7px",
                  }}>
                    {status.label}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#666666" }}>
                    {getIndustryName(role.industry)}
                  </span>
                  <span style={{ fontSize: 12, color: "#666666" }}>
                    Salary: ${role.medianSalary.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, color: "#666666" }}>
                    Timeline: {role.replacementTimeline}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                  {role.aiTools.slice(0, 3).map((tool) => (
                    <span key={tool} style={{
                      fontSize: 11, color: "#666666",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 4, padding: "1px 6px",
                    }}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 8 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: riskColor, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {role.riskScore.toFixed(1)}
                </div>
                <div style={{ height: 4, width: 80, background: "#1A1A1A", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${role.riskScore * 10}%`, background: riskColor, borderRadius: 4 }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
