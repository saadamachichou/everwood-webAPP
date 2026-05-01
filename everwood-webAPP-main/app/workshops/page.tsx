"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring, useMotionValue, useInView,
  type MotionValue,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Users, ArrowRight, LayoutGrid, AlignJustify } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { workshops, categoryConfig, type WorkshopCategory } from "@/lib/data/workshops";

gsap.registerPlugin(ScrollTrigger);

/** Artisan studio palette — calm, editorial, natural light */
const A = {
  teal: "#2F6F6A",
  tealSoft: "#6A8F8B",
  linen: "#CBB89D",
  wood: "#8C6A4F",
  ivory: "#F6F2EE",
  paper: "#EDE8DF",
  wash: "#E5DFD4",
  ink: "#2A3D3A",
  inkMuted: "rgba(42,61,58,0.68)",
  edge: "rgba(140,106,79,0.2)",
  deep: "rgba(42,61,58,0.06)",
} as const;

function isWorkshopCategory(c: string | null): c is WorkshopCategory {
  return c === "nature-earth" || c === "light-wonder" || c === "imagination" || c === "making-craft";
}

// ── Module-scope constants (no SSR/client float mismatch) ──────────────────

// Hero polaroids — layout + workshop id (images from `workshops`)
const HERO_POLAROID_LAYOUT = [
  { id: "pottery", rotation: -3, yFrom: -80, xFrom: 0, delay: 0, top: "8%", right: "5%" },
  { id: "glass-painting", rotation: 5, yFrom: 0, xFrom: 60, delay: 0.2, top: "22%", right: "18%" },
  { id: "resin-decor", rotation: -1, yFrom: 60, xFrom: 0, delay: 0.35, top: "40%", right: "3%" },
  { id: "terrarium", rotation: 8, yFrom: 0, xFrom: -40, delay: 0.48, top: "55%", right: "22%" },
  { id: "jewellery-making", rotation: -4, yFrom: -40, xFrom: 0, delay: 0.18, top: "28%", right: "32%" },
] as const;

const HERO_POLAROIDS = HERO_POLAROID_LAYOUT.map((layout) => {
  const workshop = workshops.find((w) => w.id === layout.id);
  if (!workshop) throw new Error(`Workshop hero polaroid: missing "${layout.id}"`);
  return { ...layout, workshop };
});

// Philosophy — soft drift between linen, teal, and wood (window light)
const PHIL_WORDS = "Hands learn the material slowly; the room keeps the quiet.".split(" ");

// Surrealism floating SVG objects (pre-computed positions)
const SURREAL_OBJECTS = [
  { type: "eye",     x: "15%", y: "20%", size: 44, z: 3, rotation: -8,  opacity: 0.35, dur: 18 },
  { type: "clock",   x: "72%", y: "35%", size: 52, z: 5, rotation: 12,  opacity: 0.28, dur: 24 },
  { type: "arch",    x: "82%", y: "60%", size: 36, z: 2, rotation: 0,   opacity: 0.2,  dur: 0  },
  { type: "feather", x: "8%",  y: "65%", size: 32, z: 7, rotation: -5,  opacity: 0.45, dur: 14 },
  { type: "cube",    x: "60%", y: "15%", size: 40, z: 4, rotation: 0,   opacity: 0.22, dur: 30 },
  { type: "moon",    x: "88%", y: "12%", size: 60, z: 1, rotation: 0,   opacity: 0.12, dur: 0  },
] as const;

// ── Tiny helper components ──────────────────────────────────────────────────

// Candlelight philosophy word — each owns its opacity based on light position
const PhilosophyWord = ({
  word, position, lightPos,
}: { word: string; position: number; lightPos: MotionValue<number> }) => {
  const dim = position > 0.55 ? 0.68 : 0.58;
  const tail = position > 0.55 ? 0.94 : 0.9;
  const opacity = useTransform(lightPos,
    [Math.max(0, position - 0.2), position, Math.min(1, position + 0.14)],
    [dim, 1.0, tail]
  );
  const color = useTransform(lightPos,
    [Math.max(0, position - 0.2), position, Math.min(1, position + 0.12)],
    ["#6A8F8B", "#2F6F6A", "#8C6A4F"]
  );
  return (
    <motion.span style={{ opacity, color, display: "inline" }}>
      {word}&nbsp;
    </motion.span>
  );
};

