"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, Heart, X, Grid3X3, List, ChevronDown } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroTitle from "@/components/effects/HeroTitle";
import GoldenCompass from "@/components/effects/GoldenCompass";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import { antiques, categories, type Antique, type Category } from "@/lib/data/antiques";
import { formatPrice, cn } from "@/lib/utils";
import { toast } from "sonner";

/** Hero photography — curiosity cabinet interior */
const ANTIQUES_HERO_BG = "/images/nav/antque.jpeg";

// ── Entrance mark — pre-computed at module scope (toFixed(3)) ───────────────
// 8-pointed star (center 70,70, outerR=52, innerR=21, 16 vertices @ 22.5° steps)
const ENT_STAR_PATH = (() => {
  const pts = Array.from({ length: 16 }).map((_, i) => {
    const a = (i * 22.5 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? 52 : 21;
    return `${(70 + r * Math.cos(a)).toFixed(3)},${(70 + r * Math.sin(a)).toFixed(3)}`;
  });
  return `M ${pts.join(" L ")} Z`;
})();

// 24 tick marks on outer ring (r=60→65, center 70,70)
const ENT_TICKS = Array.from({ length: 24 }).map((_, i) => {
  const a     = (i * 15 - 90) * (Math.PI / 180);
  const major = i % 6 === 0;
  const r1    = major ? 56 : 61;
  return {
    x1: (70 + r1 * Math.cos(a)).toFixed(3),
    y1: (70 + r1 * Math.sin(a)).toFixed(3),
    x2: (70 + 65 * Math.cos(a)).toFixed(3),
    y2: (70 + 65 * Math.sin(a)).toFixed(3),
    major,
  };
});

// 8 nodes at r=47 (inside the rotating ring)
const ENT_NODES = Array.from({ length: 8 }).map((_, i) => {
  const a = (i * 45 - 90) * (Math.PI / 180);
  return {
    cx: (70 + 47 * Math.cos(a)).toFixed(3),
    cy: (70 + 47 * Math.sin(a)).toFixed(3),
  };
});

// ── Thin rule used between modal sections ───────────────────────────────────
const Rule = () => (
  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "2.5rem 0" }} />
);

