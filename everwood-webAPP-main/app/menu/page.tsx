"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView, useMotionValue } from "framer-motion";
import Link from "next/link";
import { menuItems, categoryLabels } from "@/lib/data/menu";
import type { DrinkCategory, MenuItem } from "@/lib/data/menu";

// ─── Pre-computed grain dot positions (SSR-safe) ───────────────────────────
const GRAIN_DOTS = Array.from({ length: 60 }, (_, i) => ({
  cx: ((i * 137.508 + 23) % 100).toFixed(3),
  cy: ((i * 97.333  + 11) % 100).toFixed(3),
  r:  (0.12 + (i % 7) * 0.06).toFixed(3),
  o:  (0.04 + (i % 5) * 0.025).toFixed(3),
}));

const SECTION_IDS = ["arrival", "coffee", "specials", "tea", "water", "cold", "table"] as const;

// ─── Steam wisp component (CSS-only, 3 variants) ──────────────────────────
function Steam({ count = 3, speed = "2.8s" }: { count?: number; speed?: string }) {
  return (
    <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6, pointerEvents: "none" }} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: 16,
            borderRadius: "40%",
            background: "var(--room-steam)",
            animation: `${i % 2 === 0 ? "steam-rise" : "steam-rise-alt"} ${speed} ease-in-out ${i * 0.55}s infinite`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Fraunces heading ────────────────────────────────────────────
