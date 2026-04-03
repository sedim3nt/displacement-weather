"use client";
import { useState, useRef } from "react";
import { CloudLightning, Loader2, Sparkles, RotateCcw } from "lucide-react";
import industries from "@/data/industries.json";

export default function PersonalForecastPage() {
  const [industry, setIndustry] = useState("");
  const [role, setRole] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [forecast, setForecast] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!industry || !role) return;

    setLoading(true);
    setForecast("");
    setError("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry,
          role,
          yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
          skills: skillsInput ? skillsInput.split(",").map((s) => s.trim()).filter(Boolean) : [],
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to generate forecast");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setForecast(text);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Failed to generate forecast. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    if (abortRef.current) abortRef.current.abort();
    setForecast("");
    setError("");
    setLoading(false);
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "#111111",
    border: "1px solid #333333",
    borderRadius: 10,
    color: "#FFFFFF",
    fontSize: 14,
    outline: "none",
    transition: "border-color 200ms ease",
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600 as const,
    color: "#ABABAB",
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    marginBottom: 8,
    display: "block",
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <div style={{ position: "relative", marginBottom: 48 }}>
        <div
          style={{
            position: "absolute",
            top: -60,
            left: "30%",
            width: 400,
            height: 300,
            background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 24,
            }}
          >
            <Sparkles size={14} color="#8B5CF6" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.06em" }}>
              AI-POWERED · PERSONAL FORECAST
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            The{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Forecaster
            </span>
          </h1>
          <p style={{ fontSize: 16, color: "#ABABAB", maxWidth: 520, lineHeight: 1.6 }}>
            Get a personal AI displacement forecast based on your specific role, industry, and experience.
          </p>
        </div>
      </div>

      {/* Form */}
      {!forecast && !loading && (
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "#111111",
              border: "1px solid #222222",
              borderRadius: 20,
              padding: 32,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            <div>
              <label style={labelStyle}>Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                }}
              >
                <option value="" style={{ background: "#111111", color: "#666666" }}>
                  Select your industry
                </option>
                {industries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((ind) => (
                    <option key={ind.id} value={ind.name} style={{ background: "#111111", color: "#FFFFFF" }}>
                      {ind.name} (Risk: {ind.riskScore.toFixed(1)})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Your Role / Job Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Data Analyst, Junior Copywriter, Staff Engineer"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
              <div>
                <label style={labelStyle}>Years of Experience</label>
                <input
                  type="number"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  placeholder="e.g. 5"
                  min="0"
                  max="50"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Key Skills</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Python, SQL, data visualization, stakeholder management"
                  style={inputStyle}
                />
                <div style={{ fontSize: 11, color: "#555555", marginTop: 6 }}>Comma-separated</div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "#EF4444",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: "14px 28px",
                background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
                border: "none",
                borderRadius: 12,
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                transition: "opacity 200ms ease, transform 200ms ease",
              }}
            >
              <CloudLightning size={18} />
              Get My Forecast
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && !forecast && (
        <div
          style={{
            background: "#111111",
            border: "1px solid #222222",
            borderRadius: 20,
            padding: "64px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Loader2 size={32} color="#8B5CF6" style={{ animation: "spin 1s linear infinite" }} />
          <div style={{ fontSize: 14, color: "#ABABAB" }}>Analyzing displacement patterns...</div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Forecast Result */}
      {forecast && (
        <div>
          <div
            style={{
              background: "#111111",
              border: "1px solid #222222",
              borderRadius: 20,
              padding: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: "1px solid #222222",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CloudLightning size={18} color="#8B5CF6" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#8B5CF6", letterSpacing: "0.04em" }}>
                  PERSONAL FORECAST
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#555555" }}>
                {industry} · {role}
              </div>
            </div>

            <div
              className="forecast-content"
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                color: "#CCCCCC",
              }}
              dangerouslySetInnerHTML={{ __html: formatMarkdown(forecast) }}
            />

            {loading && (
              <div style={{ marginTop: 16 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 16,
                    background: "#8B5CF6",
                    animation: "blink 1s step-end infinite",
                  }}
                />
                <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
              </div>
            )}
          </div>

          {!loading && (
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleReset}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid #333333",
                  borderRadius: 10,
                  color: "#ABABAB",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "border-color 200ms ease",
                }}
              >
                <RotateCcw size={14} />
                New Forecast
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .forecast-content h1, .forecast-content h2, .forecast-content h3 {
          color: #FFFFFF;
          margin-top: 24px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .forecast-content h2 { font-size: 18px; }
        .forecast-content h3 { font-size: 16px; }
        .forecast-content p { margin-bottom: 12px; }
        .forecast-content strong { color: #FFFFFF; }
        .forecast-content ul, .forecast-content ol {
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .forecast-content li { margin-bottom: 6px; }
      `}</style>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/# (.*)/g, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\- (.*)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*)/gm, '<li>$1</li>')
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
