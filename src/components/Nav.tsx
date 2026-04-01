"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudLightning } from "lucide-react";

const links = [
  { href: "/", label: "Forecast" },
  { href: "/industries", label: "Industries" },
  { href: "/roles", label: "Roles" },
  { href: "/map", label: "Map" },
  { href: "/timeline", label: "Timeline" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 64,
        background: "rgba(10,10,10,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <div style={{ maxWidth: 1200, width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32,
            background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <CloudLightning size={16} color="white" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            Displacement<span style={{ color: "#8B5CF6" }}>Weather</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "#FFFFFF" : "#ABABAB",
                  background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
                  textDecoration: "none",
                  transition: "all 150ms ease",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