function WobbleHeading({ children, as: Tag = "h2", style }: {
  children: string; as?: "h1" | "h2" | "h3"; style?: React.CSSProperties;
}) {
  const words = children.split(" ");
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef as React.RefObject<Element>, { once: true, margin: "-80px" });

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} style={{ display: "flex", flexWrap: "wrap", gap: "0.25em", ...style }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 14, rotate: i % 2 === 0 ? -1.5 : 1.2 }}
          animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
          transition={{ delay: i * 0.08, duration: 0.55, type: "spring", stiffness: 180 - i * 6, damping: 18 }}
          style={{ display: "inline-block" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

// ─── Coffee SVG illustrations (inline, unique per drink type) ─────────────
function EspressoCup({ color = "#2C1A0E" }: { color?: string }) {
  return (
    <svg width="80" height="70" viewBox="0 0 80 70" fill="none" aria-hidden="true">
      <ellipse cx="40" cy="55" rx="22" ry="5" fill={color} opacity="0.12" />
      <path d="M20 28 Q20 52 40 52 Q60 52 60 28 Z" fill={color} opacity="0.9" />
      <ellipse cx="40" cy="28" rx="20" ry="6" fill={color} />
      <ellipse cx="40" cy="28" rx="16" ry="4.5" fill="#C8780A" opacity="0.75" />
      <path d="M60 34 Q70 34 70 40 Q70 48 60 46" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="18" y="52" width="44" height="4" rx="2" fill={color} opacity="0.5" />
      <rect x="14" y="56" width="52" height="3" rx="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

function LatteCup({ color = "#B07A44" }: { color?: string }) {
  return (
    <svg width="88" height="80" viewBox="0 0 88 80" fill="none" aria-hidden="true">
      <ellipse cx="44" cy="63" rx="26" ry="6" fill={color} opacity="0.1" />
      <path d="M18 24 Q16 60 44 62 Q72 60 70 24 Z" fill={color} opacity="0.88" />
      <ellipse cx="44" cy="24" rx="26" ry="7" fill={color} />
      <ellipse cx="44" cy="24" rx="22" ry="5.5" fill="#EDE3D0" opacity="0.9" />
      {/* latte art leaf */}
      <path d="M44 20 Q50 24 44 29 Q38 24 44 20 Z" fill={color} opacity="0.7" />
      <line x1="44" y1="20" x2="44" y2="29" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M70 32 Q80 32 80 40 Q80 50 70 48" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="16" y="62" width="56" height="5" rx="2.5" fill={color} opacity="0.5" />
    </svg>
  );
}

function TeaGlass({ color = "#4A6741" }: { color?: string }) {
  return (
    <svg width="72" height="96" viewBox="0 0 72 96" fill="none" aria-hidden="true">
      <path d="M18 12 L14 82 Q14 88 36 88 Q58 88 58 82 L54 12 Z" fill={color} opacity="0.12" stroke={color} strokeWidth="1.5" />
      {/* tea liquid */}
      <path d="M20 30 L17 82 Q17 85 36 85 Q55 85 55 82 L52 30 Z" fill={color} opacity="0.75" />
      {/* mint leaves */}
      <ellipse cx="30" cy="20" rx="8" ry="4" fill="#5C8A50" opacity="0.9" transform="rotate(-15 30 20)" />
      <ellipse cx="44" cy="18" rx="7" ry="3.5" fill="#4A7840" opacity="0.9" transform="rotate(10 44 18)" />
      <ellipse cx="38" cy="16" rx="6" ry="3" fill="#6A9A58" opacity="0.9" transform="rotate(-5 38 16)" />
      <rect x="26" y="88" width="20" height="3" rx="1.5" fill={color} opacity="0.4" />
    </svg>
  );
}

function ColdGlass({ color = "#3A2A1E" }: { color?: string }) {
  return (
    <svg width="70" height="100" viewBox="0 0 70 100" fill="none" aria-hidden="true">
      <path d="M14 8 L10 88 Q10 94 35 94 Q60 94 60 88 L56 8 Z" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M16 35 L13 88 Q13 91 35 91 Q57 91 57 88 L54 35 Z" fill={color} opacity="0.7" />
      {/* ice cubes */}
      <rect x="20" y="38" width="12" height="12" rx="2" fill="#C8D8E8" opacity="0.5" transform="rotate(8 20 38)" />
      <rect x="36" y="40" width="10" height="10" rx="2" fill="#C8D8E8" opacity="0.45" transform="rotate(-5 36 40)" />
      {/* straw */}
      <rect x="45" y="4" width="3" height="60" rx="1.5" fill="#8B4A52" opacity="0.7" />
    </svg>
  );
}

function WaterBottle({ color = "#7A8A9A" }: { color?: string }) {
  return (
    <svg width="60" height="100" viewBox="0 0 60 100" fill="none" aria-hidden="true">
      <rect x="18" y="12" width="24" height="6" rx="3" fill={color} opacity="0.5" />
      <path d="M14 22 Q10 26 10 32 L10 84 Q10 92 30 92 Q50 92 50 84 L50 32 Q50 26 46 22 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <path d="M15 50 L12 84 Q12 89 30 89 Q48 89 48 84 L45 50 Z" fill={color} opacity="0.5" />
      {/* label */}
      <rect x="16" y="56" width="28" height="18" rx="2" fill="#F7F0E3" opacity="0.5" />
      <line x1="20" y1="62" x2="40" y2="62" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="22" y1="66" x2="38" y2="66" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function DrinkIllustration({ item }: { item: MenuItem }) {
  const props = { color: item.accentColor };
  if (item.category === "tea") return <TeaGlass {...props} />;
  if (item.category === "water") return <WaterBottle {...props} />;
  if (!item.isHot || item.id.includes("iced") || item.id === "cold-brew" || item.id === "espresso-tonic")
    return <ColdGlass {...props} />;
  if (item.id === "latte" || item.id === "cappuccino" || item.id === "flat-white" || item.id === "cafe-au-lait")
    return <LatteCup {...props} />;
  return <EspressoCup {...props} />;
}

// ─── Moroccan tile SVG (mint tea section) ────────────────────────────────
function MoroccanTile() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true"
      style={{ animation: "room-tile-draw 1.8s ease-out forwards", strokeDasharray: 400, strokeDashoffset: 400 }}>
      <rect x="4" y="4" width="112" height="112" rx="4" stroke="#4A6741" strokeWidth="1.5" fill="none" />
      <path d="M60 4 L60 116 M4 60 L116 60" stroke="#4A6741" strokeWidth="0.8" opacity="0.5" />
      <path d="M4 4 L116 116 M116 4 L4 116" stroke="#4A6741" strokeWidth="0.6" opacity="0.3" />
      <polygon points="60,18 74,46 104,46 80,64 90,94 60,76 30,94 40,64 16,46 46,46" stroke="#4A6741" strokeWidth="1.2" fill="none" />
      <circle cx="60" cy="60" r="16" stroke="#C8780A" strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="60" r="8" stroke="#4A6741" strokeWidth="1" fill="none" />
    </svg>
  );
}

// ─── Drink card ──────────────────────────────────────────────────────────
function DrinkCard({ item, index }: { item: MenuItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--room-chalk)",
        border: `1px solid ${item.accentColor}22`,
        borderRadius: 12,
        padding: "clamp(1.2rem, 3vw, 1.8rem)",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        boxShadow: hovered ? `0 8px 32px ${item.accentColor}20` : "0 2px 12px rgba(42,26,14,0.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      {/* Paper grain overlay */}
      <div className="room-grain" style={{ position: "absolute", inset: 0, borderRadius: 12, zIndex: 0 }} />

      {/* Badge */}
      {item.badge && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          fontFamily: "var(--font-fraunces)", fontSize: "0.65rem",
          fontStyle: "italic", letterSpacing: "0.04em",
          color: item.accentColor, background: `${item.accentColor}15`,
          border: `1px solid ${item.accentColor}30`,
          padding: "2px 8px", borderRadius: 20, zIndex: 1,
        }}>{item.badge}</span>
      )}

      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        {/* Illustration */}
        <div style={{ position: "relative", flexShrink: 0, paddingTop: item.isHot ? 22 : 4 }}>
          {item.isHot && hovered && <Steam count={2} speed="2.4s" />}
          <motion.div
            animate={hovered ? { scale: 1.05, rotate: 1 } : { scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            <DrinkIllustration item={item} />
          </motion.div>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
            <h3 style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 600,
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)", color: "var(--room-espresso)",
              margin: 0, lineHeight: 1.2,
            }}>{item.name}</h3>
            <span style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 700,
              fontSize: "1rem", color: item.accentColor,
              letterSpacing: "0.01em",
            }}>{item.price} <span style={{ fontWeight: 400, fontSize: "0.75rem", opacity: 0.7 }}>{item.currency}</span></span>
          </div>
          <p style={{
            fontFamily: "var(--font-fraunces)", fontStyle: "italic",
            fontSize: "0.72rem", color: "var(--room-umber)", margin: "0.2rem 0 0.6rem",
          }}>{item.subtitle}</p>
          <p style={{
            fontFamily: "var(--font-garamond)",
            fontSize: "clamp(0.82rem, 1.8vw, 0.9rem)", color: "var(--room-umber)",
            lineHeight: 1.65, margin: 0,
          }}>{item.description}</p>
          {item.origin && (
            <p style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem",
              color: "var(--room-sand)", marginTop: "0.5rem", letterSpacing: "0.08em",
            }}>Origin: {item.origin}</p>
          )}
          {item.note && (
            <p style={{
              fontFamily: "var(--font-caveat)", fontSize: "0.85rem",
              color: item.accentColor, marginTop: "0.4rem",
            }}>✦ {item.note}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────
function SectionDivider({ color = "var(--room-sand)" }: { color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "3rem 0" }} aria-hidden="true">
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.3 }} />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" fill={color} opacity="0.5" />
        <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="0.8" fill="none" opacity="0.3" />
      </svg>
      <div style={{ flex: 1, height: 1, background: color, opacity: 0.3 }} />
    </div>
  );
}