// Count-up stat card with spring overshoot
const StatCard = ({
  value, label, sub, accent, isTime,
}: { value: number; label: string; sub: string; accent: string; isTime?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 35, damping: 10 });
  const display = useTransform(spring, v => isTime ? `${Math.round(v)}h` : Math.round(v).toLocaleString());

  useEffect(() => { if (inView) count.set(value); }, [inView, value, count]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "2rem 1rem" }}>
      {/* accent dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
        style={{ width: 10, height: 10, background: accent, filter: "blur(2px)", marginBottom: "0.5rem" }}
      />
      <motion.div style={{
        fontFamily: "var(--font-playfair)",
        fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
        fontWeight: 500,
        color: A.ink,
        lineHeight: 1,
      }}>{display}</motion.div>
      <div style={{
        fontFamily: "var(--font-dm-mono)",
        fontSize: "0.6rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: accent,
        marginTop: "0.25rem",
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-lora)",
        fontStyle: "italic",
        fontSize: "0.78rem",
        color: A.inkMuted,
        textAlign: "center",
        maxWidth: "18ch",
        lineHeight: 1.5,
      }}>{sub}</div>
    </div>
  );
};

// Availability bar
const AvailBar = ({ spots, total }: { spots: number; total: number }) => {
  const pct = ((total - spots) / total) * 100;
  const fillColor = pct < 50 ? A.tealSoft : pct < 75 ? A.linen : A.wood;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <div style={{ height: 3, background: `rgba(203,184,157,0.4)`, borderRadius: 2, overflow: "hidden", margin: 0 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", width: `${pct}%`, background: fillColor, transformOrigin: "left", borderRadius: 2 }}
        />
      </div>
      <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", color: A.inkMuted, letterSpacing: "0.1em" }}>
        {spots} / {total} spots
      </div>
    </div>
  );
};

// Workshop card for the catalogue section
const WorkshopCard = ({ w, isListView }: { w: typeof workshops[0]; isListView: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const cfg = categoryConfig[w.category];

  if (isListView) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, filter: "blur(3px)" }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: "1.5rem",
          padding: "1rem 1.25rem",
          background: hovered ? "rgba(47,111,106,0.06)" : A.ivory,
          borderBottom: `1px solid ${A.edge}`,
          cursor: "pointer",
          transition: "background 150ms",
          position: "relative",
          margin: 0,
        }}
      >
        <motion.div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 2, margin: 0,
          background: cfg.accent,
          scaleY: hovered ? 1 : 0,
          transformOrigin: "top",
        }} transition={{ duration: 0.2 }} />
        {/* thumbnail */}
        <div style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 2, overflow: "hidden", position: "relative", background: w.gradient }}>
          <img src={w.image} alt={w.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "1.1rem", color: A.ink, marginBottom: "0.2rem" }}>{w.title}</div>
          <div style={{ fontFamily: "var(--font-lora)", fontSize: "0.78rem", color: A.inkMuted, fontStyle: "italic" }}>{w.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexShrink: 0, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", color: A.inkMuted }}>{w.duration}</span>
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", color: A.teal }}>{w.nextDate}</span>
          <div style={{ width: 80 }}>
            <AvailBar spots={w.spotsLeft} total={w.totalSpots} />
          </div>
          <span style={{ fontFamily: "var(--font-lora)", fontSize: "0.85rem", color: hovered ? cfg.accent : A.ink, transition: "color 150ms", whiteSpace: "nowrap" }}>
            {w.price} {w.currency}
          </span>
          <motion.button
            style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.5rem 1rem",
              border: `1px solid ${cfg.accent}66`,
              background: "transparent", color: cfg.accent,
              cursor: "pointer",
            }}
            whileHover={{ borderColor: cfg.accent, backgroundColor: `${cfg.accent}12` }}
          >Book</motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96, filter: "blur(3px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(3px)" }}
      transition={{ duration: 0.3, delay: 0.05 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: A.ivory,
        border: `1px solid ${A.edge}`,
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
        margin: 0,
        boxShadow: hovered ? `0 3px 0 0 ${cfg.accent}` : "none",
        transition: "box-shadow 200ms",
      }}
    >
      {/* image area */}
      <div style={{ height: 200, overflow: "hidden", position: "relative", margin: 0 }}>
        <motion.div
          style={{ height: "100%", background: w.gradient, position: "relative" }}
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={w.image}
            alt={w.title}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "rgba(42,61,58,0.14)" }} />
        </motion.div>
        {w.isPopular && (
          <div style={{
            position: "absolute", top: "0.75rem", right: "0.75rem",
            fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem",
            letterSpacing: "0.24em", textTransform: "uppercase",
            color: A.teal, border: "1px solid rgba(47,111,106,0.35)",
            background: "rgba(47,111,106,0.06)", padding: "0.3rem 0.6rem",
            margin: 0, borderRadius: 2,
          }}>◆ Most Popular</div>
        )}
        {/* Caveat annotation on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute", bottom: "0.75rem", left: "0.75rem",
                fontFamily: "var(--font-caveat)",
                fontSize: "1.1rem", fontWeight: 700,
                color: cfg.accent,
                textShadow: `0 0 12px ${cfg.accent}55`,
                margin: 0,
              }}
            >{w.annotation}</motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* content */}
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.accent, flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", color: cfg.accent }}>{cfg.label}</span>
          </div>
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", color: A.inkMuted }}>{w.duration}</span>
        </div>
        <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "1.15rem", color: A.ink, marginBottom: "0.35rem", lineHeight: 1.2 }}>{w.title}</div>
        <div style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.78rem", color: A.inkMuted, lineHeight: 1.5, marginBottom: "0.9rem" }}>{w.tagline}</div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.9rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Clock size={10} style={{ color: A.tealSoft }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem", color: A.inkMuted }}>{w.duration}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Users size={10} style={{ color: A.tealSoft }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem", color: A.inkMuted }}>{w.groupSize}</span>
          </div>
        </div>

        <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem", letterSpacing: "0.08em", color: A.teal, marginBottom: "0.5rem" }}>
          Next: {w.nextDate}
        </div>
        <AvailBar spots={w.spotsLeft} total={w.totalSpots} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <motion.button
            style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "0.6rem 1.2rem",
              border: `1px solid ${cfg.accent}55`,
              background: "transparent", color: cfg.accent, cursor: "pointer",
            }}
            whileHover={{ borderColor: cfg.accent, backgroundColor: `${cfg.accent}10` }}
          >Book</motion.button>
          <span style={{ fontFamily: "var(--font-lora)", fontSize: "0.9rem", color: A.ink }}>
            {w.price} <span style={{ fontSize: "0.65rem", color: A.inkMuted }}>{w.currency}</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Surrealist SVG shape renderer ────────────────────────────────────────────
const SurrealShape = ({ type, size }: { type: string; size: number }) => {
  const s = size;
  if (type === "eye") return (
    <svg width={s} height={s * 0.55} viewBox="0 0 44 24" fill="none" stroke="#6A8F8B" strokeWidth="1.2" style={{ margin: 0 }}>
      <path d="M2 12 C8 4 36 4 42 12 C36 20 8 20 2 12Z" />
      <circle cx="22" cy="12" r="5" />
      <circle cx="22" cy="12" r="2" fill="#6A8F8B" />
    </svg>
  );
  if (type === "clock") return (
    <svg width={s} height={s} viewBox="0 0 52 52" fill="none" stroke="#6A8F8B" strokeWidth="1.2" style={{ margin: 0 }}>
      <circle cx="26" cy="26" r="22" />
      <line x1="26" y1="26" x2="26" y2="10" strokeWidth="1.5" />
      <line x1="26" y1="26" x2="36" y2="30" />
      {/* melting bottom */}
      <path d="M4 44 Q10 58 20 52 Q26 56 32 50 Q40 58 48 44" strokeOpacity="0.6" />
    </svg>
  );
  if (type === "feather") return (
    <svg width={s * 0.5} height={s} viewBox="0 0 16 32" fill="none" stroke="#6A8F8B" strokeWidth="0.8" style={{ margin: 0 }}>
      <path d="M8 30 Q8 0 8 0" />
      <path d="M8 8 Q2 6 1 12 Q4 10 8 12" />
      <path d="M8 14 Q14 12 15 18 Q12 16 8 18" />
      <path d="M8 20 Q2 18 1 24 Q4 22 8 24" />
    </svg>
  );
  if (type === "cube") return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" stroke="#6A8F8B" strokeWidth="0.8" style={{ margin: 0 }}>
      <rect x="8" y="8" width="22" height="22" />
      <rect x="12" y="4" width="22" height="22" />
      <line x1="8" y1="8" x2="12" y2="4" />
      <line x1="30" y1="8" x2="34" y2="4" />
      <line x1="30" y1="30" x2="34" y2="26" />
    </svg>
  );
  if (type === "arch") return (
    <svg width={s} height={s * 1.2} viewBox="0 0 36 44" fill="none" stroke="#6A8F8B" strokeWidth="0.8" style={{ margin: 0 }}>
      <path d="M4 42 L4 20 Q4 4 18 4 Q32 4 32 20 L32 42" />
      <line x1="4" y1="42" x2="32" y2="42" />
    </svg>
  );
  // moon
  return (
    <svg width={s} height={s} viewBox="0 0 60 60" fill="none" stroke="#6A8F8B" strokeWidth="0.8" style={{ margin: 0 }}>
      <path d="M30 8 Q50 8 50 30 Q50 52 30 52 Q40 44 40 30 Q40 16 30 8Z" />
    </svg>
  );
};

