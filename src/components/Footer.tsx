import Link from "next/link";
import { CloudLightning } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #1A1A1A",
      padding: "48px 24px",
      marginTop: 80,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
            borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CloudLightning size={14} color="white" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#FFFFFF" }}>DisplacementWeather</span>
        </div>

        <p style={{ fontSize: 13, color: "#555555", textAlign: "center", maxWidth: 520 }}>
          Data sourced from BLS, Challenger Gray & Christmas, World Economic Forum, McKinsey Global Institute, Goldman Sachs Research, and company earnings calls.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#444444" }}>
          <span>Built by</span>
          <Link href="https://spirittree.dev" target="_blank" rel="noopener noreferrer"
            style={{ color: "#8B5CF6", textDecoration: "none", fontWeight: 500 }}>
            Sedim3nt
          </Link>
          <span>·</span>
          <span>Not investment or career advice.</span>
        </div>

        <p style={{ fontSize: 11, color: "#333333", textAlign: "center" }}>
          Projections are estimates based on available research. Actual displacement may vary.
        </p>
      </div>
    </footer>
  );
}
