"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HeroTitle from "@/components/effects/HeroTitle";
import { chamberPanels, cascadePanels, archiveArtifacts } from "@/lib/data/gallery";

gsap.registerPlugin(ScrollTrigger);

// ── Pre-computed decorative geometry (module scope — avoids SSR/hydration mismatch) ──
const HERO_PARTICLES = Array.from({ length: 18 }).map((_, i) => {
  const a = (i / 18) * Math.PI * 2;
  const r = 220 + (i % 3) * 80;
  return {
    cx: (400 + r * Math.cos(a)).toFixed(3),
    cy: (400 + r * Math.sin(a)).toFixed(3),
    r: (i % 4 === 0 ? 1.8 : 0.9).toFixed(1),
  };
});

const HERO_RING_TICKS = Array.from({ length: 36 }).map((_, i) => {
  const a = (i * 10 - 90) * (Math.PI / 180);
  const major = i % 9 === 0;
  const r1 = major ? 175 : 182;
  return {
    x1: (400 + r1 * Math.cos(a)).toFixed(3),
    y1: (400 + r1 * Math.sin(a)).toFixed(3),
    x2: (400 + 190 * Math.cos(a)).toFixed(3),
    y2: (400 + 190 * Math.sin(a)).toFixed(3),
    major,
  };
});

/** Hero photography — curiosity aisle / stained glass interior */
const GALLERY_HERO_BG = "/images/nav/antqueee.jpeg";

/** Gallery-only backdrop: celadon–ink (distinct from site void #03030A) */
const GB = {
  void: "#061018",
  ink: "#0a1824",
  deep: "#030c12",
  panel: "#071a26",
  wash: "linear-gradient(165deg, rgba(55, 95, 88, 0.14) 0%, transparent 42%, rgba(18, 42, 52, 0.35) 100%)",
  cardVeilTop: "rgba(6, 22, 30, 0.9)",
  vignetteEdge: "rgba(3, 14, 20, 0.58)",
} as const;

// ── Metadata strip ──────────────────────────────────────────────────────────
const MetaTag = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{
      fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", fontWeight: 500,
      letterSpacing: "0.28em", textTransform: "uppercase",
      color: "rgba(201,169,110,0.5)",
    }}>{label}</span>
    <span style={{
      fontFamily: "var(--font-dm-mono)", fontSize: "0.68rem", fontWeight: 400,
      letterSpacing: "0.12em", color: "rgba(244,241,232,0.78)",
    }}>{value}</span>
  </div>
);

// ── Archive artifact card ────────────────────────────────────────────────────
const ArtifactCard = ({
  title, category, century, origin, excerpt, gradient, accent, span = "normal", index,
}: {
  title: string; category: string; century: string; origin: string;
  excerpt: string; gradient: string; accent: string;
  span?: "normal" | "wide" | "tall"; index: number;
}) => (
  <motion.article
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.72, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    style={{
      gridColumn: span === "wide" ? "span 2" : "span 1",
      gridRow: span === "tall" ? "span 2" : "span 1",
      position: "relative",
      background: gradient,
      overflow: "hidden",
      cursor: "default",
      margin: 0,
    }}
  >
    {/* gradient wash overlay */}
    <div style={{
      position: "absolute", inset: 0, margin: 0,
      background: `linear-gradient(to top, ${GB.cardVeilTop} 0%, rgba(6,22,30,0.22) 55%, transparent 100%)`,
      zIndex: 1,
    }} />

    {/* accent line top */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 1,
      background: `linear-gradient(to right, ${accent}55, transparent)`,
      margin: 0, zIndex: 2,
    }} />

    {/* content */}
    <div style={{ position: "relative", zIndex: 3, padding: span === "wide" ? "2.5rem" : "1.75rem", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: span === "tall" ? 480 : span === "wide" ? 280 : 320 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{
          fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
          letterSpacing: "0.26em", textTransform: "uppercase",
          color: accent, opacity: 0.85,
        }}>{category}</span>
        <span style={{
          fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(244,241,232,0.35)",
        }}>{century}</span>
      </div>

      <h3 style={{
        fontFamily: "var(--font-playfair)", fontSize: span === "wide" ? "clamp(1.4rem,2.5vw,2rem)" : "1.1rem",
        fontWeight: 400, color: "#F4F1E8", lineHeight: 1.25,
        marginBottom: "0.65rem",
      }}>{title}</h3>

      <p style={{
        fontFamily: "var(--font-garamond)", fontStyle: "italic",
        fontSize: "0.88rem", color: "rgba(244,241,232,0.55)",
        lineHeight: 1.65, marginBottom: "1rem",
        display: span === "normal" ? "-webkit-box" : "block",
        WebkitLineClamp: span === "normal" ? 3 : undefined,
        WebkitBoxOrient: "vertical" as const,
        overflow: "hidden",
      }}>{excerpt}</p>

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ width: 18, height: 1, background: accent, opacity: 0.5 }} />
        <span style={{
          fontFamily: "var(--font-grotesk)", fontSize: "0.55rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(244,241,232,0.35)",
        }}>{origin}</span>
      </div>
    </div>

    {/* hover reveal */}
    <motion.div
      style={{
        position: "absolute", inset: 0, margin: 0, zIndex: 2,
        border: `1px solid ${accent}22`,
        opacity: 0,
      }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    />
  </motion.article>
);