// ─── Live menu counter fixed bar ──────────────────────────────────────────
function LiveMenuCounter({ activeSection }: { activeSection: string }) {
  const coffeeCount = menuItems.filter(m => m.category === "coffee").length;
  const teaCount    = menuItems.filter(m => m.category === "tea").length;
  const coldCount   = menuItems.filter(m => m.category === "cold").length;

  const sectionLabel: Record<string, string> = {
    arrival:  "The Arrival",
    coffee:   "The Coffee Bar",
    specials: "The Board",
    tea:      "The Tea Corner",
    water:    "Water Table",
    cold:     "Cold & Fresh",
    table:    "The Table",
  };

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        zIndex: 400,
        background: "var(--room-espresso)",
        borderTop: "1px solid rgba(200,185,154,0.15)",
        padding: "0.6rem clamp(1rem, 5vw, 3rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "0.5rem",
        margin: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
        <span style={{
          fontFamily: "var(--font-fraunces)", fontSize: "0.7rem", fontStyle: "italic",
          color: "var(--room-honey)", letterSpacing: "0.06em",
        }}>
          Now: {sectionLabel[activeSection] || "The Coffee Room"}
        </span>
        <div style={{ display: "flex", gap: "1rem" }}>
          {[
            { label: `${coffeeCount} coffees`, color: "var(--room-amber)" },
            { label: `${teaCount} teas`, color: "var(--room-sage)" },
            { label: `${coldCount} cold`, color: "var(--room-rose)" },
          ].map(({ label, color }) => (
            <span key={label} style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem",
              color, letterSpacing: "0.1em",
            }}>{label}</span>
          ))}
        </div>
      </div>
      <span style={{
        fontFamily: "var(--font-fraunces)", fontStyle: "italic",
        fontSize: "0.65rem", color: "var(--room-sand)", opacity: 0.7,
      }}>
        The Coffee Room — Everwood, Casablanca
      </span>
    </motion.div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────