// ── Main page component ────────────────────────────────────────────────────
function WorkshopsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categoryFromUrl = searchParams.get("category");
  const activeFilter: WorkshopCategory | "all" = isWorkshopCategory(categoryFromUrl)
    ? categoryFromUrl
    : "all";

  const setCategoryFilter = (key: WorkshopCategory | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("category");
    else params.set("category", key);
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const chamberOuterRef = useRef<HTMLDivElement>(null);
  const chamberTrackRef = useRef<HTMLDivElement>(null);
  const philRef         = useRef<HTMLDivElement>(null);
  const closingRef      = useRef<HTMLDivElement>(null);

  const filtered = activeFilter === "all" ? workshops : workshops.filter(w => w.category === activeFilter);

  // ── Philosophy candlelight ────────────────────────────────────────────────
  const { scrollYProgress: philP } = useScroll({ target: philRef, offset: ["start 75%", "end 25%"] });
  const lightPos = useTransform(philP, [0.05, 0.92], [0, 1]);

  // ── Hero parallax ─────────────────────────────────────────────────────────
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroP, [0, 0.7], [1, 0]);
  const skybeamY = useTransform(heroP, [0, 1], ["0%", "18%"]);
  const skybeamRot = useTransform(heroP, [0, 1], [0, 1.5]);
  const smoothSkyRot = useSpring(skybeamRot, { stiffness: 20, damping: 15 });

  // ── GSAP horizontal chamber — Nature & Earth ──────────────────────────────
  const natureWorkshops = workshops.filter(w => w.category === "nature-earth");
  useGSAP(() => {
    const track   = chamberTrackRef.current;
    const wrapper = chamberOuterRef.current;
    if (!track || !wrapper) return;
    const totalScroll = (natureWorkshops.length - 1) * window.innerWidth;
    const tween = gsap.to(track, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${totalScroll}`,
        scrub: 1.4,
        invalidateOnRefresh: true,
      },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, { scope: chamberOuterRef });

  return (
    <>
      <Navigation />

      {/* ════════════════════════════════════════════════════════════════════
          § 0 — THRESHOLD HERO
      ════════════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ clipPath: "inset(0 50% 0 50%)" }}
        animate={{ clipPath: "inset(0 0% 0 0%)" }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
        style={{ margin: 0 }}
      >
        <section
          ref={heroRef}
          aria-label="The Atelier — hero"
          style={{
            position: "relative",
            height: "100dvh",
            minHeight: "100svh",
            overflow: "hidden",
            background: "#1c2826", margin: 0, padding: 0,
          }}
        >
          {/* Layer A — natural light well (muted teal depth) */}
          <div className="atelier-weave" style={{
            position: "absolute", inset: 0, margin: 0,
            background: "radial-gradient(ellipse 130% 85% at 50% 12%, rgba(246,242,238,0.14) 0%, #2a4542 32%, #1c2826 58%, #141d1c 100%)",
          }} />

          {/* Layer C — soft grain */}
          <div style={{
            position: "absolute", inset: 0, margin: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")",
            opacity: 0.055,
          }} />

          {/* Layer E — Skylight beam (ivory + teal, diffuse) */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, margin: 0,
              background: "radial-gradient(ellipse 55% 38% at 72% -8%, rgba(246,242,238,0.2) 0%, rgba(106,143,139,0.12) 38%, transparent 72%)",
              y: skybeamY,
              rotate: smoothSkyRot,
              transformOrigin: "72% 0%",
            }}
          />

          {/* Left content block */}
          <motion.div style={{
            position: "absolute", inset: 0, margin: 0,
            display: "flex", flexDirection: "column", justifyContent: "center",
            paddingTop: "clamp(5.5rem, 14vh, 10.75rem)",
            paddingBottom: "clamp(5.5rem, 12vh, 7rem)",
            paddingLeft: "clamp(2rem,7vw,7rem)",
            paddingRight: "clamp(2rem,7vw,7rem)",
            y: heroY, opacity: heroOpacity,
            boxSizing: "border-box",
          }}>
            <div style={{ maxWidth: "min(55vw, 40rem)", width: "100%" }}>
              {/* eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "clamp(0.65rem, 2vh, 1.25rem)" }}
              >
                <div style={{ width: 28, height: 1, background: A.tealSoft }} />
                <span style={{
                  fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem",
                  letterSpacing: "0.4em", textTransform: "uppercase",
                  color: A.linen,
                }}>The Atelier · 20 Workshops</span>
              </motion.div>

              {/* Main headline — each word springs in */}
              {["Make", "Something", "Real."].map((word, i) => (
                <div
                  key={word}
                  style={{
                    overflow: "hidden",
                    lineHeight: 1.05,
                    paddingLeft: "0.08em",
                    paddingRight: "0.04em",
                    marginLeft: "-0.08em",
                  }}
                >
                  <motion.div
                    initial={{ y: "100%", rotate: [-2, 1, -3][i], opacity: 0 }}
                    animate={{ y: 0, rotate: 0, opacity: 1 }}
                    transition={{
                      delay: 0.7 + i * 0.12,
                      type: "spring",
                      stiffness: 120,
                      damping: 16,
                    }}
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(1.85rem, min(4vw, 6.5dvh), 3.35rem)",
                      fontWeight: 400,
                      lineHeight: 1.05,
                      color: A.ivory,
                      display: "block",
                      margin: 0,
                      WebkitFontSmoothing: "antialiased",
                    }}
                  >{word}</motion.div>
                </div>
              ))}

              {/* body */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{
                  fontFamily: "var(--font-lora)", fontSize: "clamp(0.85rem, min(1.35vw, 2.4dvh), 1.05rem)",
                  color: "rgba(246,242,238,0.78)", lineHeight: 1.65,
                  maxWidth: "44ch", marginTop: "clamp(0.85rem, 2.5vh, 1.5rem)", marginBottom: "clamp(1rem, 3vh, 1.75rem)",
                }}
              >
                Twenty workshops. Every material imaginable.<br />
                One promise: you leave with something you made.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, type: "spring", stiffness: 150, damping: 20 }}
                style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
              >
                <motion.a
                  href="#workshops"
                  style={{
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    padding: "1rem 2.2rem",
                    background: A.teal, color: A.ivory,
                    textDecoration: "none", display: "inline-flex",
                    alignItems: "center", gap: "0.55rem",
                    fontWeight: 500,
                  }}
                  whileHover={{ background: A.tealSoft }}
                  whileTap={{ scale: 0.97 }}
                >
                  Browse Workshops <ArrowRight size={14} />
                </motion.a>
                <motion.a
                  href="#private"
                  style={{
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    padding: "1rem 2.2rem",
                    border: `1px solid rgba(47,111,106,0.45)`,
                    color: A.linen, textDecoration: "none",
                    display: "inline-flex", alignItems: "center", gap: "0.55rem",
                    fontWeight: 500,
                  }}
                  whileHover={{ borderColor: A.tealSoft, color: A.ivory, background: "rgba(47,111,106,0.12)" }}
                >
                  Book a Private Event <ArrowRight size={14} />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — 5 floating polaroid photographs (real workshop art) */}
          <div style={{ position: "absolute", inset: 0, margin: 0, pointerEvents: "none" }}>
            {HERO_POLAROIDS.map((p) => (
              <motion.div
                key={p.workshop.id}
                initial={{ y: p.yFrom, x: p.xFrom, rotate: (p.rotation > 0 ? p.rotation * 3 : p.rotation * 2), opacity: 0 }}
                animate={{ y: 0, x: 0, rotate: p.rotation, opacity: 1 }}
                transition={{
                  delay: 0.8 + p.delay,
                  type: "spring", stiffness: 120, damping: 16,
                }}
                style={{
                  position: "absolute",
                  top: p.top, right: p.right,
                  width: 200, height: 260,
                  border: `8px solid ${A.ivory}`,
                  borderRadius: 2,
                  boxShadow: "8px 18px 36px rgba(26,36,35,0.35)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  background: A.paper,
                }}
              >
                <div style={{ position: "relative", flex: 1, minHeight: 0, width: "100%" }}>
                  <img
                    src={p.workshop.image}
                    alt={p.workshop.title}
                    width={184}
                    height={184}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      margin: 0,
                      background: "linear-gradient(to top, rgba(42,61,58,0.22) 0%, transparent 45%)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    padding: "0.35rem 0.45rem 0.5rem",
                    background: A.ivory,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-caveat)", fontWeight: 700,
                      fontSize: "0.88rem", color: A.inkMuted,
                      lineHeight: 1.15,
                      display: "block",
                    }}
                  >
                    {p.workshop.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom "next workshop" bar */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 150, damping: 22 }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1rem clamp(2rem,7vw,7rem)",
              borderTop: `1px solid ${A.edge}`,
              background: "rgba(28,40,38,0.72)", backdropFilter: "blur(14px)",
              margin: 0,
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: A.linen }}>
                Next Workshop
              </span>
              <div style={{ width: 1, height: 12, background: "rgba(106,143,139,0.35)" }} />
              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", color: A.ivory }}>
                Pottery · This Saturday · 4 spots left
              </span>
            </div>
            <motion.a
              href="#workshops"
              style={{
                fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: A.linen, textDecoration: "none",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
              whileHover={{ color: A.ivory }}
            >Book Now <ArrowRight size={11} /></motion.a>
          </motion.div>
        </section>
      </motion.div>

      {/* ════════════════════════════════════════════════════════════════════
          § 1 — THE PHILOSOPHY (candlelight reading)
      ════════════════════════════════════════════════════════════════════ */}
      <section
        ref={philRef}
        aria-label="The Atelier philosophy"
        style={{
          minHeight: "clamp(360px, 58vh, 640px)",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-start", alignItems: "flex-start",
          background: `linear-gradient(165deg, ${A.ivory} 0%, ${A.wash} 42%, ${A.paper} 100%)`,
          padding: "clamp(5rem, 16vh, 9rem) clamp(2rem, 7vw, 7rem) clamp(2.5rem, 8vh, 5rem)",
          position: "relative", margin: 0,
        }}
      >
        <div className="atelier-weave" style={{ position: "absolute", inset: 0, margin: 0, opacity: 0.85, pointerEvents: "none" }} />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "left",
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "min(44rem, 92vw)",
            margin: 0,
            marginRight: "auto",
            paddingLeft: 0,
            paddingRight: "clamp(1rem, 4vw, 2rem)",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(1.85rem, min(5vw, 7.5dvh), 4.25rem)",
              lineHeight: 1.22,
              margin: 0,
              letterSpacing: "0.01em",
              WebkitFontSmoothing: "antialiased",
              textAlign: "left",
              textWrap: "balance",
            }}
            aria-label={PHIL_WORDS.join(" ")}
          >
            {PHIL_WORDS.map((word, i) => (
              <PhilosophyWord
                key={i}
                word={word}
                position={i / (PHIL_WORDS.length - 1)}
                lightPos={lightPos}
              />
            ))}
          </p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
            style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: A.tealSoft, marginTop: "clamp(1.25rem, 4vh, 2rem)",
              textAlign: "left",
            }}
          >— The Atelier</motion.p>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 2 — THE NUMBERS
      ════════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Atelier by the numbers"
        style={{
          background: A.paper, borderTop: `1px solid ${A.edge}`, borderBottom: `1px solid ${A.edge}`,
          margin: 0,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", margin: 0 }}>
          {[
            { value: 20,   label: "Workshops",      sub: "Something for every pair of hands.", accent: A.teal },
            { value: 4,    label: "Categories",     sub: "Nature · Light · Imagination · Craft", accent: A.tealSoft },
            { value: 2,    label: "Average Session", sub: "Long enough to make something real.", accent: A.wood, isTime: true },
            { value: 1200, label: "Makers Hosted",  sub: "And counting, always counting.", accent: A.linen },
          ].map((s, i) => (
            <div key={i} style={{ borderRight: i < 3 ? `1px solid ${A.edge}` : "none", margin: 0 }}>
              <StatCard {...s} />
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 3 — NATURE & EARTH (horizontal chamber)
      ════════════════════════════════════════════════════════════════════ */}
      <div
        ref={chamberOuterRef}
        aria-label="Nature & Earth workshops"
        style={{ height: `calc(100vh + ${(natureWorkshops.length - 1) * 100}vw)`, margin: 0 }}
      >
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", margin: 0 }}>
          {/* category watermark */}
          <div style={{
            position: "absolute", inset: 0, margin: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none", zIndex: 0,
          }}>
            <span style={{
              fontFamily: "var(--font-playfair)", fontWeight: 900,
              fontSize: "clamp(6rem,16vw,18rem)",
              color: "rgba(47,111,106,0.06)",
              userSelect: "none", letterSpacing: "-0.03em",
              whiteSpace: "nowrap",
            }}>NATURE &amp; EARTH</span>
          </div>

          {/* category header */}
          <div style={{ position: "absolute", top: "3rem", left: "clamp(2rem,6vw,6rem)", zIndex: 10, display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 20, height: 1, background: A.tealSoft }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(47,111,106,0.68)" }}>
              01 · Nature &amp; Earth · 6 Workshops
            </span>
          </div>

          {/* horizontal track */}
          <div
            ref={chamberTrackRef}
            style={{
              display: "flex", height: "100%",
              width: `${natureWorkshops.length * 100}vw`,
              margin: 0,
            }}
          >
            {natureWorkshops.map((w, i) => (
              <div
                key={w.id}
                className="ne-panel"
                style={{
                  width: "100vw", height: "100%", flexShrink: 0,
                  position: "relative", overflow: "hidden",
                  background: w.gradient, margin: 0,
                }}
              >
                {/* real photo */}
                <img src={w.image} alt={w.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {/* gradient colour tint */}
                <div style={{ position: "absolute", inset: 0, margin: 0, background: w.gradient, opacity: 0.45, mixBlendMode: "multiply" }} />
                {/* bottom fade */}
                <div style={{ position: "absolute", inset: 0, margin: 0, background: "linear-gradient(to top, rgba(30,42,40,0.78) 0%, transparent 55%)" }} />

                {/* ghost number */}
                <div style={{
                  position: "absolute", right: "4vw", top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-playfair)", fontWeight: 700,
                  fontSize: "clamp(10rem,18vw,20rem)", lineHeight: 1,
                  color: "rgba(255,255,255,0.025)",
                  userSelect: "none", letterSpacing: "-0.05em",
                }}>{String(i + 1).padStart(2, "0")}</div>

                {/* content */}
                <div style={{
                  position: "absolute", bottom: "3.5rem", left: "clamp(3rem,6vw,7rem)",
                  maxWidth: "min(580px, 48vw)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div style={{ width: 16, height: 1, background: w.accentColor }} />
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", letterSpacing: "0.28em", textTransform: "uppercase", color: w.accentColor }}>{w.duration}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{w.groupSize} people</span>
                  </div>

                  {w.isPopular && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem",
                      letterSpacing: "0.22em", textTransform: "uppercase",
                      color: A.teal, border: "1px solid rgba(47,111,106,0.35)",
                      background: "rgba(47,111,106,0.07)", padding: "0.3rem 0.6rem",
                      marginBottom: "0.75rem",
                    }}>◆ Most Popular</div>
                  )}

                  <h3 style={{
                    fontFamily: "var(--font-playfair)", fontStyle: "italic",
                    fontSize: "clamp(2.2rem,4.5vw,4.5rem)",
                    fontWeight: 900, color: A.ivory, lineHeight: 1.05, margin: 0, marginBottom: "0.6rem",
                  }}>{w.title}</h3>

                  <p style={{
                    fontFamily: "var(--font-lora)", fontStyle: "italic",
                    fontSize: "clamp(0.82rem,1.2vw,1rem)",
                    color: "rgba(246,242,238,0.62)", lineHeight: 1.7, margin: 0, marginBottom: "1.25rem",
                  }}>{w.description}</p>

                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", alignItems: "center" }}>
                    <div style={{ width: 20, height: 1, background: "rgba(255,255,255,0.2)" }} />
                    <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: A.linen }}>
                      Next: {w.nextDate} · {w.spotsLeft} spots
                    </span>
                    <span style={{ fontFamily: "var(--font-lora)", fontSize: "0.95rem", color: A.ivory }}>{w.price} MAD</span>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <motion.button
                      style={{
                        fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        padding: "0.75rem 1.5rem",
                        background: w.accentColor, color: A.ivory, cursor: "pointer",
                        border: "none",
                      }}
                      whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
                    >Book This Workshop</motion.button>
                    <motion.button
                      style={{
                        fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
                        letterSpacing: "0.2em", textTransform: "uppercase",
                        padding: "0.75rem 1.25rem",
                        border: `1px solid ${w.accentColor}55`,
                        background: "transparent", color: w.accentColor, cursor: "pointer",
                      }}
                      whileHover={{ borderColor: w.accentColor }}
                    >Learn More</motion.button>
                  </div>
                </div>

                {/* accent stripe right */}
                <div style={{
                  position: "absolute", right: 0, top: 0, bottom: 0,
                  width: 1, margin: 0,
                  background: `linear-gradient(to bottom, transparent, ${w.accentColor}44, transparent)`,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          § 4 — LIGHT & WONDER
      ════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Light & Wonder workshops" style={{ background: "#1a2322", margin: 0 }}>
        {/* category header sweep */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ padding: "5rem clamp(2rem,6vw,7rem) 3rem", position: "relative" }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "linear" }}
            style={{
              position: "absolute", top: "3.5rem", left: 0, right: 0,
              height: 2, margin: 0,
              background: `linear-gradient(90deg, transparent 0%, ${A.tealSoft}55 28%, ${A.ivory} 50%, ${A.tealSoft}55 72%, transparent 100%)`,
              transformOrigin: "left",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 20, height: 1, background: A.tealSoft }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(200,184,162,0.75)" }}>02 · Light &amp; Wonder · 5 Workshops</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem,4vw,4rem)", color: A.linen, margin: 0 }}>Light &amp; Wonder</h2>
        </motion.div>

        {workshops.filter(w => w.category === "light-wonder").map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex", flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              minHeight: "90vh", position: "relative",
              background: w.gradient, margin: 0, overflow: "hidden",
            }}
          >
            {/* image half */}
            <div style={{ width: "50%", flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <img src={w.image} alt={w.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, margin: 0, background: w.gradient, opacity: 0.5, mixBlendMode: "multiply" }} />
              {/* Candle flame for candle-making */}
              {w.id === "candle-making" && (
                <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 14, height: 22,
                    background: "linear-gradient(to top, #8C6A4F 0%, #CBB89D 55%, rgba(246,242,238,0.92) 100%)",
                    borderRadius: "50% 50% 20% 20% / 40% 40% 25% 25%",
                    animation: "atelier-flicker 2.5s ease-in-out infinite alternate",
                    filter: "drop-shadow(0 0 10px rgba(203,184,157,0.55)) drop-shadow(0 0 20px rgba(106,143,139,0.35))",
                    transformOrigin: "50% 100%",
                  }} />
                  <div style={{ width: 2, height: 60, background: "rgba(42,35,32,0.85)" }} />
                  <div style={{
                    width: 50, height: 16,
                    background: "radial-gradient(ellipse at 50% 20%, rgba(203,184,157,0.35) 0%, transparent 70%)",
                    marginTop: -4,
                  }} />
                </div>
              )}

              {/* Glow-in-dark neon title */}
              {w.id === "glow-dark" && (
                <div style={{ position: "absolute", inset: 0, margin: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <motion.div
                    initial={{ textShadow: "none", opacity: 0 }}
                    whileInView={{
                      textShadow: "0 0 12px rgba(186,218,208,0.55), 0 0 28px rgba(106,143,139,0.35), 0 0 52px rgba(47,111,106,0.18)",
                      opacity: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, ease: "easeInOut" }}
                    style={{
                      fontFamily: "var(--font-playfair)", fontStyle: "italic",
                      fontWeight: 900, fontSize: "clamp(2rem, 4vw, 4.5rem)",
                      color: "#c5ddd4", lineHeight: 1.1, textAlign: "center",
                      padding: "0 2rem",
                    }}
                  >Glow<br />in the<br />Dark</motion.div>
                </div>
              )}

              {/* Ink blooms for glass painting */}
              {w.id === "glass-painting" && (
                <>
                  {[
                    { x: "15%", y: "20%", color: "rgba(47,111,106,0.16)", size: 300, delay: 0 },
                    { x: "70%", y: "65%", color: "rgba(203,184,157,0.18)", size: 240, delay: 0.2 },
                    { x: "45%", y: "45%", color: "rgba(106,143,139,0.14)", size: 200, delay: 0.4 },
                  ].map((bloom, bi) => (
                    <motion.div
                      key={bi}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65 + bi * 0.15, delay: bloom.delay, ease: "easeOut" }}
                      style={{
                        position: "absolute",
                        left: bloom.x, top: bloom.y,
                        transform: "translate(-50%, -50%)",
                        width: bloom.size, height: bloom.size,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${bloom.color} 0%, transparent 70%)`,
                        margin: 0,
                      }}
                    />
                  ))}
                </>
              )}

              {/* Soap felting — material swatches */}
              {w.id === "soap-felting" && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 0, margin: 0 }}>
                  {[["#2F6F6A", 4], ["#6A8F8B", 6], ["#8C6A4F", 4], ["#CBB89D", 3]].map(([color, h], si) => (
                    <motion.div
                      key={si}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: si * 0.1, ease: "easeOut" }}
                      style={{ height: h as number, background: color as string, transformOrigin: "left", margin: 0 }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* content half */}
            <div style={{
              width: "50%", padding: "clamp(3rem,5vw,6rem)",
              display: "flex", flexDirection: "column", justifyContent: "center",
              position: "relative",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: 16, height: 1, background: w.accentColor }} />
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: w.accentColor }}>{String(i + 1).padStart(2, "0")} / 05</span>
                {w.id === "glow-dark" && (
                  <div style={{ display: "flex", gap: "0.4rem", marginLeft: "0.5rem" }}>
                    {["Kids", "Adults"].map(g => (
                      <span key={g} style={{
                        fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem",
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        padding: "0.25rem 0.6rem",
                        border: `1px solid ${w.accentColor}55`,
                        color: w.accentColor, background: `${w.accentColor}12`,
                      }}>{g}</span>
                    ))}
                  </div>
                )}
              </div>

              <h3 style={{
                fontFamily: "var(--font-playfair)", fontStyle: "italic",
                fontWeight: 900,
                fontSize: "clamp(2rem,4vw,4rem)",
                color: w.id === "glow-dark" ? "#c5ddd4" : A.ivory,
                lineHeight: 1.05, margin: 0, marginBottom: "0.65rem",
              }}>{w.title}</h3>

              <p style={{
                fontFamily: "var(--font-lora)", fontStyle: "italic",
                fontSize: "1rem", color: "rgba(200,184,162,0.88)",
                lineHeight: 1.5, marginBottom: "1.5rem",
              }}>{w.tagline}</p>

              <p style={{
                fontFamily: "var(--font-lora)",
                fontSize: "0.88rem", color: "rgba(246,242,238,0.58)",
                lineHeight: 1.8, marginBottom: "1.75rem", maxWidth: "42ch",
              }}>{w.description}</p>

              {/* what you'll make */}
              <div style={{
                borderLeft: `2px solid ${A.edge}`,
                paddingLeft: "1rem", marginBottom: "2rem",
              }}>
                <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", letterSpacing: "0.22em", textTransform: "uppercase", color: A.linen, marginBottom: "0.4rem" }}>You&apos;ll Take Home</div>
                <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.82rem", color: "rgba(246,242,238,0.62)", lineHeight: 1.6, margin: 0 }}>{w.whatYoullMake}</p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.14em", color: A.tealSoft }}>{w.duration}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: A.tealSoft, display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.14em", color: A.tealSoft }}>{w.groupSize} people</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: A.tealSoft, display: "inline-block" }} />
                <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.14em", color: A.linen }}>Next: {w.nextDate}</span>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <motion.button
                  style={{
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    padding: "0.75rem 1.5rem",
                    background: w.id === "glow-dark" ? A.tealSoft : w.accentColor,
                    color: A.ivory, cursor: "pointer", border: "none",
                  }}
                  whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
                >Book · {w.price} MAD</motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 5 — IMAGINATION & EXPRESSION
      ════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Imagination & Expression workshops" style={{ background: "#1e2524", margin: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ padding: "5rem clamp(2rem,6vw,7rem) 3rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 20, height: 1, background: A.tealSoft }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(106,143,139,0.75)" }}>03 · Imagination &amp; Expression · 5 Workshops</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem,4vw,4rem)", color: A.linen, margin: 0 }}>Imagination &amp; Expression</h2>
        </motion.div>

        {workshops.filter(w => w.category === "imagination").map((w, i) => {
          const isSurrealism = w.id === "surrealism-painting";
          const isEmotional  = w.id === "emotional-expression";

          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                minHeight: "90vh", background: w.gradient,
                position: "relative", overflow: "hidden",
                display: "flex", alignItems: "center",
                padding: "clamp(3rem,6vw,8rem) clamp(2rem,7vw,8rem)",
                margin: 0,
              }}
            >
              {/* real photo background */}
              <img src={w.image} alt={w.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: w.gradient, opacity: 0.72, mixBlendMode: "multiply", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(30,38,36,0.42)", pointerEvents: "none" }} />
              {/* Surrealism: floating SVG objects */}
              {isSurrealism && SURREAL_OBJECTS.map((obj, oi) => (
                <motion.div
                  key={oi}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: obj.opacity, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: oi * 0.1, duration: 0.8 }}
                  animate={obj.dur > 0 ? {
                    rotate: [obj.rotation, obj.rotation + 3, obj.rotation - 2, obj.rotation],
                    y: [0, -8, 4, 0],
                  } : undefined}
                  style={{
                    position: "absolute", left: obj.x, top: obj.y,
                    transform: `rotate(${obj.rotation}deg)`,
                    margin: 0, pointerEvents: "none",
                    transition: obj.dur > 0 ? undefined : "none",
                    animationDuration: obj.dur > 0 ? `${obj.dur}s` : undefined,
                    animationIterationCount: obj.dur > 0 ? "infinite" : undefined,
                  }}
                >
                  <SurrealShape type={obj.type} size={obj.size} />
                </motion.div>
              ))}

              <div style={{ maxWidth: "min(620px, 55vw)", position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(106,143,139,0.75)", marginBottom: "1.25rem" }}>
                  {String(i + 1).padStart(2, "0")} / 05
                </div>

                {/* Surrealism: warped title letters */}
                {isSurrealism ? (
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.5rem,5vw,5rem)", lineHeight: 1, margin: 0, marginBottom: "0.75rem" }}>
                    {w.title.split("").map((ch, ci) => {
                      const rots = [0, -2, 4, -1, 6, -3, 2, 0, -4, 3, -1, 2, 0, -2, 3, -1, 2];
                      return (
                        <motion.span
                          key={ci}
                          style={{
                            display: "inline-block",
                            color: A.ivory,
                            rotate: `${rots[ci % rots.length]}deg`,
                          }}
                          whileHover={{ rotate: "0deg" }}
                          transition={{ type: "spring", stiffness: 280, damping: 18 }}
                        >{ch === " " ? "\u00A0" : ch}</motion.span>
                      );
                    })}
                  </h3>
                ) : (
                  <h3 style={{
                    fontFamily: "var(--font-playfair)", fontStyle: "italic",
                    fontWeight: 900, fontSize: "clamp(2.2rem,4.5vw,4.5rem)",
                            color: A.ivory, lineHeight: 1.05, margin: 0, marginBottom: "0.75rem",
                  }}>{w.title}</h3>
                )}

                <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "1rem", color: "rgba(203,184,157,0.9)", lineHeight: 1.5, marginBottom: "1.5rem" }}>{w.tagline}</p>
                <p style={{ fontFamily: "var(--font-lora)", fontSize: "0.88rem", color: "rgba(246,242,238,0.55)", lineHeight: 1.82, marginBottom: "1.75rem", maxWidth: "48ch" }}>{w.description}</p>

                {/* Emotional expression: reassurance card */}
                {isEmotional && (
                  <div style={{
                    borderLeft: `2px solid ${A.tealSoft}`,
                    paddingLeft: "1.25rem", marginBottom: "1.75rem",
                  }}>
                    <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.9rem", color: A.ivory, lineHeight: 1.7, margin: 0 }}>
                      ◆ No experience needed. No judgment. No wrong answer.<br />
                      Just you, paint, and permission to feel.
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <motion.button
                    style={{
                      fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      padding: "0.75rem 1.5rem",
                      background: A.teal, color: A.ivory,
                      cursor: "pointer", border: "none",
                    }}
                    whileHover={{ opacity: 0.88 }} whileTap={{ scale: 0.97 }}
                  >{isEmotional ? "Reserve Your Space" : "Book Workshop"} · {w.price} MAD</motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 6 — MAKING & CRAFT (bento grid)
      ════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Making & Craft workshops" style={{ background: "#1c2221", margin: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ padding: "5rem clamp(2rem,6vw,7rem) 3rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 20, height: 1, background: A.wood }} />
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(140,106,79,0.72)" }}>04 · Making &amp; Craft · 5 Workshops</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(2rem,4vw,4rem)", color: A.linen, margin: 0 }}>Making &amp; Craft</h2>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "480px 380px",
          gap: 3,
          padding: "0 clamp(1rem,3vw,3rem) 3rem",
          margin: 0,
        }}>
          {workshops.filter(w => w.category === "making-craft").map((w, i) => {
            const gridAreas = [
              { gridColumn: "1 / 5",  gridRow: "1" },
              { gridColumn: "5 / 8",  gridRow: "1" },
              { gridColumn: "8 / 13", gridRow: "1" },
              { gridColumn: "1 / 7",  gridRow: "2" },
              { gridColumn: "7 / 13", gridRow: "2" },
            ];
            const isWood = w.id === "wood-carving";
            const isMiniWorld = w.id === "miniature-worlds";

            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  ...gridAreas[i],
                  position: "relative", overflow: "hidden",
                  background: w.gradient, cursor: "pointer", margin: 0,
                }}
                whileHover="hovered"
              >
                {/* real photo */}
                <img src={w.image} alt={w.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, background: w.gradient, opacity: 0.5, mixBlendMode: "multiply", pointerEvents: "none" }} />
                {/* chisel sweep for wood carving */}
                {isWood && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    style={{
                      position: "absolute", inset: 0, margin: 0,
                      background: "linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.06) 50%, transparent 55%)",
                      animation: "atelier-chisel 900ms 0.5s ease-out both",
                    }}
                  />
                )}

                {/* hover overlay */}
                <motion.div
                  variants={{ hovered: { opacity: 1 } }}
                  initial={{ opacity: 0 }}
                  style={{
                    position: "absolute", inset: 0, margin: 0,
                    background: "linear-gradient(to top, rgba(32,42,40,0.82) 0%, rgba(32,42,40,0.38) 55%, rgba(32,42,40,0.12) 100%)",
                  }}
                />

                {/* content (slides up on hover) */}
                <motion.div
                  variants={{ hovered: { y: 0, opacity: 1 } }}
                  initial={{ y: "30%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "1.5rem", margin: 0,
                  }}
                >
                  <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", letterSpacing: "0.22em", textTransform: "uppercase", color: A.linen, marginBottom: "0.4rem" }}>
                    {w.duration} · {w.groupSize} people
                  </div>
                  {isMiniWorld ? (
                    <div style={{ fontFamily: "var(--font-caveat)", fontWeight: 700, fontSize: "1.6rem", color: A.ivory, lineHeight: 1.1, marginBottom: "0.35rem" }}>
                      {w.title}
                    </div>
                  ) : (
                    <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(1.1rem,2vw,1.6rem)", color: A.ivory, lineHeight: 1.1, marginBottom: "0.35rem" }}>
                      {w.title}
                    </div>
                  )}
                  <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.78rem", color: "rgba(246,242,238,0.55)", lineHeight: 1.5, marginBottom: "1rem", maxWidth: "28ch" }}>{w.tagline}</p>
                  <motion.button
                    variants={{ hovered: { scale: 1, opacity: 1 } }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    transition={{ delay: 0.08 }}
                    style={{
                      fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      padding: "0.55rem 1.1rem",
                      background: A.wood, color: A.ivory,
                      cursor: "pointer", border: "none",
                    }}
                  >Book · {w.price} MAD</motion.button>
                </motion.div>

                {/* resting state label */}
                <motion.div
                  variants={{ hovered: { opacity: 0 } }}
                  style={{
                    position: "absolute", bottom: "1.25rem", left: "1.25rem",
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem",
                    letterSpacing: "0.2em", textTransform: "uppercase",
                    color: "rgba(140,106,79,0.65)",
                  }}
                >{isMiniWorld ? "Most Intimate" : ""}</motion.div>

                {/* accent line top */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${A.wood}55, transparent)`, margin: 0 }} />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 7 — FULL ATELIER CATALOGUE
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="workshops"
        aria-label="All 20 workshops"
        style={{
          background: `linear-gradient(180deg, ${A.wash} 0%, ${A.paper} 40%, ${A.ivory} 100%)`,
          margin: 0, paddingBottom: "6rem",
        }}
      >
        {/* Sticky filter bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100, margin: 0,
          background: "rgba(246,242,238,0.94)", backdropFilter: "blur(18px) saturate(1.2)",
          borderBottom: `1px solid ${A.edge}`,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.25rem",
            padding: "0.85rem clamp(1.5rem,5vw,5rem)",
            flexWrap: "wrap",
          }}>
            {[
              { key: "all", label: `All (${workshops.length})` },
              ...Object.entries(categoryConfig).map(([k, v]) => ({
                key: k,
                label: `${v.label} (${workshops.filter(w => w.category === k).length})`,
              })),
            ].map(({ key, label }) => {
              const active = activeFilter === key;
              const accent = key === "all" ? A.teal : categoryConfig[key as WorkshopCategory]?.accent ?? A.teal;
              return (
                <motion.button
                  key={key}
                  onClick={() => setCategoryFilter(key as WorkshopCategory | "all")}
                  style={{
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem",
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    padding: "0.45rem 0.85rem",
                    background: active ? `${accent}18` : "transparent",
                    border: active ? `1px solid ${accent}66` : "1px solid transparent",
                    color: active ? accent : A.ink,
                    opacity: active ? 1 : 0.72,
                    cursor: "pointer",
                    transition: "all 180ms",
                  }}
                  whileHover={{ color: A.teal, borderColor: A.edge, opacity: 1 }}
                >{label}</motion.button>
              );
            })}
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: "0.25rem" }}>
              {(["grid", "list"] as const).map(m => (
                <motion.button
                  key={m}
                  onClick={() => setViewMode(m)}
                  style={{
                    padding: "0.45rem",
                    background: viewMode === m ? "rgba(47,111,106,0.1)" : "transparent",
                    border: "1px solid transparent",
                    color: viewMode === m ? A.teal : A.ink,
                    opacity: viewMode === m ? 1 : 0.65,
                    cursor: "pointer",
                  }}
                >{m === "grid" ? <LayoutGrid size={14} /> : <AlignJustify size={14} />}</motion.button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "3rem clamp(1.5rem,5vw,5rem) 0" }}>
          {/* section header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: A.ink, margin: 0 }}>
              {activeFilter === "all" ? "All Workshops" : categoryConfig[activeFilter]?.label}
            </h2>
          </div>

          <AnimatePresence mode="popLayout">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                layout
                style={{
                  border: `1px solid ${A.edge}`,
                  borderRadius: 6,
                  overflow: "hidden",
                  background: A.paper,
                  margin: 0,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: 1,
                    background: `linear-gradient(180deg, ${A.deep}, ${A.deep})`,
                    margin: 0,
                  }}
                >
                  {filtered.map(w => (
                    <div key={w.id} style={{ background: A.ivory, minWidth: 0 }}>
                      <WorkshopCard w={w} isListView={false} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="list" style={{ borderTop: `1px solid ${A.edge}`, margin: 0 }}>
                {filtered.map(w => (
                  <WorkshopCard key={w.id} w={w} isListView={true} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 8 — PRIVATE EVENTS
      ════════════════════════════════════════════════════════════════════ */}
      <section
        id="private"
        aria-label="Private events"
        style={{
          minHeight: "85vh", position: "relative", overflow: "hidden",
          background: "radial-gradient(ellipse at 50% 85%, #2a3d38 0%, #1c2826 55%, #141c1b 100%)",
          display: "flex", alignItems: "flex-end",
          padding: "0 0 5rem", margin: 0,
        }}
      >
        <div className="atelier-weave" style={{ position: "absolute", inset: 0, margin: 0, opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, margin: 0, background: "radial-gradient(ellipse at 50% 100%, rgba(246,242,238,0.1) 0%, transparent 55%)" }} />

        {/* floating capacity pills */}
        {[["Min 8 people", "22%", "40%"], ["Full day options", "50%", "30%"], ["Custom workshop mix", "72%", "45%"]].map(([label, l, t]) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              position: "absolute", left: l, top: t,
              fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: A.linen,
              border: `1px solid ${A.edge}`,
              background: "rgba(28,40,38,0.55)",
              padding: "0.4rem 0.8rem",
              margin: 0,
            }}
          >{label}</motion.div>
        ))}

        <div style={{ position: "relative", zIndex: 2, padding: "0 clamp(2rem,7vw,8rem)", maxWidth: 780 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: A.tealSoft, marginBottom: "1.25rem" }}>
              Private Workshops &amp; Events
            </div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, fontSize: "clamp(2.4rem,5vw,5rem)", color: A.ivory, lineHeight: 1.1, marginBottom: "1.25rem" }}>
              The entire atelier,<br />yours for a day.
            </h2>
            <p style={{ fontFamily: "var(--font-lora)", fontSize: "1.05rem", color: "rgba(246,242,238,0.72)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "52ch" }}>
              Corporate team-building. Birthday celebrations. Bachelorette parties. Family days. School groups. We set it up. You make memories.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <motion.button
                style={{
                  fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "0.9rem 1.75rem",
                  border: `1px solid rgba(106,143,139,0.45)`,
                  background: "transparent", color: A.linen, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}
                whileHover={{ borderColor: A.tealSoft, background: "rgba(47,111,106,0.08)" }}
              >Enquire About Private Booking <ArrowRight size={13} /></motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 9 — CLOSING
      ════════════════════════════════════════════════════════════════════ */}
      <section
        ref={closingRef}
        aria-label="Closing"
        style={{
          minHeight: "70vh", background: "#1c2826",
          display: "flex", alignItems: "center",
          padding: "5rem clamp(2rem,7vw,8rem)",
          margin: 0, gap: "5vw",
        }}
      >
        {/* left image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: "0 0 min(50%, 480px)", aspectRatio: "3/4",
            background: "radial-gradient(ellipse at 50% 40%, #3d5c56 0%, #243330 55%, #161d1c 100%)",
            overflow: "hidden",
          }}
        >
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-caveat)", fontWeight: 700, fontSize: "1.2rem", color: "rgba(203,184,157,0.45)", textAlign: "center" }}>
              a finished piece<br />in someone&apos;s hands
            </span>
          </div>
        </motion.div>

        {/* right content */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: 1 }}
        >
          <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: A.tealSoft, marginBottom: "1.75rem" }}>
            BEGIN
          </div>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, fontSize: "clamp(2.2rem,4.5vw,4.2rem)", color: A.ivory, lineHeight: 1.15, marginBottom: "1.25rem" }}>
            Your hands have<br />been waiting.
          </h2>
          <p style={{ fontFamily: "var(--font-lora)", fontSize: "1rem", color: "rgba(246,242,238,0.62)", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "38ch" }}>
            Pick a workshop. Book a session.<br />Come make something real.
          </p>
          <motion.a
            href="#workshops"
            style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "0.9rem 1.75rem",
              border: `1px solid rgba(106,143,139,0.4)`,
              background: "transparent", color: A.linen,
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
            }}
            whileHover={{ borderColor: A.tealSoft, background: "rgba(47,111,106,0.08)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ margin: 0 }}>
              <path d="M6 1L6 11M2 7L6 11L10 7" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
            See All Workshops
          </motion.a>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

export default function WorkshopsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: A.wash }} aria-hidden />}>
      <WorkshopsPageContent />
    </Suspense>
  );
}