export default function GalleryPage() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const chamberRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  // ── Hero parallax ──────────────────────────────────────────────────────────
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroLayer1Y  = useTransform(heroP, [0, 1], ["0%", "28%"]);
  const heroLayer2Y  = useTransform(heroP, [0, 1], ["0%", "14%"]);
  const heroBloomY   = useTransform(heroP, [0, 1], ["0%", "18%"]);
  const heroTextY    = useTransform(heroP, [0, 1], ["0%", "-22%"]);
  const heroOpacity  = useTransform(heroP, [0, 0.6], [1, 0]);
  const heroRingRot  = useTransform(heroP, [0, 1], ["0deg", "60deg"]);
  const heroFrameOp  = useTransform(heroP, [0, 0.45], [1, 0.35]);

  // ── Feature story parallax ─────────────────────────────────────────────────
  const { scrollYProgress: featP } = useScroll({ target: featureRef, offset: ["start end", "end start"] });
  const featImgScale = useTransform(featP, [0, 1], [1.0, 1.15]);
  const featImgY     = useTransform(featP, [0, 1], ["0%", "8%"]);

  // ── Closing parallax ──────────────────────────────────────────────────────
  const { scrollYProgress: closingP } = useScroll({ target: closingRef, offset: ["start end", "end start"] });
  const closingY = useTransform(closingP, [0, 1], ["6%", "-6%"]);

  // ── GSAP: horizontal chamber ───────────────────────────────────────────────
  // Pin scroll distance must match the track (scrollWidth − viewport). A fixed
  // 500vh wrapper with a shorter pin distance left “dead” scroll on the last card.
  useGSAP(() => {
    const track   = trackRef.current;
    const wrapper = chamberRef.current;
    if (!track || !wrapper) return;

    const getScrollX = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -getScrollX(),
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${getScrollX()}`,
        scrub: 0.9,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, { scope: chamberRef });

  // ── GSAP: closing line draw ───────────────────────────────────────────────
  useGSAP(() => {
    const el = closingRef.current?.querySelector<SVGLineElement>(".closing-line");
    if (!el) return;
    gsap.fromTo(el, { attr: { x2: el.getAttribute("x1") ?? "300" } }, {
      attr: { x2: el.dataset.targetX2 ?? "600" },
      duration: 1.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: closingRef.current,
        start: "top 65%",
        once: true,
      },
    });
  }, { scope: closingRef });

  return (
    <>
      <Navigation />

      {/* Full-height gallery atmosphere (shows between sections / overscroll) */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background: `
            ${GB.wash},
            radial-gradient(ellipse 120% 80% at 10% 0%, rgba(72, 110, 102, 0.07) 0%, transparent 50%),
            radial-gradient(ellipse 90% 70% at 100% 30%, rgba(30, 58, 68, 0.12) 0%, transparent 55%),
            linear-gradient(180deg, ${GB.void} 0%, ${GB.ink} 38%, ${GB.deep} 100%)
          `,
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════
          § 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        aria-label="Gallery hero"
        style={{
          position: "relative",
          zIndex: 1,
          height: "100vh",
          minHeight: "100dvh",
          overflow: "hidden",
          background: "transparent",
          margin: 0,
          padding: 0,
          isolation: "isolate",
        }}
      >
        {/* Antique interior — slow parallax base + scrims for centered plate typography */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            margin: 0,
            overflow: "hidden",
            y: heroLayer1Y,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "118%",
              height: "118%",
              minHeight: 640,
              transform: "translate(-50%, -50%)",
              margin: 0,
            }}
          >
            <Image
              src={GALLERY_HERO_BG}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "50% 42%" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: 0,
              background: `linear-gradient(165deg, ${GB.deep}77 0%, transparent 38%, ${GB.void}aa 100%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: 0,
              background: `radial-gradient(ellipse 72% 62% at 50% 46%, rgba(6, 16, 22, 0.25) 0%, rgba(6, 16, 22, 0.72) 58%, ${GB.deep}f2 100%)`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: 0,
              opacity: 0.85,
              background: `radial-gradient(circle at 70% 22%, rgba(201,169,110,0.07) 0%, transparent 42%)`,
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* Warm gallery pool — track lighting feel */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, margin: 0,
            background: `
              radial-gradient(ellipse 45% 35% at 72% 42%, rgba(201,169,110,0.14) 0%, transparent 65%),
              radial-gradient(ellipse 80% 40% at 50% 100%, rgba(201,169,110,0.05) 0%, transparent 55%)
            `,
            y: heroLayer2Y,
          }}
        />

        {/* Diffused “glass” blooms — editorial still-life mood */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "-12%",
            right: "-8%",
            width: "min(52vw, 620px)",
            height: "min(52vw, 620px)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, rgba(120, 160, 190, 0.12) 0%, rgba(201, 169, 110, 0.06) 42%, transparent 70%)",
            filter: "blur(48px)",
            y: heroBloomY,
            opacity: 0.85,
          }}
        />
        <motion.div
          aria-hidden="true"
          animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.04, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "5%",
            left: "55%",
            width: "min(38vw, 420px)",
            height: "min(38vw, 420px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,169,110,0.09) 0%, transparent 68%)",
            filter: "blur(36px)",
          }}
        />

        {/* Fine grain — tactile print / museum wall */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            margin: 0,
            opacity: 0.055,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            margin: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse 75% 65% at 45% 48%, transparent 0%, ${GB.vignetteEdge} 100%)`,
          }}
        />

        {/* Astrolabe ring — offset, like a hanging instrument */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "46%",
            left: "58%",
            width: 800,
            height: 800,
            marginTop: -400,
            marginLeft: -400,
            rotate: heroRingRot,
            opacity: 0.09,
          }}
        >
          <svg viewBox="0 0 800 800" width="800" height="800" style={{ margin: 0 }}>
            <circle cx="400" cy="400" r="190" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="220" fill="none" stroke="#C9A96E" strokeWidth="0.25" />
            {HERO_RING_TICKS.map((t, i) => (
              <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                stroke="#C9A96E" strokeWidth={t.major ? 1.2 : 0.5} />
            ))}
            {HERO_PARTICLES.map((p, i) => (
              <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#C9A96E" />
            ))}
          </svg>
        </motion.div>

        {/* Thin horizon — exhibition sight line */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "clamp(1.5rem, 6vw, 5rem)",
            right: "18%",
            top: "42%",
            height: 1,
            background: "linear-gradient(90deg, rgba(201,169,110,0.35) 0%, rgba(201,169,110,0.06) 55%, transparent 100%)",
            opacity: heroFrameOp,
          }}
        />

        {/* Hero text — plate + typographic stack */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "calc(2rem + 140px + 0.75rem + env(safe-area-inset-top, 0px))",
            paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
            paddingLeft: "clamp(2rem, 8vw, 8rem)",
            paddingRight: "clamp(2rem, 8vw, 8rem)",
            y: heroTextY,
            opacity: heroOpacity,
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "min(52rem, 92vw)",
              width: "100%",
              textAlign: "center",
            }}
          >
            {/* Corner brackets — mat board / frame */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 1 }}
              style={{
                position: "absolute",
                inset: "-1.25rem -1.5rem -1.75rem -1.5rem",
                pointerEvents: "none",
                opacity: 0.5,
              }}
            >
              <span style={{ position: "absolute", top: 0, left: 0, width: 44, height: 44, borderTop: "1px solid rgba(201,169,110,0.45)", borderLeft: "1px solid rgba(201,169,110,0.45)" }} />
              <span style={{ position: "absolute", top: 0, right: 0, width: 44, height: 44, borderTop: "1px solid rgba(201,169,110,0.45)", borderRight: "1px solid rgba(201,169,110,0.45)" }} />
              <span style={{ position: "absolute", bottom: 0, left: 0, width: 44, height: 44, borderBottom: "1px solid rgba(201,169,110,0.45)", borderLeft: "1px solid rgba(201,169,110,0.45)" }} />
              <span style={{ position: "absolute", bottom: 0, right: 0, width: 44, height: 44, borderBottom: "1px solid rgba(201,169,110,0.45)", borderRight: "1px solid rgba(201,169,110,0.45)" }} />
            </motion.div>

            {/* Exhibition plate */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.75rem 1.25rem",
                marginBottom: "1.75rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.34em",
                  textTransform: "uppercase",
                  color: "rgba(201,169,110,0.72)",
                }}
              >
                Permanent collection
              </span>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.48rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(244,241,232,0.35)",
                  padding: "0.35rem 0.75rem",
                  border: "1px solid rgba(201,169,110,0.28)",
                  background: "rgba(201,169,110,0.04)",
                }}
              >
                Pl. IV · Casablanca · 2026
              </span>
            </motion.div>

            {/* Main title — two-line gallery cadence */}
            <HeroTitle
              text="Obsidian Ritual"
              delay={0.2}
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(3rem, 6.8vw, 8.25rem)",
                fontWeight: 400,
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                color: "#F4F1E8",
                margin: 0,
                textShadow: "0 4px 48px rgba(0,0,0,0.45), 0 0 80px rgba(201,169,110,0.08)",
              }}
            />

            <div style={{ height: "clamp(0.35rem, 1.2vw, 0.85rem)" }} />

            <HeroTitle
              as="h2"
              text="Chapter IV"
              delay={0.5}
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(1.35rem, 2.8vw, 3.25rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "#C9A96E",
                margin: 0,
                letterSpacing: "0.02em",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-garamond)",
                fontStyle: "italic",
                fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
                color: "rgba(244,241,232,0.88)",
                lineHeight: 1.72,
                maxWidth: "38ch",
                margin: "2rem auto 0",
                textAlign: "center",
                borderTop: "2px solid rgba(201,169,110,0.28)",
                paddingTop: "1.35rem",
                borderLeft: "none",
                paddingLeft: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "normal",
                  fontSize: "clamp(1.15rem, 1.85vw, 1.45rem)",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "#F8F6F2",
                  marginBottom: "0.85rem",
                  textShadow: "0 2px 24px rgba(0,0,0,0.35)",
                }}
              >
                The Art of More
              </span>
              <span style={{ display: "block", color: "rgba(248,246,242,0.92)" }}>
                A maximalist gallery where every detail is part of the whole.
              </span>
              <span style={{ display: "block", marginTop: "0.65rem", color: "rgba(244,241,232,0.86)" }}>
                Inviting you to slow down, look closer, and take it all in.
              </span>
            </motion.p>

            {/* Specimen meta — label card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "2.25rem 3rem",
                margin: "2.75rem auto 0",
                padding: "1.35rem 1.75rem",
                maxWidth: "max-content",
                background: "linear-gradient(135deg, rgba(12,14,24,0.65) 0%, rgba(8,10,18,0.4) 100%)",
                border: "1px solid rgba(201,169,110,0.18)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
              }}
            >
              <MetaTag label="Objects" value="247" />
              <MetaTag label="Centuries" value="X – XX" />
              <MetaTag label="Origins" value="23 regions" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll — editorial, corner anchor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.75, duration: 0.6 }}
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "clamp(1.75rem, 4vw, 2.75rem)",
            right: "clamp(1.75rem, 5vw, 3.5rem)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.48rem",
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.42)",
            }}
          >
            Enter
          </span>
          <motion.div
            style={{
              width: 48,
              height: 1,
              background: "linear-gradient(to right, rgba(201,169,110,0.55), transparent)",
              transformOrigin: "left center",
            }}
            animate={{ scaleX: [1, 0.35, 1], opacity: [0.45, 0.95, 0.45] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          § 2 — FEATURE STORY
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={featureRef}
        aria-label="Feature story"
        style={{ position: "relative", zIndex: 1, display: "flex", background: "transparent", margin: 0 }}
      >
        {/* Left — sticky image panel */}
        <div style={{
          position: "sticky", top: 0,
          width: "45%", height: "100vh", flexShrink: 0,
          overflow: "hidden", margin: 0,
        }}>
          <motion.div style={{
            position: "absolute", inset: 0, margin: 0,
            background: `radial-gradient(ellipse at 50% 40%, #1e2c28 0%, rgba(8, 20, 24, 0.65) 45%, ${GB.deep} 100%)`,
            scale: featImgScale,
            y: featImgY,
          }} />
          {/* Overlay gradient to blend right edge */}
          <div style={{
            position: "absolute", inset: 0, margin: 0,
            background: `linear-gradient(to right, transparent 65%, ${GB.ink} 100%)`,
            zIndex: 2,
          }} />
          {/* Title overlay */}
          <div style={{
            position: "absolute", bottom: "3rem", left: "3rem", right: "3rem",
            zIndex: 3,
          }}>
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.7)", display: "block", marginBottom: "0.75rem",
            }}>Featured Acquisition</span>
            <h2 style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontSize: "clamp(1.6rem, 2.5vw, 2.6rem)",
              fontWeight: 400, color: "#F4F1E8", lineHeight: 1.2, margin: 0,
            }}>
              The Lost Atelier<br />of Mme. Benali
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
              <div style={{ width: 24, height: 1, background: "rgba(201,169,110,0.5)" }} />
              <span style={{
                fontFamily: "var(--font-grotesk)", fontSize: "0.58rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(244,241,232,0.4)",
              }}>Casablanca, 1924</span>
            </div>
          </div>
        </div>

        {/* Right — scrolling editorial content */}
        <div style={{ flex: 1, padding: "8rem 5rem 8rem 4rem", maxWidth: 620 }}>
          {/* Category / date */}
          <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 16, height: 1, background: "rgba(201,169,110,0.45)" }} />
              <span style={{
                fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: "rgba(201,169,110,0.55)",
              }}>Furniture &amp; Decorative Arts</span>
            </div>
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "rgba(244,241,232,0.3)",
            }}>April 2026</span>
          </div>

          {/* Pull quote */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              borderLeft: "2px solid #C9A96E",
              paddingLeft: "1.75rem",
              margin: 0,
              marginBottom: "3rem",
            }}
          >
            <p style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              fontSize: "clamp(1.2rem, 2vw, 1.55rem)",
              color: "#C9A96E", lineHeight: 1.55,
              marginBottom: "0.75rem",
            }}>
              &ldquo;She did not buy beautiful things.
              She rescued them from becoming ordinary.&rdquo;
            </p>
            <cite style={{
              fontFamily: "var(--font-grotesk)", fontStyle: "normal",
              fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(244,241,232,0.35)",
            }}>— Estate inventory, 1971</cite>
          </motion.blockquote>

          <div style={{ height: "2.5rem" }} />

          {/* Body */}
          {[
            "Fatima Benali arrived in Casablanca from Fès in 1912, carrying three cedar chests and the complete tools of a master embroiderer. By 1924 she had established the most significant private collection of Moroccan decorative arts in the city — not in a museum, not in a gallery, but in the back rooms of a medina workshop that sold ordinary domestic goods to the public.",
            "When she died in 1971, her niece Khadija — a schoolteacher who had no interest in objects — sold the collection in a series of transactions that scattered it across three continents. Antique dealers in Paris, London, and New York acquired the major pieces. The minor pieces, the ones Khadija considered simply functional, went to a street market in Derb Ghallef.",
            "What we have recovered over eleven years is a partial reassembly. Fourteen objects from the Benali collection are now documented and held in various institutions. Three are here, in this room, in Casablanca, where they were never meant to leave.",
          ].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.72, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-garamond)",
                fontSize: "1.05rem", color: "rgba(244,241,232,0.62)",
                lineHeight: 1.82, marginBottom: "1.75rem",
              }}
            >{para}</motion.p>
          ))}

          {/* Divider ornament */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", marginBottom: "3rem" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.12)" }} />
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ margin: 0 }}>
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" fill="#C9A96E" fillOpacity="0.4" />
            </svg>
            <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.12)" }} />
          </div>

          {/* Object credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {[
              { label: "Cedar chest with silver lock", detail: "Granada, c. 1490 — Inv. EW-F-001" },
              { label: "Embroidered haïk fragment", detail: "Fès, c. 1880 — Inv. EW-T-017" },
              { label: "Brass incense burner, pierced", detail: "Meknès, c. 1740 — Inv. EW-M-009" },
            ].map(({ label, detail }) => (
              <div key={label} style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#C9A96E", marginTop: "0.45rem", flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: "0.9rem", color: "rgba(244,241,232,0.75)", margin: 0 }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.58rem", letterSpacing: "0.1em", color: "rgba(244,241,232,0.3)", marginTop: "0.2rem" }}>{detail}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          § 3 — HORIZONTAL CHAMBER
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={chamberRef}
        aria-label="Gallery chamber — horizontal scroll"
        style={{ position: "relative", zIndex: 1, minHeight: "100vh", margin: 0 }}
      >
        {/* The sticky viewport */}
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          overflow: "hidden", margin: 0,
          background: `linear-gradient(180deg, ${GB.panel} 0%, ${GB.deep} 100%)`,
        }}>
          {/* Chapter heading — appears above track */}
          <div style={{
            position: "absolute", top: "3rem", left: "clamp(2rem,6vw,6rem)",
            zIndex: 10, display: "flex", alignItems: "center", gap: "1rem",
          }}>
            <div style={{ width: 24, height: 1, background: "rgba(201,169,110,0.45)" }} />
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.55)",
            }}>The Chamber — Five Eras</span>
          </div>

          {/* Horizontal track */}
          <div
            ref={trackRef}
            style={{
              display: "flex", height: "100%",
              width: `${chamberPanels.length * 100}vw`,
              margin: 0,
            }}
          >
            {chamberPanels.map((panel, i) => (
              <div
                key={panel.id}
                className="chamber-panel"
                style={{
                  width: "100vw", height: "100%", flexShrink: 0,
                  position: "relative", overflow: "hidden",
                  background: panel.gradient, margin: 0,
                }}
              >
                {/* Noise texture simulation */}
                <div style={{
                  position: "absolute", inset: 0, margin: 0,
                  background: "radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 70%)",
                }} />

                {/* Large number */}
                <div style={{
                  position: "absolute", right: "5vw", top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(12rem, 22vw, 22rem)",
                  fontWeight: 700, lineHeight: 1,
                  color: "rgba(255,255,255,0.03)",
                  userSelect: "none",
                  letterSpacing: "-0.05em",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Content */}
                <div style={{
                  position: "absolute", bottom: "3rem", left: "6vw",
                  maxWidth: "min(560px, 45vw)",
                  display: "flex", flexDirection: "column", gap: "1rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 20, height: 1, background: panel.accent, opacity: 0.6 }} />
                    <span style={{
                      fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
                      letterSpacing: "0.3em", textTransform: "uppercase",
                      color: panel.accent, opacity: 0.75,
                    }}>{panel.century}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
                    <span style={{
                      fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
                      letterSpacing: "0.24em", textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                    }}>{panel.category}</span>
                  </div>

                  <h3 style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
                    fontWeight: 400, color: "#F4F1E8",
                    lineHeight: 1.1, margin: 0,
                  }}>{panel.title}</h3>

                  <p style={{
                    fontFamily: "var(--font-garamond)", fontStyle: "italic",
                    fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)",
                    color: "rgba(244,241,232,0.5)",
                    lineHeight: 1.72, margin: 0,
                  }}>{panel.excerpt}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.15)" }} />
                    <span style={{
                      fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
                      letterSpacing: "0.2em", textTransform: "uppercase",
                      color: "rgba(244,241,232,0.35)",
                    }}>{panel.origin}</span>
                  </div>
                </div>

                {/* Right accent stripe */}
                <div style={{
                  position: "absolute", right: 0, top: 0, bottom: 0,
                  width: 1, margin: 0,
                  background: `linear-gradient(to bottom, transparent, ${panel.accent}33, transparent)`,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          § 4 — CASCADE PANELS ("fixed background" journey)
      ══════════════════════════════════════════════════════════════════════ */}
      <div aria-label="The archive — three chapters" style={{ position: "relative", zIndex: 1, margin: 0 }}>
        {cascadePanels.map((panel, i) => (
          <div
            key={panel.id}
            style={{ height: "120vh", position: "relative", margin: 0 }}
          >
            {/* Sticky inner — creates the "fixed background" illusion */}
            <div style={{
              position: "sticky", top: 0,
              height: "100vh", overflow: "hidden",
              background: panel.gradient,
              margin: 0, padding: 0,
            }}>
              {/* Atmospheric vignette */}
              <div style={{
                position: "absolute", inset: 0, margin: 0,
                background: `radial-gradient(ellipse at 50% 50%, transparent 30%, ${GB.vignetteEdge} 100%)`,
              }} />

              {/* Horizontal gold rule */}
              <div style={{
                position: "absolute", top: "50%", left: 0, right: 0,
                height: 1, margin: 0,
                background: `linear-gradient(to right, transparent, ${panel.accent}18, transparent)`,
              }} />

              {/* Label — top left */}
              <div style={{
                position: "absolute", top: "3rem", left: "clamp(2rem,6vw,6rem)",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}>
                <div style={{ width: 20, height: 1, background: `${panel.accent}55` }} />
                <span style={{
                  fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
                  letterSpacing: "0.32em", textTransform: "uppercase",
                  color: `${panel.accent}88`,
                }}>{panel.label}</span>
              </div>

              {/* Centered content */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(780px, 90vw)",
                textAlign: "center",
              }}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h2 style={{
                    fontFamily: "var(--font-playfair)", fontStyle: "italic",
                    fontSize: "clamp(2.4rem, 5vw, 5.5rem)",
                    fontWeight: 400, color: "#F4F1E8",
                    lineHeight: 1.1, whiteSpace: "pre-line",
                    marginBottom: "1.25rem",
                  }}>{panel.title}</h2>

                  <p style={{
                    fontFamily: "var(--font-grotesk)", fontSize: "0.6rem",
                    letterSpacing: "0.22em", textTransform: "uppercase",
                    color: panel.accent, opacity: 0.6,
                    marginBottom: "2.5rem",
                  }}>{panel.subtitle}</p>

                  {/* Ornamental divider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem", justifyContent: "center" }}>
                    <div style={{ width: 60, height: 1, background: `${panel.accent}30` }} />
                    <svg width="8" height="8" viewBox="0 0 8 8" style={{ margin: 0 }}>
                      <path d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3Z" fill={panel.accent} fillOpacity="0.4" />
                    </svg>
                    <div style={{ width: 60, height: 1, background: `${panel.accent}30` }} />
                  </div>

                  <p style={{
                    fontFamily: "var(--font-garamond)", fontStyle: "italic",
                    fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)",
                    color: "rgba(244,241,232,0.52)", lineHeight: 1.85,
                    maxWidth: "56ch", margin: "0 auto",
                  }}>{panel.body}</p>
                </motion.div>
              </div>

              {/* Bottom index */}
              <div style={{
                position: "absolute", bottom: "2.5rem", right: "clamp(2rem,6vw,6rem)",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}>
                <span style={{
                  fontFamily: "var(--font-playfair)", fontStyle: "italic",
                  fontSize: "clamp(3rem, 5vw, 5rem)",
                  color: "rgba(255,255,255,0.04)",
                  userSelect: "none",
                }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{
                  fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
                  letterSpacing: "0.28em", textTransform: "uppercase",
                  color: "rgba(244,241,232,0.25)",
                }}>/ 03</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          § 5 — ARCHIVE GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        aria-label="Archive collection"
        style={{ position: "relative", zIndex: 1, background: "transparent", padding: "8rem clamp(1.5rem,6vw,6rem)", margin: 0 }}
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: "4rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.45)" }} />
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.52rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.55)",
            }}>The Collection · 247 Objects</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2rem, 4vw, 3.6rem)",
            fontWeight: 400, color: "#F4F1E8",
            lineHeight: 1.1, margin: 0,
          }}>Selected from the Archive</h2>
        </motion.div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "auto",
          gap: "1px",
          background: "rgba(255,255,255,0.04)",
          margin: 0,
        }}>
          {archiveArtifacts.map((item, i) => (
            <ArtifactCard key={item.id} {...item} index={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          § 6 — CLOSING FRAME
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={closingRef}
        aria-label="Closing"
        style={{
          position: "relative", zIndex: 1,
          height: "100vh", overflow: "hidden",
          background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(62, 98, 90, 0.08) 0%, transparent 55%), ${GB.deep}`,
          margin: 0, padding: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* Deep amber glow layer */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, margin: 0,
            background: "radial-gradient(ellipse at 50% 55%, rgba(180, 120, 70, 0.05) 0%, rgba(50, 90, 82, 0.06) 35%, transparent 68%)",
            y: closingY,
          }}
        />

        {/* SVG ornamental line */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", margin: 0 }}
          width="600" height="2"
          viewBox="0 0 600 2"
        >
          <line
            className="closing-line"
            x1="300" y1="1"
            x2="300" y2="1"
            data-target-x2="600"
            stroke="#C9A96E"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          <line
            className="closing-line"
            x1="300" y1="1"
            x2="300" y2="1"
            data-target-x2="0"
            stroke="#C9A96E"
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
        </svg>

        {/* Central content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", padding: "0 clamp(2rem,8vw,10rem)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginBottom: "3.5rem" }}>
            <div style={{ width: 48, height: 1, background: "rgba(201,169,110,0.25)" }} />
            <svg width="16" height="16" viewBox="0 0 16 16" style={{ margin: 0 }}>
              <path d="M8 0L9.5 5.5L15 7L9.5 8.5L8 14L6.5 8.5L1 7L6.5 5.5Z" stroke="#C9A96E" strokeWidth="0.75" fill="none" strokeOpacity="0.5" />
            </svg>
            <div style={{ width: 48, height: 1, background: "rgba(201,169,110,0.25)" }} />
          </div>

          <blockquote style={{ margin: 0 }}>
            <p style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              fontSize: "clamp(1.5rem, 3.5vw, 3.2rem)",
              color: "#F4F1E8", lineHeight: 1.35,
              fontWeight: 400,
              marginBottom: "2rem",
            }}>
              &ldquo;Every object remembers<br />the hands that shaped it.&rdquo;
            </p>
            <cite style={{
              fontFamily: "var(--font-grotesk)", fontStyle: "normal",
              fontSize: "0.58rem", letterSpacing: "0.24em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.45)",
            }}>The Archive · Everwood · Casablanca</cite>
          </blockquote>

          <div style={{ marginTop: "4rem" }}>
            <motion.a
              href="/antiques"
              style={{
                display: "inline-flex", alignItems: "center", gap: "1rem",
                fontFamily: "var(--font-grotesk)", fontSize: "0.62rem",
                letterSpacing: "0.24em", textTransform: "uppercase",
                color: "#C9A96E", textDecoration: "none",
                padding: "1rem 2rem",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
              whileHover={{ borderColor: "rgba(201,169,110,0.5)", backgroundColor: "rgba(201,169,110,0.04)" }}
              transition={{ duration: 0.2 }}
            >
              Enter the Cabinet
              <svg width="16" height="8" viewBox="0 0 16 8" style={{ margin: 0 }}>
                <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </section>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Footer />
      </div>
    </>
  );
}