export default function AntiquesPage() {
  const [cat,          setCat]          = useState<Category>("all");
  const [search,       setSearch]       = useState("");
  const [view,         setView]         = useState<"grid" | "list">("grid");
  const [favorites,    setFavorites]    = useState<string[]>([]);
  const [activeItem,   setActiveItem]   = useState<Antique | null>(null);
  const [showEntrance, setShowEntrance] = useState(true);

  // Track document scroll directly — no target/container needed, no position warning.
  // 900px ≈ full viewport height on a typical laptop; covers the hero's min-h:100svh.
  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 900], ["0%",  "20%"]);
  const heroOpacity = useTransform(scrollY, [0, 650], [1,     0   ]);
  /** Background moves slower than foreground copy — keeps scroll choreography */
  const heroBgY     = useTransform(scrollY, [0, 900], ["0%",  "14%"]);

  const filtered = useMemo(() =>
    antiques.filter(a =>
      (cat === "all" || a.category === cat) &&
      (!search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.origin.toLowerCase().includes(search.toLowerCase()))
    ), [cat, search]);

  const toggleFav = (id: string) => {
    setFavorites(f => {
      const already = f.includes(id);
      toast(already ? "Removed from saved" : "Saved to collection");
      return already ? f.filter(x => x !== id) : [...f, id];
    });
  };

  // Lock body scroll while entrance gate is showing
  useEffect(() => {
    document.body.style.overflow = showEntrance ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showEntrance]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#050302" }}>
      <Navigation />

      {/* ══════════════════════════════════════════════════════════════════════
          ENTRANCE  —  cinematic gate before the collection
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showEntrance && (
          <motion.div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#050302",
              margin: 0,
              padding: 0,
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Ornamental cap & base lines */}
            {(["top-16", "bottom-16"] as const).map(pos => (
              <motion.div
                key={pos}
                className={`absolute ${pos} left-1/2 -translate-x-1/2`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                style={{
                  width: 88,
                  height: 1,
                  background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)",
                  transformOrigin: "center",
                }}
              />
            ))}

            <div className="relative z-10 flex flex-col items-center gap-8 text-center">
              {/* SVG mark — Moroccan star seal */}
              <motion.div
                initial={{ scale: 0.65, opacity: 0, filter: "blur(16px)" }}
                animate={{ scale: 1,    opacity: 1, filter: "blur(0px)"  }}
                transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <svg
                  className="mx-auto block w-[min(17.5rem,88vw)] h-[min(17.5rem,88vw)] sm:w-72 sm:h-72 lg:w-80 lg:h-80"
                  viewBox="0 0 140 140"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Outer ring — draws in */}
                  <motion.circle cx="70" cy="70" r="65"
                    stroke="#C9A96E" strokeWidth="0.9" opacity="0.55"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 2.0, delay: 0.15, ease: "easeInOut" }} />
                  {/* 24 tick marks */}
                  {ENT_TICKS.map((t, i) => (
                    <motion.line key={i}
                      x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                      stroke="#C9A96E"
                      strokeWidth={t.major ? "1.0" : "0.5"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: t.major ? 0.65 : 0.3 }}
                      transition={{ delay: 0.25 + i * 0.035, duration: 0.35 }} />
                  ))}
                  {/* Second ring */}
                  <motion.circle cx="70" cy="70" r="52"
                    stroke="#C9A96E" strokeWidth="0.55" opacity="0.35"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }} />
                  {/* Rotating inner ring + 8 nodes */}
                  <motion.g
                    style={{ transformOrigin: "50% 50%" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                  >
                    <circle cx="70" cy="70" r="38"
                      stroke="#C9A96E" strokeWidth="0.45"
                      opacity="0.28" strokeDasharray="5 10" />
                    {ENT_NODES.map((n, i) => (
                      <circle key={i} cx={n.cx} cy={n.cy} r="2.2"
                        stroke="#C9A96E" strokeWidth="0.7"
                        fill="none" opacity="0.6" />
                    ))}
                  </motion.g>
                  {/* 8-pointed star — draws in with subtle fill */}
                  <motion.path
                    d={ENT_STAR_PATH}
                    stroke="#C9A96E" strokeWidth="0.7"
                    fill="#C9A96E" fillOpacity="0.05"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.8, delay: 0.85, ease: "easeInOut" }} />
                  {/* Inner ring */}
                  <motion.circle cx="70" cy="70" r="20"
                    stroke="#C9A96E" strokeWidth="0.75" opacity="0.55"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 1.55, ease: "easeInOut" }} />
                  {/* Center glow dot */}
                  <motion.circle cx="70" cy="70" r="4"
                    fill="#C9A96E"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.9 }}
                    style={{ transformOrigin: "70px 70px" }}
                    transition={{ duration: 0.5, delay: 2.0, type: "spring", stiffness: 300 }} />
                </svg>
              </motion.div>

              {/* Thin divider */}
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.65, delay: 1.65 }}
                style={{ width: 32, height: 1, background: "rgba(201,169,110,0.28)", transformOrigin: "center" }}
              />

              {/* Enter CTA */}
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.85, duration: 0.55 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowEntrance(false)}
                style={{
                  border: "1px solid rgba(201,169,110,0.3)",
                  color: "#C9A96E",
                  fontFamily: "var(--font-grotesk)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  padding: "0.9rem 2.75rem",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(201,169,110,0.07)";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.58)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.3)";
                }}
              >
                Enter the Cabinet
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO  —  full-viewport, gallery-style centered text block
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-x-hidden overflow-y-visible bg-[#050302]"
        style={{
          position: "relative",
          minHeight: "100svh",
        }}
      >
        {/* ── Hero photography + scrims (readable left-aligned type) ── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{ y: heroBgY }}
          aria-hidden
        >
          <div className="absolute left-1/2 top-1/2 h-[118%] w-[118%] min-h-[640px] -translate-x-1/2 -translate-y-1/2">
            <Image
              src={ANTIQUES_HERO_BG}
              alt=""
              fill
              priority
              className="object-cover object-[52%_42%]"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-[#050302]/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050302]/88 via-[#050302]/52 to-[#050302]/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050302]/82 via-transparent to-[#050302]/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_25%,transparent_30%,rgba(5,3,2,0.5)_85%)]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              background:
                "radial-gradient(circle at 78% 18%, rgba(201,169,110,0.07) 0%, transparent 55%)",
            }}
          />
        </motion.div>

        {/* ── Animated golden compass ── */}
        <div
          className="pointer-events-none absolute z-[5] hidden lg:block"
          style={{ top: "4%", right: "2%", width: "min(44vw, 580px)", height: "min(44vw, 580px)", opacity: 0.42 }}
        >
          <GoldenCompass />
        </div>

        {/* ── Text block — in document flow; page scrolls (nested overflow was unreliable) ── */}
        <motion.div
          style={{
            position: "relative",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
            width: "100%",
            boxSizing: "border-box",
            minHeight: "100svh",
            paddingTop:
              "calc(env(safe-area-inset-top, 0px) + clamp(10.75rem, 9rem + 6vmin, 14rem))",
            paddingBottom:
              "clamp(3.75rem, 4vmin + 2.75rem, 7.25rem)",
            paddingLeft:
              "max(1.25rem, min(7vw + 0.75rem, 7rem))",
            paddingRight:
              "max(1.25rem, min(7vw + 0.75rem, 7rem))",
            y: heroY,
            opacity: heroOpacity,
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(0.65rem, 2vw, 1rem)",
              marginBottom: "clamp(0.85rem, 2.2vmin, 1.35rem)",
              flexShrink: 0,
            }}
          >
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.45)" }} />
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
              letterSpacing: "0.36em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.78)",
              fontWeight: 500,
            }}>Antiques</span>
          </motion.div>

          {/* Main title */}
          <HeroTitle
            text="Held over Time."
            delay={0.2}
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.05rem, 2.65vw + 1.95vmin, 6.05rem)",
              fontWeight: 400, lineHeight: 1.05,
              color: "#F4F1E8", margin: 0,
              letterSpacing: "-0.02em",
              flexShrink: 0,
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-lora)",
              fontSize: "clamp(1.02rem, 1.75vw, 1.28rem)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "rgba(227,207,167,0.92)",
              lineHeight: 1.5,
              margin: "clamp(0.55rem, 1.25vmin, 0.85rem) 0 0",
              maxWidth: "min(38ch, 92vw)",
              textShadow: "0 2px 24px rgba(5,3,2,0.55)",
            }}
          >
            Old pieces, steady hands — still in everyday use.
          </motion.p>

          {/* Lead + Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: "clamp(1.35rem, 3vmin + 1rem, 2.45rem)",
              maxWidth: "min(39rem, 100%)",
              width: "100%",
              display: "flex", flexDirection: "column",
              gap: "clamp(1.2rem, 2.75vmin + 0.85rem, 1.95rem)",
            }}
          >
            <div
              style={{
                display: "flex", flexDirection: "column",
                gap: "1.05rem",
                textShadow: "0 2px 20px rgba(5,3,2,0.45)",
              }}
            >
              <p style={{
                fontFamily: "var(--font-garamond)",
                fontSize: "clamp(1.02rem, 1.42vw, 1.125rem)",
                fontWeight: 400,
                color: "rgba(248,246,239,0.9)",
                lineHeight: 1.72,
                margin: 0,
              }}>
                Many of these pieces arrived with histories already written — chipped glaze, fingerprints of other routines.
                They continue quietly at Everwood, doing what they were assembled to do.
              </p>
              <p style={{
                fontFamily: "var(--font-garamond)",
                fontSize: "clamp(0.98rem, 1.35vw, 1.065rem)",
                fontWeight: 400,
                color: "rgba(244,241,232,0.68)",
                lineHeight: 1.78,
                margin: 0,
              }}>
                Teacups, trays, the small utensils of habit: made to endure, still asked to prove it every afternoon.
                Time leaves a cast; it doesn&apos;t revoke the job.
              </p>
            </div>

            <div
              style={{
                padding: "clamp(1.35rem, 3.2vw, 1.75rem) clamp(1rem, 3vw, 1.5rem)",
                paddingLeft: "clamp(1.35rem, 4vw, 2rem)",
                marginLeft: 2,
                borderLeft: "1px solid rgba(201,169,110,0.35)",
                borderRadius: "0 2px 2px 0",
                boxShadow:
                  "inset 12px 0 32px -20px rgba(201,169,110,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
                background: "rgba(8, 6, 4, 0.35)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  display: "flex", alignItems: "center",
                  gap: "0.75rem", marginBottom: "1rem",
                }}
              >
                <span aria-hidden={true} style={{
                    flex: "0 0 12px",
                    height: 1,
                    background: "rgba(201,169,110,0.45)",
                  }}
                />
                <p style={{
                  fontFamily: "var(--font-grotesk)",
                  fontSize: "0.52rem",
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "rgba(201,169,110,0.78)",
                  margin: 0,
                  fontWeight: 600,
                }}>Philosophy</p>
              </div>
              <blockquote
                style={{
                  margin: 0,
                  padding: 0,
                  border: "none",
                  fontFamily: "var(--font-garamond)",
                  fontSize: "clamp(0.98rem, 1.35vw, 1.065rem)",
                  color: "rgba(244,241,232,0.82)",
                  lineHeight: 1.76,
                  display: "flex", flexDirection: "column",
                  gap: "0.92rem",
                }}
              >
                <p style={{ margin: 0 }}>
                  There&apos;s a difference between something that <em style={{ fontStyle: "italic", color: "rgba(227,207,167,0.94)" }}>works </em>
                  and something that was <em style={{ fontStyle: "italic", color: "rgba(227,207,167,0.94)" }}>made well</em>.
                </p>
                <p style={{
                  margin: 0,
                  fontStyle: "italic",
                  color: "rgba(232,226,212,0.74)",
                  fontSize: "clamp(0.97rem, 1.32vw, 1.035rem)",
                }}>
                  You feel it in small ways — how it sits, how it&apos;s shaped, how time has eased its edges.
                </p>
                <p style={{ margin: 0 }}>
                  The pieces we keep were part of daily life.&nbsp;&nbsp;They came from deliberate hands — even when no one was cheering the craftsperson&apos;s name.
                </p>
                <footer style={{
                  marginTop: "0.15rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(201,169,110,0.12)",
                }}>
                  <p style={{
                    margin: 0,
                    fontFamily: "var(--font-lora)",
                    fontStyle: "italic",
                    fontSize: "clamp(1.03rem, 1.42vw, 1.115rem)",
                    color: "rgba(201,169,110,0.85)",
                    lineHeight: 1.62,
                  }}>
                    That care is still there.&nbsp;&nbsp;We simply keep each one in daily use.
                  </p>
                </footer>
              </blockquote>
            </div>
          </motion.div>

          {/* Meta strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            style={{
              display: "flex", flexWrap: "wrap",
              gap: "clamp(1.75rem, 5vw, 3rem)",
              marginTop: "clamp(1.85rem, 4vmin + 1.25rem, 3.25rem)",
              borderLeft: "1px solid rgba(201,169,110,0.22)",
              paddingLeft: "1.75rem",
              flexShrink: 0,
              paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
            }}
          >
            {[
              { label: "Objects",    value: String(antiques.length) },
              { label: "Provenance", value: "12 Centuries" },
              { label: "Origins",    value: "40+ Countries" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{
                  fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
                  letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "rgba(201,169,110,0.45)",
                }}>{label}</span>
                <span style={{
                  fontFamily: "var(--font-grotesk)", fontSize: "0.72rem",
                  letterSpacing: "0.1em", color: "rgba(244,241,232,0.7)",
                }}>{value}</span>
              </div>
            ))}
          </motion.div>

          {/* Scroll cue — in flow under copy so it stays reachable while scrolling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            style={{
              marginTop: "clamp(2rem, 5vmin, 3.5rem)",
              display: "flex", alignItems: "center", gap: "0.75rem",
              flexShrink: 0,
            }}
          >
          <div style={{ width: 22, height: 1, background: "rgba(201,169,110,0.28)" }} />
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          >
            <ChevronDown size={14} style={{ color: "rgba(201,169,110,0.38)" }} />
          </motion.div>
          <p style={{
            fontFamily: "var(--font-grotesk)", fontSize: "0.54rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(201,169,110,0.32)",
          }}>Explore the Collection</p>
        </motion.div>

        </motion.div>

        {/* Bottom edge rule */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[21]"
          style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.1) 25%, rgba(201,169,110,0.1) 75%, transparent)" }}
        />
      </section>

      {/* ── Space between hero bottom and the filter bar ──────────────────── */}
      <div style={{ height: "5rem", background: "#050302" }} />

      {/* ══════════════════════════════════════════════════════════════════════
          CONTROLS  —  sticky filter bar
          In natural scroll flow there is 5rem of space above it. Once the user
          scrolls past that gap the bar sticks to top-0, always accessible.
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-40 py-7"
        style={{
          paddingLeft: "60px",
          paddingRight: "60px",
          background: "rgba(4,4,12,0.97)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(201,169,110,0.07)",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={cat === c}
                style={{
                  padding: "0.35rem 0.9rem",
                  fontFamily: "var(--font-grotesk)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: cat === c
                    ? "1px solid rgba(201,169,110,0.65)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color:      cat === c ? "#C9A96E" : "#3A3A52",
                  background: cat === c ? "rgba(201,169,110,0.06)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  if (cat !== c) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#8884A8";
                  }
                }}
                onMouseLeave={e => {
                  if (cat !== c) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#3A3A52";
                  }
                }}
              >{c}</button>
            ))}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-3 ml-auto">
            <span
              aria-live="polite"
              style={{
                fontFamily: "var(--font-grotesk)",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#3A3A52",
                marginRight: "0.5rem",
              }}
            >
              {filtered.length} {filtered.length === 1 ? "object" : "objects"}
            </span>

            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#3A3A52" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search objects…"
                aria-label="Search antiques by name or origin"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  paddingLeft: "2.25rem",
                  paddingRight: "1rem",
                  paddingTop: "0.475rem",
                  paddingBottom: "0.475rem",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-grotesk)",
                  color: "#F4F1E8",
                  outline: "none",
                  width: "12rem",
                  transition: "border-color 0.2s",
                }}
                onFocus={e  => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)")}
                onBlur={e   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              />
            </div>

            {([
              { mode: "grid" as const, icon: <Grid3X3 size={13} />, label: "Grid view" },
              { mode: "list" as const, icon: <List     size={13} />, label: "List view" },
            ]).map(({ mode, icon, label }) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                aria-label={label}
                aria-pressed={view === mode}
                style={{
                  padding: "0.475rem",
                  border: view === mode
                    ? "1px solid rgba(201,169,110,0.6)"
                    : "1px solid rgba(255,255,255,0.07)",
                  color: view === mode ? "#C9A96E" : "#3A3A52",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s",
                }}
              >{icon}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Visual separator between controls bar and collection ── */}
      <div style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "3.5rem", paddingBottom: 0 }}>
        <div className="flex items-center gap-6">
          <p style={{
            fontFamily: "var(--font-grotesk)",
            fontSize: "0.54rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#3A3A52",
            whiteSpace: "nowrap",
          }}>
            The Collection
          </p>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CABINET  —  grid or list of antique objects
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "2.5rem", paddingBottom: "10rem" }}>
        <motion.div
          className={cn(
            view === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16"
              : "flex flex-col"
          )}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                {view === "grid" ? (

                  /* ── Grid card: gradient "image" + always-visible info panel ── */
                  <div
                    className="group cursor-pointer"
                    onClick={() => setActiveItem(item)}
                  >
                    {/* Gradient image area */}
                    <div
                      className="relative overflow-hidden mb-5"
                      style={{ aspectRatio: "3/4", background: item.gradient }}
                    >
                      {/* Hover scale layer */}
                      <div
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]"
                        style={{ background: item.gradient }}
                      />
                      {/* Subtle hover veil */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "rgba(0,0,0,0.15)" }}
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                        {item.isNew
                          ? <span style={{
                              background: "#2AFFA8", color: "#03030A",
                              fontSize: "0.5rem", letterSpacing: "0.15em",
                              textTransform: "uppercase",
                              padding: "0.22rem 0.5rem",
                              fontFamily: "var(--font-grotesk)", fontWeight: 500,
                            }}>New</span>
                          : <span />
                        }
                        <button
                          onClick={e => { e.stopPropagation(); toggleFav(item.id); }}
                          aria-label={favorites.includes(item.id) ? "Remove from saved" : "Save to collection"}
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                          style={{
                            width: 30, height: 30, borderRadius: "50%",
                            background: "rgba(0,0,0,0.52)", backdropFilter: "blur(4px)",
                            border: "none", cursor: "pointer",
                          }}
                        >
                          <Heart size={11} style={{
                            fill: favorites.includes(item.id) ? "#C9A96E" : "none",
                            color: favorites.includes(item.id) ? "#C9A96E" : "white",
                          }} />
                        </button>
                      </div>

                      {/* Reserved overlay */}
                      {!item.available && (
                        <div className="absolute inset-0 flex items-center justify-center z-10"
                          style={{ background: "rgba(0,0,0,0.55)" }}>
                          <span style={{
                            fontSize: "0.55rem", letterSpacing: "0.22em",
                            textTransform: "uppercase", color: "#8884A8",
                            border: "1px solid rgba(136,132,168,0.28)",
                            padding: "0.35rem 0.85rem",
                            fontFamily: "var(--font-grotesk)",
                          }}>Reserved</span>
                        </div>
                      )}
                    </div>

                    {/* Always-visible editorial info panel — padded so text
                        never touches the card's left, right, or bottom edge  */}
                    <div style={{
                      paddingTop: "0.25rem",
                      paddingBottom: "1.75rem",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-grotesk)",
                        fontSize: "0.54rem",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        color: "#C9A96E",
                        marginBottom: "0.55rem",
                      }}>
                        {item.category} · {item.period}
                      </p>
                      <p style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1rem",
                        color: "#F4F1E8",
                        lineHeight: 1.4,
                        marginBottom: "0.65rem",
                        transition: "color 0.2s",
                      }}
                        className="group-hover:text-[var(--color-gold)]"
                      >
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between" style={{ marginTop: "0.25rem" }}>
                        <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.7rem", color: "#3A3A52", lineHeight: 1.6 }}>
                          {item.origin}
                        </p>
                        <p style={{
                          fontFamily: "var(--font-grotesk)",
                          fontSize: "0.78rem",
                          color: item.price ? "#C9A96E" : "#3A3A52",
                          fontFeatureSettings: '"tnum"',
                        }}>
                          {item.price ? formatPrice(item.price) : "POA"}
                        </p>
                      </div>
                    </div>
                  </div>

                ) : (

                  /* ── List row — top/bottom padding + subtle left/right inset
                     so no text is flush against the section edge             */
                  <motion.div
                    className="flex items-center gap-8 cursor-pointer"
                    style={{
                      padding: "2rem 1.5rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      margin: "0 -1.5rem",      /* bleed the hover bg edge-to-edge */
                    }}
                    onClick={() => setActiveItem(item)}
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.012)" }}
                  >
                    <div className="flex-shrink-0" style={{
                      width: 84, height: 84,
                      background: item.gradient,
                    }} />
                    <div className="flex-1 min-w-0">
                      <p style={{
                        fontFamily: "var(--font-grotesk)", fontSize: "0.54rem",
                        letterSpacing: "0.16em", textTransform: "uppercase",
                        color: "#C9A96E", marginBottom: "0.4rem",
                      }}>
                        {item.category}
                        {item.isNew && <span style={{
                          marginLeft: "0.5rem", background: "#2AFFA8", color: "#03030A",
                          padding: "0.1rem 0.35rem", fontSize: "0.48rem", letterSpacing: "0.12em",
                        }}>New</span>}
                      </p>
                      <h3 style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1.05rem", color: "#F4F1E8",
                        marginBottom: "0.35rem", lineHeight: 1.3,
                      }}>{item.name}</h3>
                      <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.7rem", color: "#3A3A52" }}>
                        {item.origin} · {item.period}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{
                        fontFamily: "var(--font-grotesk)", fontSize: "0.88rem",
                        color: item.price ? "#C9A96E" : "#3A3A52",
                        fontFeatureSettings: '"tnum"', marginBottom: "0.2rem",
                      }}>{item.price ? formatPrice(item.price) : "POA"}</p>
                      {!item.available && (
                        <p style={{ fontSize: "0.57rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3A3A52", fontFamily: "var(--font-grotesk)" }}>
                          Reserved
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-44">
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "1.9rem", color: "#3A3A52", marginBottom: "0.75rem", lineHeight: 1.4 }}>
              No objects found
            </p>
            <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3A3A52" }}>
              Try a different category or search term
            </p>
          </motion.div>
        )}
      </section>

      {/* ── Pre-footer spacer ── */}
      <div style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "5rem", paddingBottom: 0 }}>
        <div className="flex items-center gap-8 py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(201,169,110,0.08), transparent)" }} />
          <p style={{
            fontFamily: "var(--font-grotesk)",
            fontSize: "0.5rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(201,169,110,0.22)",
            whiteSpace: "nowrap",
          }}>
            Season 2026 · Casablanca
          </p>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, rgba(201,169,110,0.08), transparent)" }} />
        </div>
      </div>

      <Footer />

      {/* ══════════════════════════════════════════════════════════════════════
          DETAIL MODAL  —  premium auction-catalog layout
          Left: atmospheric visual panel  ·  Right: editorial lot description
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeItem && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[600]"
              style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
            />

            {/* Modal shell */}
            <motion.div
              className="fixed inset-2 md:inset-8 lg:inset-12 z-[700] flex flex-col md:flex-row overflow-hidden"
              style={{ background: "#080816", border: "1px solid rgba(201,169,110,0.1)" }}
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{   opacity: 0, y: 16, scale: 0.97  }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="dialog" aria-modal="true" aria-label={activeItem.name}
            >
              {/* ── Close — absolute to modal, stays fixed during scroll ── */}
              <button
                onClick={() => setActiveItem(null)}
                aria-label="Close"
                className="absolute top-5 right-6 z-20 flex items-center gap-2 transition-colors duration-200"
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-grotesk)", fontSize: "0.57rem",
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  color: "#3A3A52",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F4F1E8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#3A3A52")}
              >
                <X size={12} />
                <span>Close</span>
              </button>

              {/* ══ Visual panel ══════════════════════════════════════════ */}
              <div
                className="w-full md:w-[44%] xl:w-[42%] flex-shrink-0 relative min-h-[240px] md:min-h-full"
                style={{ background: activeItem.gradient }}
              >
                {/* Accent radial glow */}
                <div className="absolute inset-0" style={{
                  background: `radial-gradient(circle at 38% 50%, ${activeItem.accent}18 0%, transparent 55%)`,
                }} />

                {/* Giant initial letter */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.p
                    initial={{ scale: 0.78, opacity: 0 }}
                    animate={{ scale: 1,    opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.7 }}
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "clamp(6rem, 14vw, 12rem)",
                      color: activeItem.accent,
                      opacity: 0.13,
                      lineHeight: 1,
                      userSelect: "none",
                      pointerEvents: "none",
                    }}
                    aria-hidden="true"
                  >
                    {activeItem.name.charAt(0)}
                  </motion.p>
                </div>

                {/* New arrival */}
                {activeItem.isNew && (
                  <div className="absolute top-6 left-6"
                    style={{ background: "#2AFFA8", color: "#03030A", fontFamily: "var(--font-grotesk)", fontSize: "0.54rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.3rem 0.7rem" }}>
                    New Arrival
                  </div>
                )}

                {/* Category — bottom-left */}
                <div className="absolute bottom-7 left-7">
                  <p style={{
                    fontFamily: "var(--font-grotesk)",
                    fontSize: "0.54rem",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: activeItem.accent,
                    opacity: 0.6,
                  }}>{activeItem.category}</p>
                </div>
              </div>

              {/* ══ Editorial content panel ═══════════════════════════════ */}
              <div className="flex-1 overflow-y-auto">
                {/* Inner content — generous padding */}
                <div style={{
                  padding: "clamp(2.5rem, 5vw, 4.5rem) clamp(2rem, 5vw, 4rem) 3.5rem",
                  paddingTop: "clamp(3rem, 6vw, 5rem)",
                }}>

                  {/* Category + status row */}
                  <div className="flex items-center gap-4 mb-5">
                    <p style={{
                      fontFamily: "var(--font-grotesk)", fontSize: "0.57rem",
                      letterSpacing: "0.3em", textTransform: "uppercase", color: "#C9A96E",
                    }}>{activeItem.category}</p>
                    <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.1)", maxWidth: 64 }} />
                    {!activeItem.available && (
                      <span style={{
                        fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
                        letterSpacing: "0.18em", textTransform: "uppercase",
                        color: "#3A3A52", border: "1px solid rgba(58,58,82,0.45)",
                        padding: "0.15rem 0.5rem",
                      }}>Reserved</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)",
                    color: "#F4F1E8",
                    lineHeight: 1.13,
                    letterSpacing: "-0.01em",
                    marginBottom: "0.85rem",
                  }}>{activeItem.name}</h2>

                  {/* Subtitle */}
                  <p style={{
                    fontFamily: "var(--font-garamond)", fontStyle: "italic",
                    fontSize: "1.05rem", color: "#8884A8", lineHeight: 1.75,
                  }}>{activeItem.origin} · {activeItem.period}</p>

                  <Rule />

                  {/* Description */}
                  <p style={{
                    fontFamily: "var(--font-garamond)",
                    fontSize: "1.06rem", color: "#8884A8",
                    lineHeight: 1.95,
                  }}>{activeItem.description}</p>

                  <Rule />

                  {/* Specs grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem 3rem" }}>
                    {[
                      { label: "Dimensions", value: activeItem.dimensions },
                      { label: "Condition",  value: activeItem.condition  },
                      { label: "Origin",     value: activeItem.origin     },
                      { label: "Period",     value: activeItem.period     },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p style={{
                          fontFamily: "var(--font-grotesk)", fontSize: "0.54rem",
                          letterSpacing: "0.2em", textTransform: "uppercase",
                          color: "#3A3A52", marginBottom: "0.6rem",
                        }}>{label}</p>
                        <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.88rem", color: "#F4F1E8", lineHeight: 1.55 }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Rule />

                  {/* Provenance */}
                  <div>
                    <p style={{
                      fontFamily: "var(--font-grotesk)", fontSize: "0.54rem",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "#3A3A52", marginBottom: "0.9rem",
                    }}>Provenance</p>
                    <p style={{
                      fontFamily: "var(--font-garamond)", fontStyle: "italic",
                      fontSize: "0.97rem", color: "#8884A8", lineHeight: 1.92,
                    }}>{activeItem.provenance}</p>
                  </div>

                  <Rule />

                  {/* ── Price + Save  ─────────────────────────────────────
                       Row layout: price block on left, save button on right.
                       Large price figure with generous space above/below.      */}
                  <div style={{ marginBottom: "2.5rem" }}>

                    {/* Label */}
                    <p style={{
                      fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
                      letterSpacing: "0.26em", textTransform: "uppercase",
                      color: "#3A3A52", marginBottom: "1rem",
                    }}>
                      {activeItem.price ? "Estimate" : "Pricing"}
                    </p>

                    {/* Row: price left — save right, vertically centred */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>

                      {/* Price figure */}
                      {activeItem.price ? (
                        <p style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: "clamp(2rem, 4vw, 3rem)",
                          color: "#C9A96E",
                          lineHeight: 1,
                          fontFeatureSettings: '"tnum"',
                          letterSpacing: "-0.01em",
                        }}>
                          {formatPrice(activeItem.price)}
                        </p>
                      ) : (
                        <p style={{
                          fontFamily: "var(--font-garamond)", fontStyle: "italic",
                          fontSize: "1.1rem", color: "#8884A8",
                        }}>
                          Price on application
                        </p>
                      )}

                      {/* Save button */}
                      <button
                        onClick={() => toggleFav(activeItem.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          flexShrink: 0,
                          padding: "0.7rem 1.5rem",
                          border: favorites.includes(activeItem.id)
                            ? "1px solid rgba(201,169,110,0.6)"
                            : "1px solid rgba(255,255,255,0.1)",
                          color: favorites.includes(activeItem.id) ? "#C9A96E" : "#8884A8",
                          fontFamily: "var(--font-grotesk)", fontSize: "0.62rem",
                          letterSpacing: "0.14em", textTransform: "uppercase",
                          background: "transparent", cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => {
                          if (!favorites.includes(activeItem.id)) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
                            (e.currentTarget as HTMLButtonElement).style.color = "#F4F1E8";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!favorites.includes(activeItem.id)) {
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                            (e.currentTarget as HTMLButtonElement).style.color = "#8884A8";
                          }
                        }}
                      >
                        <Heart size={12} style={{
                          fill: favorites.includes(activeItem.id) ? "#C9A96E" : "none",
                          color: favorites.includes(activeItem.id) ? "#C9A96E" : "currentColor",
                        }} />
                        {favorites.includes(activeItem.id) ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* ── Primary CTA ────────────────────────────────────────── */}
                  {activeItem.available ? (
                    <motion.button
                      style={{
                        width: "100%",
                        padding: "1.25rem",
                        border: "1px solid rgba(201,169,110,0.5)",
                        color: "#C9A96E", background: "transparent",
                        fontFamily: "var(--font-grotesk)", fontSize: "0.72rem",
                        letterSpacing: "0.26em", textTransform: "uppercase",
                        cursor: "pointer",
                        marginBottom: "1rem",
                        transition: "all 0.25s",
                      }}
                      whileHover={{ backgroundColor: "rgba(201,169,110,0.08)", borderColor: "rgba(201,169,110,0.9)" }}
                      whileTap={{ scale: 0.998 }}
                      onClick={() => {
                        toast.success("Enquiry sent for " + activeItem.name);
                        setActiveItem(null);
                      }}
                    >
                      Send Enquiry
                    </motion.button>
                  ) : (
                    <div style={{
                      width: "100%", padding: "1.25rem",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#3A3A52", textAlign: "center",
                      fontFamily: "var(--font-grotesk)", fontSize: "0.72rem",
                      letterSpacing: "0.26em", textTransform: "uppercase",
                      marginBottom: "1rem",
                    }}>
                      Object Reserved
                    </div>
                  )}

                  {/* Secondary CTA */}
                  <motion.button
                    style={{
                      width: "100%", padding: "1rem",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "#8884A8", background: "transparent",
                      fontFamily: "var(--font-grotesk)", fontSize: "0.67rem",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      cursor: "pointer", transition: "all 0.25s",
                    }}
                    whileHover={{ borderColor: "rgba(255,255,255,0.16)", color: "#F4F1E8" }}
                    whileTap={{ scale: 0.998 }}
                    onClick={() => toast("Condition report requested")}
                  >
                    Request Condition Report
                  </motion.button>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