export default function MenuPage() {
  const [activeSection, setActiveSection] = useState("arrival");
  const [entered, setEntered] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: pageRef });
  const heroY = useTransform(scrollYProgress, [0, 0.25], ["0%", "-20%"]);

  // IntersectionObserver for live counter
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Warm entrance
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, []);

  const coffeeDrinks = menuItems.filter(m => m.category === "coffee");
  const specialsDrinks = menuItems.filter(m => m.category === "specials");
  const teaDrinks = menuItems.filter(m => m.category === "tea");
  const waterDrinks = menuItems.filter(m => m.category === "water");
  const coldDrinks = menuItems.filter(m => m.category === "cold");

  return (
    <div
      ref={pageRef}
      style={{
        background: "var(--room-parchment)",
        color: "var(--room-espresso)",
        minHeight: "100dvh",
        margin: 0, padding: 0,
        overflowX: "hidden",
        paddingBottom: "5rem", // space for fixed bar
      }}
    >
      {/* ── Page-level paper grain ── */}
      <div
        className="room-grain"
        style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", margin: 0 }}
        aria-hidden="true"
      />

      {/* ── Warm entrance overlay ── */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            key="entrance"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] } }}
            style={{
              position: "fixed", inset: 0, zIndex: 900,
              background: "var(--room-espresso)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: 0,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative" }}
            >
              <EspressoCup color="#C8780A" />
              <Steam count={3} speed="1.8s" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navigation back link ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        padding: "1.2rem clamp(1rem, 5vw, 3rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(to bottom, var(--room-parchment) 60%, transparent)",
        margin: 0,
      }}>
        <Link href="/" aria-label="Everwood — home" style={{ textDecoration: "none", display: "block" }}>
          <img
            src="/images/nav/tree_no_bg.png"
            alt="Everwood"
            style={{ height: 140, width: "auto", display: "block", opacity: 0.92 }}
          />
        </Link>
        <span style={{
          fontFamily: "var(--font-fraunces)", fontStyle: "italic",
          fontSize: "0.75rem", color: "var(--room-umber)", opacity: 0.7,
        }}>The Coffee Room</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — ARRIVAL
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="arrival"
        style={{ position: "relative", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: 0, padding: 0 }}
      >
        {/* Warm radial glow */}
        <div style={{
          position: "absolute", inset: 0, margin: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(200,120,10,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Floating steam wisps background */}
        <div style={{ position: "absolute", inset: 0, margin: 0, pointerEvents: "none", overflow: "hidden" }} aria-hidden="true">
          {[15, 35, 55, 72, 88].map((x, i) => (
            <div key={i} style={{
              position: "absolute", bottom: "30%", left: `${x}%`,
              width: 4, height: 24, borderRadius: "40%",
              background: "var(--room-steam)",
              animation: `steam-wisp ${3 + i * 0.7}s ease-in-out ${i * 1.1}s infinite`,
            }} />
          ))}
        </div>

        <motion.div
          style={{ y: heroY, textAlign: "center", padding: "6rem clamp(1rem, 8vw, 4rem)", position: "relative", zIndex: 2 }}
        >
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={entered ? { opacity: 1, letterSpacing: "0.18em" } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem",
              color: "var(--room-amber)", letterSpacing: "0.18em",
              textTransform: "uppercase", marginBottom: "1.5rem",
            }}
          >
            Everwood · Casablanca · Est. 2024
          </motion.p>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 900,
              fontSize: "clamp(3.5rem, 10vw, 8rem)", lineHeight: 0.95,
              color: "var(--room-espresso)", margin: "0 0 0.3rem",
              letterSpacing: "-0.02em",
            }}
          >
            The Coffee
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={entered ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 10vw, 8rem)", lineHeight: 0.95,
              color: "var(--room-amber)", margin: "0 0 2rem",
              letterSpacing: "-0.01em",
            }}
          >
            Room
          </motion.h1>

          {/* Hero espresso cup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={entered ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.8, type: "spring", stiffness: 120, damping: 18 }}
            style={{ position: "relative", display: "inline-block", marginBottom: "2.5rem" }}
          >
            <Steam count={3} speed="2.2s" />
            <EspressoCup color="#2C1A0E" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "var(--room-umber)", maxWidth: 480, margin: "0 auto 1.5rem",
              lineHeight: 1.65,
            }}
          >
            A menu worth reading twice. Every cup carries a decision — origin, roast, preparation, patience.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={entered ? { opacity: 1 } : {}}
            transition={{ delay: 1.4, duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
          >
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", color: "var(--room-sand)", letterSpacing: "0.15em" }}>SCROLL</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              style={{ width: 1, height: 28, background: "var(--room-amber)", opacity: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — THE COFFEE BAR
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="coffee"
        style={{ padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 6vw, 5rem)", margin: 0, position: "relative" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <WobbleHeading style={{
            fontFamily: "var(--font-fraunces)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--room-espresso)",
            marginBottom: "0.3rem",
          }}>The Coffee Bar</WobbleHeading>
          <p style={{
            fontFamily: "var(--font-garamond)", fontStyle: "italic",
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "var(--room-umber)",
            marginBottom: "2.5rem",
          }}>
            Twelve ways to drink coffee. All of them correct, depending on the hour and mood.
          </p>
          <SectionDivider />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px, 40vw, 400px), 1fr))",
            gap: "clamp(1rem, 2.5vw, 1.5rem)",
            marginTop: "1rem",
          }}>
            {coffeeDrinks.map((item, i) => (
              <DrinkCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — THE SPECIALS BOARD (dark inversion)
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="specials"
        style={{
          background: "var(--room-espresso)",
          padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 6vw, 5rem)",
          margin: 0, position: "relative", overflow: "hidden",
        }}
      >
        {/* Chalkboard texture — subtle cross-hatch */}
        <div style={{
          position: "absolute", inset: 0, margin: 0, pointerEvents: "none",
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(245,237,216,0.03) 28px, rgba(245,237,216,0.03) 29px),
            repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(245,237,216,0.02) 28px, rgba(245,237,216,0.02) 29px)
          `,
        }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Chalk "Today's Board" header */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem",
              color: "rgba(245,237,216,0.5)", letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: "0.6rem",
            }}>— Today's Board —</p>
            <h2 style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 400, fontStyle: "italic",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)", color: "var(--room-chalk)",
              marginBottom: "0.5rem", lineHeight: 1,
            }}>
              Something new
              <br />
              <span style={{ fontWeight: 700, color: "var(--room-honey)" }}>on the chalk.</span>
            </h2>
            <p style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              color: "rgba(245,237,216,0.6)", fontSize: "0.95rem",
              marginBottom: "2.5rem",
            }}>
              Two specials. Written each morning. Gone when they're gone.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 3vw, 1.5rem)" }}>
            {specialsDrinks.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{
                  background: "rgba(245,237,216,0.04)",
                  border: "1px solid rgba(245,237,216,0.1)",
                  borderLeft: `3px solid ${item.accentColor}`,
                  borderRadius: "0 8px 8px 0",
                  padding: "clamp(1rem, 3vw, 1.6rem)",
                  display: "flex", gap: "1.2rem", alignItems: "flex-start",
                }}
              >
                <div style={{ position: "relative", paddingTop: item.isHot ? 20 : 0, flexShrink: 0 }}>
                  {item.isHot && <Steam count={2} speed="2.6s" />}
                  <DrinkIllustration item={item} />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <h3 style={{
                      fontFamily: "var(--font-fraunces)", fontWeight: 600,
                      fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                      color: "var(--room-chalk)", margin: 0,
                    }}>{item.name}</h3>
                    <span style={{
                      fontFamily: "var(--font-fraunces)", fontWeight: 700,
                      fontSize: "1.05rem", color: "var(--room-honey)",
                    }}>{item.price} <span style={{ fontWeight: 300, fontSize: "0.75rem" }}>MAD</span></span>
                  </div>
                  <p style={{
                    fontFamily: "var(--font-fraunces)", fontStyle: "italic",
                    fontSize: "0.72rem", color: "rgba(245,237,216,0.5)",
                    margin: "0.2rem 0 0.6rem",
                  }}>{item.subtitle}</p>
                  <p style={{
                    fontFamily: "var(--font-garamond)", fontStyle: "italic",
                    color: "rgba(245,237,216,0.75)", fontSize: "0.92rem", lineHeight: 1.65,
                  }}>{item.description}</p>
                  {item.badge && (
                    <span style={{
                      display: "inline-block", marginTop: "0.6rem",
                      fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem",
                      letterSpacing: "0.1em", color: item.accentColor,
                      border: `1px solid ${item.accentColor}55`, borderRadius: 20,
                      padding: "2px 10px",
                    }}>{item.badge}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — THE TEA CORNER
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="tea"
        style={{ padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 6vw, 5rem)", margin: 0 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Moroccan tile + heading row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <motion.div
              initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 140, damping: 16 }}
              viewport={{ once: true }}
            >
              <MoroccanTile />
            </motion.div>
            <div>
              <WobbleHeading style={{
                fontFamily: "var(--font-fraunces)", fontWeight: 700,
                fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--room-espresso)",
                marginBottom: "0.3rem",
              }}>The Tea Corner</WobbleHeading>
              <p style={{
                fontFamily: "var(--font-garamond)", fontStyle: "italic",
                fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "var(--room-umber)",
                maxWidth: 420,
              }}>
                Mint tea is not a beverage here. It is punctuation. Everything else is the sentence.
              </p>
            </div>
          </div>
          <SectionDivider color="var(--room-sage)" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px, 35vw, 380px), 1fr))",
            gap: "clamp(1rem, 2.5vw, 1.5rem)",
          }}>
            {teaDrinks.map((item, i) => (
              <DrinkCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — THE WATER TABLE
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="water"
        style={{
          background: "var(--room-vellum)",
          padding: "clamp(2.5rem, 6vw, 4rem) clamp(1rem, 6vw, 5rem)",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "3rem", alignItems: "center" }}>
          <div style={{ flex: "1 1 280px" }}>
            <WobbleHeading style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 700,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--room-espresso)",
              marginBottom: "0.5rem",
            }}>The Water Table</WobbleHeading>
            <p style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              color: "var(--room-umber)", lineHeight: 1.7,
              fontSize: "clamp(0.88rem, 2vw, 1rem)",
            }}>
              We don't import what the Atlas provides. Both springs are Moroccan — one still, one alive with natural carbonation.
            </p>
          </div>
          <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 2rem)", flex: "1 1 320px", flexWrap: "wrap" }}>
            {waterDrinks.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                style={{
                  flex: 1, minWidth: 140,
                  background: "var(--room-chalk)",
                  border: "1px solid var(--room-linen)",
                  borderRadius: 10,
                  padding: "1.2rem",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: "0.6rem", textAlign: "center",
                }}
              >
                <WaterBottle color={item.accentColor} />
                <h3 style={{
                  fontFamily: "var(--font-fraunces)", fontWeight: 600,
                  fontSize: "0.95rem", color: "var(--room-espresso)", margin: 0,
                }}>{item.name}</h3>
                <p style={{
                  fontFamily: "var(--font-fraunces)", fontStyle: "italic",
                  fontSize: "0.7rem", color: "var(--room-umber)",
                }}>{item.subtitle}</p>
                <span style={{
                  fontFamily: "var(--font-fraunces)", fontWeight: 700,
                  color: "var(--room-amber)", fontSize: "1rem",
                }}>{item.price} <span style={{ fontWeight: 300, fontSize: "0.7rem" }}>MAD</span></span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — COLD & FRESH
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="cold"
        style={{ padding: "clamp(3rem, 8vw, 6rem) clamp(1rem, 6vw, 5rem)", margin: 0 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <WobbleHeading style={{
            fontFamily: "var(--font-fraunces)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "var(--room-espresso)",
            marginBottom: "0.3rem",
          }}>Cold & Fresh</WobbleHeading>
          <p style={{
            fontFamily: "var(--font-garamond)", fontStyle: "italic",
            fontSize: "clamp(0.9rem, 2vw, 1.05rem)", color: "var(--room-umber)",
            marginBottom: "2.5rem",
          }}>
            Beldi oranges. Hass avocado from the Souss. The season decides.
          </p>
          <SectionDivider color="var(--room-rose)" />
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px, 38vw, 400px), 1fr))",
            gap: "clamp(1rem, 2.5vw, 1.5rem)",
          }}>
            {coldDrinks.map((item, i) => (
              <DrinkCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7 — THE TABLE (closing)
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="table"
        style={{
          padding: "clamp(4rem, 10vw, 8rem) clamp(1rem, 6vw, 5rem)",
          margin: 0, textAlign: "center", position: "relative", overflow: "hidden",
        }}
      >
        {/* Large ambient circle */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(600px, 90vw)", height: "min(600px, 90vw)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,120,10,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}
        >
          <p style={{
            fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem",
            color: "var(--room-amber)", letterSpacing: "0.2em",
            textTransform: "uppercase", marginBottom: "1.5rem",
          }}>— A note from the house —</p>

          <h2 style={{
            fontFamily: "var(--font-fraunces)", fontWeight: 300, fontStyle: "italic",
            fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15,
            color: "var(--room-espresso)", marginBottom: "1.5rem",
          }}>
            Take a table.<br />
            <span style={{ fontWeight: 700, fontStyle: "normal" }}>Stay as long as you need.</span>
          </h2>

          <p style={{
            fontFamily: "var(--font-garamond)", fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "var(--room-umber)", lineHeight: 1.75, marginBottom: "2.5rem",
          }}>
            There is no rush here. The room was built for the kind of conversation that needs a second cup and a third hour. Order when you're ready. Leave when you must.
          </p>

          {/* Divider ornament */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ width: 60, height: 1, background: "var(--room-amber)", opacity: 0.4 }} />
            <EspressoCup color="var(--room-amber)" />
            <div style={{ width: 60, height: 1, background: "var(--room-amber)", opacity: 0.4 }} />
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/events" style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 600,
              fontSize: "0.85rem", padding: "0.8rem 1.8rem",
              background: "var(--room-espresso)", color: "var(--room-chalk)",
              borderRadius: 6, textDecoration: "none",
              letterSpacing: "0.04em",
            }}>See What's On</Link>
            <Link href="/contact" style={{
              fontFamily: "var(--font-fraunces)", fontWeight: 600,
              fontSize: "0.85rem", padding: "0.8rem 1.8rem",
              background: "transparent", color: "var(--room-espresso)",
              border: "1.5px solid var(--room-espresso)",
              borderRadius: 6, textDecoration: "none",
              letterSpacing: "0.04em",
            }}>Reserve a Table</Link>
          </div>
        </motion.div>
      </section>

      {/* ── Live menu counter ── */}
      <LiveMenuCounter activeSection={activeSection} />
    </div>
  );
}
