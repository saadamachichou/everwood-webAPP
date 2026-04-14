"use client";
import { useRef } from "react";
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

// ── Metadata strip ──────────────────────────────────────────────────────────
const MetaTag = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
      background: "linear-gradient(to top, rgba(3,3,10,0.88) 0%, rgba(3,3,10,0.2) 55%, transparent 100%)",
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
  const heroTextY    = useTransform(heroP, [0, 1], ["0%", "-22%"]);
  const heroOpacity  = useTransform(heroP, [0, 0.6], [1, 0]);
  const heroRingRot  = useTransform(heroP, [0, 1], ["0deg", "60deg"]);

  // ── Feature story parallax ─────────────────────────────────────────────────
  const { scrollYProgress: featP } = useScroll({ target: featureRef, offset: ["start end", "end start"] });
  const featImgScale = useTransform(featP, [0, 1], [1.0, 1.15]);
  const featImgY     = useTransform(featP, [0, 1], ["0%", "8%"]);

  // ── Closing parallax ──────────────────────────────────────────────────────
  const { scrollYProgress: closingP } = useScroll({ target: closingRef, offset: ["start end", "end start"] });
  const closingY = useTransform(closingP, [0, 1], ["6%", "-6%"]);

  // ── GSAP: horizontal chamber ───────────────────────────────────────────────
  useGSAP(() => {
    const track   = trackRef.current;
    const wrapper = chamberRef.current;
    if (!track || !wrapper) return;

    const panelCount = chamberPanels.length;
    const panelW     = window.innerWidth;
    const totalScroll = panelW * (panelCount - 1);

    const tween = gsap.to(track, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${totalScroll}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    return () => {
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

      {/* ══════════════════════════════════════════════════════════════════════
          § 1 — HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        aria-label="Gallery hero"
        style={{
          position: "relative", height: "100vh", overflow: "hidden",
          background: "#030208", margin: 0, padding: 0,
        }}
      >
        {/* Deep void layer — slowest parallax */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, margin: 0,
            background: "radial-gradient(ellipse at 30% 60%, #1a0e0a 0%, #0a0606 35%, #030208 80%)",
            y: heroLayer1Y,
          }}
        />

        {/* Mid atmosphere layer */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, margin: 0,
            background: "radial-gradient(ellipse at 70% 40%, rgba(201,169,110,0.06) 0%, transparent 60%)",
            y: heroLayer2Y,
          }}
        />

        {/* Decorative ring SVG — rotates with scroll */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 800, height: 800,
            marginTop: -400, marginLeft: -400,
            rotate: heroRingRot,
            opacity: 0.07,
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

        {/* Hero text block */}
        <motion.div
          style={{
            position: "absolute", inset: 0, margin: 0,
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            paddingTop: "172px",
            paddingLeft: "clamp(2rem, 8vw, 8rem)",
            paddingRight: "clamp(2rem, 8vw, 8rem)",
            y: heroTextY,
            opacity: heroOpacity,
          }}
        >
          {/* Volume label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}
          >
            <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.5)" }} />
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.55rem",
              letterSpacing: "0.32em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.65)",
            }}>The Archive · Vol. IV · Casablanca 2026</span>
          </motion.div>

          {/* Main title */}
          <HeroTitle
            text="Obsidian Ritual"
            delay={0.2}
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(3.2rem, 7vw, 9rem)",
              fontWeight: 400, lineHeight: 0.95,
              color: "#F4F1E8", margin: 0,
            }}
          />

          <div style={{ height: "0.6rem" }} />

          <HeroTitle
            as="h2"
            text="Chapter IV"
            delay={0.5}
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(1.4rem, 3vw, 3.5rem)",
              fontWeight: 300, fontStyle: "italic",
              color: "#C9A96E", margin: 0,
            }}
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
              color: "rgba(244,241,232,0.45)", lineHeight: 1.7,
              maxWidth: "46ch", marginTop: "1.8rem",
            }}
          >
            A living archaeology of objects displaced by history,
            preserved by devotion, and reassembled in a 16th-century
            riad in the heart of Casablanca&apos;s medina.
          </motion.p>

          {/* Meta strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            style={{
              display: "flex", gap: "3rem", marginTop: "3.5rem",
              borderLeft: "1px solid rgba(201,169,110,0.2)",
              paddingLeft: "2rem",
            }}
          >
            <MetaTag label="Objects" value="247" />
            <MetaTag label="Centuries" value="X – XX" />
            <MetaTag label="Origins" value="23 regions" />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          aria-hidden="true"
          style={{
            position: "absolute", bottom: "2.5rem", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "0.5rem",
          }}
        >
          <span style={{
            fontFamily: "var(--font-grotesk)", fontSize: "0.5rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(201,169,110,0.4)",
          }}>Scroll</span>
          <motion.div
            style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)" }}
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          § 2 — FEATURE STORY
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={featureRef}
        aria-label="Feature story"
        style={{ display: "flex", background: "#030208", margin: 0 }}
      >
        {/* Left — sticky image panel */}
        <div style={{
          position: "sticky", top: 0,
          width: "45%", height: "100vh", flexShrink: 0,
          overflow: "hidden", margin: 0,
        }}>
          <motion.div style={{
            position: "absolute", inset: 0, margin: 0,
            background: "radial-gradient(ellipse at 50% 40%, #2a1508 0%, #14090302 45%, #070302 100%)",
            scale: featImgScale,
            y: featImgY,
          }} />
          {/* Overlay gradient to blend right edge */}
          <div style={{
            position: "absolute", inset: 0, margin: 0,
            background: "linear-gradient(to right, transparent 70%, #030208 100%)",
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
        style={{ height: `${100 + (chamberPanels.length - 1) * 100}vh`, margin: 0 }}
      >
        {/* The sticky viewport */}
        <div style={{
          position: "sticky", top: 0, height: "100vh",
          overflow: "hidden", margin: 0,
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
      <div aria-label="The archive — three chapters" style={{ margin: 0 }}>
        {cascadePanels.map((panel, i) => (
          <div
            key={panel.id}
            style={{ height: "200vh", position: "relative", margin: 0 }}
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
                background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(3,3,10,0.55) 100%)",
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
        style={{ background: "#030208", padding: "8rem clamp(1.5rem,6vw,6rem)", margin: 0 }}
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
          position: "relative", height: "100vh", overflow: "hidden",
          background: "#020108", margin: 0, padding: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* Deep amber glow layer */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, margin: 0,
            background: "radial-gradient(ellipse at 50% 60%, rgba(180,90,20,0.06) 0%, transparent 65%)",
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

      <Footer />
    </>
  );
}
