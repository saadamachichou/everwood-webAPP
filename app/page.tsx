"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { events } from "@/lib/data/events";
import { workshops, categoryConfig } from "@/lib/data/workshops";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import Footer from "@/components/layout/Footer";

// ══════════════════════════════════════════════════════════════════════════════
// TIME OF DAY SYSTEM
// ══════════════════════════════════════════════════════════════════════════════
type TimeOfDay = "dawn" | "morning" | "afternoon" | "dusk" | "night";

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5  && h < 8)  return "dawn";
  if (h >= 8  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "dusk";
  return "night";
}

const TOD = {
  dawn:      { bg: "radial-gradient(ellipse 130% 80% at 50% 20%, #E8DCC8 0%, #D4C8B0 50%, #C0B49A 100%)", text: "#2E4B3A", sub: "#4A6741", lamp: 0.08, overlay: "rgba(255,220,180,0.04)", nav: "#2E4B3A", dark: false },
  morning:   { bg: "radial-gradient(ellipse 130% 80% at 50% 20%, #F0E8D8 0%, #E8DCC8 50%, #D4C4A8 100%)", text: "#2C1F0F", sub: "#5A3E28", lamp: 0.06, overlay: "rgba(255,240,200,0.03)", nav: "#2C1F0F", dark: false },
  afternoon: { bg: "radial-gradient(ellipse 130% 80% at 50% 20%, #EDE4CF 0%, #E0D4BA 50%, #CCC0A0 100%)", text: "#2C1F0F", sub: "#5A3E28", lamp: 0.06, overlay: "transparent", nav: "#2C1F0F", dark: false },
  dusk:      { bg: "radial-gradient(ellipse 100% 60% at 50% 30%, #2E4B3A 0%, #243D2E 50%, #1A2E23 100%)", text: "#EFE7D8", sub: "#C8B99A", lamp: 0.14, overlay: "rgba(60,40,20,0.12)", nav: "#EFE7D8", dark: true },
  night:     { bg: "radial-gradient(ellipse 100% 60% at 50% 20%, #1E3028 0%, #162418 50%, #0E1810 100%)", text: "#EFE7D8", sub: "#C8B99A", lamp: 0.18, overlay: "rgba(20,30,15,0.20)", nav: "#EFE7D8", dark: true },
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// ROOM CONFIG
// ══════════════════════════════════════════════════════════════════════════════
const ROOMS = [
  { id: "threshold",   label: "ENTRANCE",               color: "#4A6741" },
  { id: "meridian",    label: "EVERWOOD",                color: "rgba(244,236,223,0.3)" },
  { id: "coffee",      label: "THE COFFEE ROOM →",      color: "#C8780A" },
  { id: "wall",        label: "THE ATELIER →",          color: "#8B5E3C" },
  { id: "atelier",     label: "20 WORKSHOPS",           color: "#D4820A" },
  { id: "cabinet",     label: "ANTIQUES · GALLERY →",   color: "#C9A96E" },
  { id: "gathering",   label: "EVENTS · OUR STORY →",   color: "#D4943A" },
  { id: "conversation",label: "SAY HELLO →",            color: "#5C8A3A" },
] as const;

// Workshop stack data (6 from 4 categories)
const STACK_IDS = ["terrarium", "pottery", "glass-painting", "weaving", "wood-carving", "candle-making"];

// ══════════════════════════════════════════════════════════════════════════════
// SVG COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════
function LeafA({ opacity = 0.10 }: { opacity?: number }) {
  return (
    <svg width="280" height="320" viewBox="0 0 280 320" fill="none" aria-hidden="true" style={{ opacity }}>
      <path d="M40 300 Q60 200 140 120 Q200 60 240 20 Q220 80 210 140 Q195 220 140 280 Q90 320 40 300Z" fill="#4A6741" />
      <path d="M140 120 Q155 180 140 280" stroke="#3A5530" strokeWidth="1.5" fill="none" opacity="0.5" />
      {[0.2,0.4,0.6,0.8].map((t, i) => {
        const x = 140 + Math.sin(t * Math.PI) * 40;
        const y = 120 + (280-120) * t;
        return <path key={i} d={`M${140 + (140-140)*t} ${120 + (280-120)*t} Q${x} ${y-10} ${x+20} ${y}`} stroke="#3A5530" strokeWidth="0.8" fill="none" opacity="0.4" />;
      })}
    </svg>
  );
}

function LeafB({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <svg width="200" height="240" viewBox="0 0 200 240" fill="none" aria-hidden="true" style={{ opacity }}>
      <path d="M20 220 Q40 150 100 90 Q150 40 180 10 Q160 70 155 120 Q145 180 100 210 Q60 235 20 220Z" fill="#5C6B4A" />
      <path d="M100 90 Q108 150 100 210" stroke="#4A5A38" strokeWidth="1.2" fill="none" opacity="0.5" />
    </svg>
  );
}

function HandIllustration() {
  return (
    <svg width="400" height="300" viewBox="0 0 400 300" fill="none" aria-hidden="true" style={{ opacity: 0.03, position: "absolute", bottom: 0, right: 0 }}>
      <path d="M200 280 L200 100 Q200 80 185 75 L160 70 Q145 68 143 85 L143 160" stroke="#C8B99A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M143 130 Q143 100 128 97 L115 95 Q100 94 100 110 L100 170" stroke="#C8B99A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M100 150 Q100 125 86 123 L74 121 Q60 120 60 135 L60 190" stroke="#C8B99A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M60 175 Q60 155 48 153 L38 152 Q26 152 28 165 L30 210" stroke="#C8B99A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 190 Q20 200 20 220 Q20 250 40 260 L200 280 Q260 285 270 260 L275 110 Q275 95 262 93 Q248 91 246 108 L246 160" stroke="#C8B99A" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function BotanicalA({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <svg width="220" height="340" viewBox="0 0 220 340" fill="none" aria-hidden="true" style={{ opacity }}>
      <path d="M110 340 L110 40" stroke="#5C8A3A" strokeWidth="2" />
      {[60,100,140,180,220,260,300].map((y, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <g key={i}>
            <path d={`M110 ${y} Q${110 + side*60} ${y-20} ${110 + side*80} ${y+10} Q${110 + side*40} ${y+30} 110 ${y}`} fill="#5C8A3A" />
          </g>
        );
      })}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SECTION BLEND — gradient fade between jarring section pairs
// ══════════════════════════════════════════════════════════════════════════════
function SectionBlend({ from, to, height = 90 }: { from: string; to: string; height?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ height, background: `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`, margin: 0, display: "block", flexShrink: 0 }}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// POLLEN TRAIL — canvas-based gold particle cursor
// ══════════════════════════════════════════════════════════════════════════════
function PollenTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; born: number; life: number };
    let particles: Particle[] = [];
    let lastEmit = 0;
    let rafId = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmit < 60 || particles.length >= 20) return;
      lastEmit = now;
      particles.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 1.4, vy: -0.6 - Math.random() * 1.4, size: 2 + Math.random() * 3, born: now, life: 420 + Math.random() * 280 });
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();
      particles = particles.filter(p => {
        const age = now - p.born;
        if (age > p.life) return false;
        const t = age / p.life;
        p.x += p.vx; p.y += p.vy;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${0.6 * (1 - t)})`;
        ctx.fill();
        return true;
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => { window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId); };
  }, [prefersReduced]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", margin: 0 }} aria-hidden="true" />;
}

/** Loads after idle so canvas + rAF work does not contend with LCP paint. */
function DeferredPollenTrail() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setShow(true);
    };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(enable, { timeout: 2000 });
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const id = window.setTimeout(enable, 1600);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);
  if (!show) return null;
  return <PollenTrail />;
}

// ══════════════════════════════════════════════════════════════════════════════
// SCROLL MERIDIAN — left-edge progress line
// ══════════════════════════════════════════════════════════════════════════════
function ScrollMeridian({ activeRoom, progress }: { activeRoom: number; progress: number }) {
  const [labelVisible, setLabelVisible] = useState(false);
  const prevRoom = useRef(activeRoom);

  useEffect(() => {
    if (prevRoom.current === activeRoom) return;
    prevRoom.current = activeRoom;
    setLabelVisible(true);
    const t = setTimeout(() => setLabelVisible(false), 1800);
    return () => clearTimeout(t);
  }, [activeRoom]);

  const color = ROOMS[activeRoom]?.color ?? "#C9A96E";

  return (
    <div style={{ position: "fixed", left: 20, top: 0, height: "100dvh", width: 2, zIndex: 300, margin: 0, pointerEvents: "none" }} aria-hidden="true">
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)", margin: 0 }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: color, transformOrigin: "top", transform: `scaleY(${progress})`, transition: "background 0.8s ease", margin: 0 }} />
      <AnimatePresence>
        {labelVisible && (
          <motion.span
            key={activeRoom}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 0.6, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontFamily: "var(--font-dm-mono)", fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color, whiteSpace: "nowrap" }}
          >
            {ROOMS[activeRoom]?.label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM INDICATOR — right-edge 8 squares
// ══════════════════════════════════════════════════════════════════════════════
function RoomIndicator({ activeRoom, refs }: { activeRoom: number; refs: React.RefObject<HTMLElement | null>[] }) {
  const [hovered, setHovered] = useState(false);

  const scrollTo = useCallback((i: number) => {
    refs[i]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [refs]);

  const labels = ["Threshold", "Meridian", "Coffee Room", "The Wall", "Atelier", "Cabinet", "Gathering", "Conversation"];

  return (
    <div
      style={{ position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 300, display: "flex", flexDirection: "column", gap: 12, margin: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Page navigation"
    >
      {ROOMS.map((r, i) => (
        <button
          key={r.id}
          type="button"
          onClick={() => scrollTo(i)}
          aria-label={`Go to ${labels[i]}`}
          style={{
            position: "relative",
            minWidth: 48,
            minHeight: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px 2px 6px 8px",
            margin: 0,
            boxSizing: "border-box",
          }}
        >
          <AnimatePresence>
            {hovered && (
              <motion.span
                key="label"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 0.7, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
                style={{ fontFamily: "var(--font-dm-mono)", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: r.color, whiteSpace: "nowrap" }}
              >
                {labels[i]}
              </motion.span>
            )}
          </AnimatePresence>
          <motion.div
            animate={{ height: activeRoom === i ? 16 : 4, width: 4, background: activeRoom === i ? r.color : "rgba(255,255,255,0.25)" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{ borderRadius: 2, flexShrink: 0 }}
          />
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOMEPAGE NAV — room-aware, hides in meridian
// ══════════════════════════════════════════════════════════════════════════════
const HOME_NAV_LINKS = [
  { href: "/events",    l: "Events"    },
  { href: "/workshops", l: "Workshops" },
  { href: "/antiques",  l: "Antiques"  },
  { href: "/gallery",   l: "Gallery"   },
  { href: "/menu",      l: "Menu"      },
  { href: "/about",     l: "About"     },
  { href: "/contact",   l: "Contact"   },
] as const;

function HomepageNav({ activeRoom, tod }: { activeRoom: number; tod: typeof TOD[TimeOfDay] }) {
  const hide = activeRoom === 1; // Meridian — no chrome
  const navBgs = ["transparent", "transparent", "rgba(247,240,227,0.92)", "rgba(40,30,18,0.9)", "rgba(28,24,16,0.92)", "rgba(45,10,20,0.92)", "rgba(244,236,223,0.92)", "rgba(20,40,25,0.90)"];
  const navTextColors = ["#C9A96E", "#C9A96E", "#2C1A0E", "#EDE8DA", "#EDE8DA", "#C9A96E", "#2C1A0E", "#EFE7D8"];

  // Rooms 2 & 6 have warm-cream light backgrounds; all others are dark/transparent
  const isLightBg = activeRoom === 2 || activeRoom === 6;

  return (
    <AnimatePresence>
      {!hide && (
        <motion.nav
          key="nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0.9rem clamp(2rem, 5vw, 4rem)",
            background: navBgs[activeRoom] ?? "transparent",
            backdropFilter: activeRoom > 1 ? "blur(16px)" : "none",
            borderBottom: activeRoom > 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            transition: "background 0.6s ease, color 0.6s ease",
            margin: 0,
          }}
        >
          {/* Logo — fixed 2:1 box matches asset (384×192); fill + contain avoids Lighthouse aspect-ratio mismatch */}
          <Link href="/" aria-label="Everwood — home" style={{ textDecoration: "none", display: "block", lineHeight: 0 }}>
            <span
              style={{
                position: "relative",
                display: "block",
                width: "min(280px, 72vw)",
                aspectRatio: "2 / 1",
                maxHeight: 140,
                opacity: 0.95,
                transition: "opacity 0.25s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.95")}
            >
              <Image
                src="/images/nav/logo.png"
                alt="Everwood"
                fill
                priority
                sizes="280px"
                style={{ objectFit: "contain", objectPosition: "left center" }}
              />
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "1.6rem", alignItems: "center" }}>
            {HOME_NAV_LINKS.map(({ href, l }) => {
              const slug = href.slice(1);
              const textColor = navTextColors[activeRoom] ?? tod.nav;
              return (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={e => {
                    const el = e.currentTarget;
                    el.style.opacity = "1";
                    const img = el.querySelector("img") as HTMLImageElement | null;
                    if (img) img.style.opacity = "1";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget;
                    el.style.opacity = "0.75";
                    const img = el.querySelector("img") as HTMLImageElement | null;
                    if (img) img.style.opacity = isLightBg ? "0.65" : "0.8";
                  }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: textColor, textDecoration: "none",
                    opacity: 0.75, transition: "opacity 0.25s ease",
                    minHeight: 48,
                    minWidth: 48,
                    padding: "4px 6px",
                    boxSizing: "border-box",
                  }}
                  className="hidden md:flex"
                >
                  <span style={{ position: "relative", width: 44, height: 36, display: "block", flexShrink: 0 }}>
                    <Image
                      src={`/images/nav/${slug}.png`}
                      alt=""
                      fill
                      sizes="44px"
                      aria-hidden
                      style={{
                        objectFit: "contain",
                        objectPosition: "center",
                        filter: isLightBg ? "none" : "invert(1) contrast(1.1)",
                        mixBlendMode: isLightBg ? "multiply" : "screen",
                        opacity: isLightBg ? 0.65 : 0.85,
                        transition: "opacity 0.25s ease",
                      }}
                    />
                  </span>
                  {l}
                </Link>
              );
            })}

            <Link href="/login"
              onMouseEnter={e => { e.currentTarget.style.background = "#C9A96E"; e.currentTarget.style.color = "#0E1810"; e.currentTarget.style.borderColor = "#C9A96E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9A96E"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)"; }}
              style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", textDecoration: "none", border: "1px solid rgba(201,169,110,0.5)", padding: "0.55rem 1.15rem", borderRadius: 2, transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, boxSizing: "border-box" }}
              className="hidden md:block">
              Login
            </Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LIVE CLOCK
// ══════════════════════════════════════════════════════════════════════════════
function LiveClock({ color }: { color: string }) {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "pm" : "am"}`;
  });

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "pm" : "am"}`);
    };
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.68rem", letterSpacing: "0.15em", color, opacity: 0.6 }}>
      <AnimatePresence mode="wait">
        <motion.span key={time} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: "block" }}>
          {time}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 0 — THE THRESHOLD  (video hero)
// ══════════════════════════════════════════════════════════════════════════════
function Room0Threshold({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ["start start", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const isInView = useInView(sectionRef as React.RefObject<Element>, { amount: 0.3, once: true });

  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(prev => !prev);
  }, []);

  const HERO_WORDS = ["Where", "craft", "meets", "culture"] as const;
  const HERO_VIDEO_PLAYBACK_RATE = 0.55;

  const nextEvent = events.find(e => !e.soldOut);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="threshold"
      style={{ position: "relative", height: "100dvh", overflow: "hidden", margin: 0, padding: 0 }}
    >
      {/* ── Video layer ───────────────────────────────────────────── */}
      <motion.div
        style={{ position: "absolute", inset: 0, margin: 0, opacity: videoOpacity, zIndex: 0, pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* Gradient fallback shown until video is ready */}
        <div
          style={{
            position: "absolute", inset: 0, margin: 0,
            background: `radial-gradient(ellipse 130% 80% at 50% 30%, #1E3028 0%, #162418 50%, #0E1810 100%)`,
            transition: "opacity 1.2s ease",
            opacity: videoReady ? 0 : 1,
            zIndex: 1,
          }}
        />
        {/* Video — place hero.mp4 in /public/videos/ and set HERO_VIDEO_ENABLED=true to enable */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              e.currentTarget.defaultPlaybackRate = HERO_VIDEO_PLAYBACK_RATE;
              e.currentTarget.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
            }}
            onCanPlay={(e) => {
              // Re-apply in case the browser resets playback speed on canplay.
              e.currentTarget.playbackRate = HERO_VIDEO_PLAYBACK_RATE;
              setVideoReady(true);
            }}
            style={{ position: "absolute", inset: 0, margin: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
      </motion.div>

      {/* ── Cinematic overlay stack ───────────────────────────────── */}
      {/* Base dark film — ensures text is always readable */}
      <div style={{ position: "absolute", inset: 0, margin: 0, background: "rgba(6, 4, 10, 0.50)", zIndex: 1, pointerEvents: "none" }} />
      {/* Bottom-heavy vignette — grounds the text */}
      <div style={{ position: "absolute", inset: 0, margin: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0.55) 100%)", zIndex: 2, pointerEvents: "none" }} />
      {/* Warm lamp glow from top */}
      <div style={{ position: "absolute", inset: 0, margin: 0, background: `radial-gradient(ellipse 45% 40% at 50% 0%, rgba(212,148,58,0.22) 0%, transparent 60%)`, zIndex: 3, pointerEvents: "none" }} />
      {/* Film grain */}
      <div style={{ position: "absolute", inset: 0, margin: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "220px", zIndex: 4, pointerEvents: "none" }} />

      {/* ── Content ────────────────────────────────────────────────── */}
      <motion.div
        style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(2.5rem, 8vw, 7rem)", paddingTop: "172px", y: headlineY }}
      >
        {/* Eyebrow — static for LCP (hero text must paint on first frame) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.2rem" }}>
          <span style={{ display: "block", width: 48, height: 1, background: "#C9A96E", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C9A96E" }}>
            Everwood · Casablanca · Est. 2024
          </span>
        </div>

        {/* Headline — no opacity/spring entrance: delayed paint was driving LCP */}
        <h1 style={{ display: "flex", flexWrap: "wrap", gap: "0.38em 1.45em", marginBottom: "0.8rem", lineHeight: 0.95, margin: 0 }}>
          {HERO_WORDS.map((w) => (
            <span
              key={w}
              style={{
                display: "inline-block",
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(4rem, 9vw, 8rem)",
                fontWeight: 500,
                color: "#F4F1E8",
                textShadow: "0 2px 24px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.45)",
                letterSpacing: "-0.01em",
              }}
            >
              {w}
            </span>
          ))}
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(4rem, 9vw, 8rem)",
              fontWeight: 500,
              color: "#D4943A",
              lineHeight: 0.95,
              textShadow: "0 2px 16px rgba(212,148,58,0.4)",
            }}
          >
            .
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(1.15rem, 2.4vw, 1.55rem)",
            color: "rgba(244,241,232,0.88)",
            maxWidth: "50ch",
            lineHeight: 1.65,
            marginTop: "1rem",
            marginBottom: "2.5rem",
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
          }}
        >
          A café. A workshop. A place to make things,<br />
          eat well, and discover something beautiful.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/events" className="hero-cta hero-cta--primary">
            Explore Everwood <ArrowRight size={11} />
          </Link>
          <Link href="/contact" className="hero-cta hero-cta--ghost">
            Reserve a Table
          </Link>
        </div>

        {/* Bottom row: next event + clock */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "clamp(2.5rem,8vw,7rem)",
            right: "clamp(2.5rem,8vw,7rem)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            pointerEvents: "none",
          }}
        >
          {nextEvent && (
            <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(244,241,232,0.50)", lineHeight: 1.6, pointerEvents: "auto" }}>
              <span style={{ display: "block", color: "rgba(201,169,110,0.7)", marginBottom: 3 }}>NEXT EVENT</span>
              <span style={{ color: "rgba(244,241,232,0.65)" }}>{nextEvent.title}</span>
              <span style={{ opacity: 0.5 }}> · {nextEvent.date} · {nextEvent.venue}</span>
            </div>
          )}
          <div style={{ pointerEvents: "auto" }}>
            <LiveClock color="#F4F1E8" />
          </div>
        </div>
      </motion.div>

      {/* ── Mute / unmute video sound ─────────────────────────────── */}
      <motion.button
        type="button"
        className="hero-mute"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "clamp(2.5rem,8vw,7rem)",
          zIndex: 400,
        }}
        whileTap={{ scale: reduceMotion ? 1 : 0.95 }}
      >
        {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
        <span>{muted ? "Sound off" : "Sound on"}</span>
      </motion.button>

      {/* ── Scroll cue ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.7 }}
        style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 10, pointerEvents: "none" }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(201,169,110,0.6), transparent)" }}
        />
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 1 — THE MERIDIAN (no nav, reading light)
// ══════════════════════════════════════════════════════════════════════════════
function Room1Meridian({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ["start end", "end start"] });
  const light = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 1, 1]);

  const LINES = [
    { text: "Crafted by hand.", delay: 0 },
    { text: "Gathered at table.", delay: 0.2 },
    { text: "Found in beauty.", delay: 0.4 },
  ];

  const FACTS = [
    { value: "20", label: "Workshops" },
    { value: "400㎡", label: "Of wonder" },
    { value: "Est.", label: "2024" },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="meridian"
      style={{ position: "relative", height: "90vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "linear-gradient(180deg, #EDE4CF 0%, #F0EBE0 50%, #F7F0E3 100%)", margin: 0, padding: 0 }}
    >
      <HandIllustration />

      {/* Amber lamp glow from top-center */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "radial-gradient(ellipse 65% 75% at 50% 0%, rgba(212,148,58,0.13) 0%, transparent 70%)", pointerEvents: "none", margin: 0 }} aria-hidden="true" />

      {/* Botanical — far left */}
      <div style={{ position: "absolute", top: "8%", left: "-3%", margin: 0, opacity: 0.08, pointerEvents: "none" }} aria-hidden="true">
        <LeafA opacity={1} />
      </div>
      {/* Botanical — far right, mirrored */}
      <div style={{ position: "absolute", bottom: "6%", right: "-2%", margin: 0, opacity: 0.07, transform: "scaleX(-1)", pointerEvents: "none" }} aria-hidden="true">
        <LeafB opacity={1} />
      </div>
      {/* Botanical — top right */}
      <div style={{ position: "absolute", top: "5%", right: "3%", margin: 0, opacity: 0.05, pointerEvents: "none" }} aria-hidden="true">
        <BotanicalA opacity={1} />
      </div>

      {/* Paper grain */}
      <div style={{ position: "absolute", inset: 0, margin: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "220px", mixBlendMode: "multiply", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 clamp(1.5rem, 7vw, 5rem)", width: "100%", maxWidth: "min(1020px, 94vw)" }}>

        {/* Decorative top ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: "2.6rem" }}
          aria-hidden="true"
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(122,92,58,0.28))", maxWidth: 120 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A96E", flexShrink: 0 }} />
          <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.45)", flexShrink: 0 }} />
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A96E", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(122,92,58,0.28))", maxWidth: 120 }} />
        </motion.div>

        {LINES.map(({ text, delay }, li) => (
          <motion.div
            key={li}
            initial={{ opacity: 0.15 }}
            style={{ opacity: useTransform(light, [delay, delay + 0.35], [0.15, 1]) }}
          >
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2.75rem, 5.8vw, 4.85rem)", color: "#2C1A0E", lineHeight: 1.12, margin: "0 0 0.12em" }}>
              {text}
            </p>
          </motion.div>
        ))}

        {/* Attribution */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.72rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#7A5C3A", marginTop: "1.75rem" }}
        >
          — Everwood
        </motion.p>

        {/* Divider with dots */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", margin: "2.35rem 0" }}
          aria-hidden="true"
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(122,92,58,0.2))", maxWidth: 96 }} />
          {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(122,92,58,0.35)" }} />)}
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(122,92,58,0.2))", maxWidth: 96 }} />
        </motion.div>

        {/* Ambient facts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.9, duration: 0.5, type: "spring", stiffness: 180, damping: 22 }}
          style={{ display: "flex", justifyContent: "center", gap: "clamp(3rem, 8vw, 7rem)", alignItems: "center" }}
        >
          {FACTS.map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "clamp(1.95rem, 4.2vw, 3.15rem)", color: "#C8780A", lineHeight: 1, marginBottom: "0.3rem" }}>{value}</p>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(122,92,58,0.55)" }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 2 — THE COFFEE ROOM
// ══════════════════════════════════════════════════════════════════════════════
function Room2Coffee({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.2 });

  const CARD_ENTRANCE = [
    { x: -75, y: 8 },
    { x: 0, y: -58 },
    { x: 85, y: 22 },
    { x: -55, y: 38 },
  ] as const;

  const CARDS = [
    { title: "Espresso", sub: "Single origin · Yirgacheffe", color: "#2C1A0E", price: "18 MAD", style: { left: "0%", top: 52, rotate: -4, z: 1 } },
    { title: "Saffron Latte", sub: "Today's special · House favourite", color: "#C8780A", price: "45 MAD", style: { left: "16%", top: 0, rotate: 0, z: 4, scale: 1.08 } },
    { title: "Date Latte", sub: "Slow-steeped dates · Silky milk", color: "#6B4423", price: "38 MAD", style: { left: "34%", top: 96, rotate: 5, z: 2 } },
    { title: "Atay bi Nana", sub: "Moroccan Mint Tea · Ritual", color: "#4A6741", price: "20 MAD", style: { right: "-2%", top: 40, rotate: -3, z: 3 } },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="coffee"
      style={{
        position: "relative",
        background: "linear-gradient(165deg, #FBF6EC 0%, #F7F0E3 38%, #F2E8D8 100%)",
        overflow: "hidden",
        padding: "clamp(5rem,10vw,9rem) clamp(1.5rem,6vw,5rem) clamp(5.5rem,11vw,10rem)",
        margin: 0,
        minHeight: "min(95vh, 980px)",
      }}
    >
      {/* Lamp glow + warm floor pool */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", margin: 0 }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "58%", background: "radial-gradient(ellipse 70% 85% at 18% 0%, rgba(200,120,10,0.11) 0%, transparent 62%)" }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: "55%", height: "55%", background: "radial-gradient(ellipse at center, rgba(74,103,65,0.07) 0%, transparent 68%)" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", mixBlendMode: "multiply" }} />
      </div>

      {/* Decorative frame line */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "clamp(1.25rem,3vw,2.25rem)",
          border: "1px solid rgba(122,92,58,0.14)",
          borderRadius: 2,
          pointerEvents: "none",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.35)",
        }}
      />

      {/* "through the door →" annotation */}
      <motion.p
        initial={{ opacity: 0, x: -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(1.15rem,2vw,1.35rem)", color: "#C8780A", transform: "rotate(-2deg)", marginBottom: "1.25rem", display: "inline-block", position: "relative", zIndex: 1 }}
      >
        through the door →
      </motion.p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 0.95fr)",
          gap: "clamp(2.5rem,6vw,5.5rem)",
          alignItems: "start",
          maxWidth: "min(1420px, 94vw)",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LEFT: scattered illustrated cards */}
        <div>
          <motion.p initial={{ opacity: 0, scaleX: 0 }} animate={isInView ? { opacity: 1, scaleX: 1 } : {}} transition={{ delay: 0.3 }} style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", letterSpacing: "0.42em", textTransform: "uppercase", color: "#7A5C3A", marginBottom: "0.65rem", transformOrigin: "left" }}>THE COFFEE ROOM</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.7, type: "spring", stiffness: 160 }} style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.65rem,5.2vw,4.6rem)", color: "#1A120A", lineHeight: 1.04, marginBottom: "0.35rem", textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}>
            A cup for every<br />quiet moment.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(1.05rem,1.8vw,1.2rem)", color: "#C8780A", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: "2.25rem" }}>all day, every day</motion.p>

          {/* Drink cards */}
          <div style={{ position: "relative", height: "clamp(430px, 52vw, 540px)", marginTop: "1.25rem" }}>
            {CARDS.map((c, i) => {
              const entrance = CARD_ENTRANCE[i] ?? { x: 0, y: 0 };
              return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: entrance.x, y: entrance.y }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.12, type: "spring", stiffness: 200, damping: 22 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                style={{ position: "absolute", ...c.style, width: "clamp(235px, 25vw, 300px)", zIndex: c.style.z, transform: `rotate(${c.style.rotate}deg) scale(${(c.style as { scale?: number }).scale ?? 1})` }}
              >
                <div style={{ background: "linear-gradient(145deg, #FFFCF7 0%, #FFF9F0 100%)", border: `1.5px solid ${c.color}28`, borderRadius: 18, padding: "1.55rem 1.6rem", boxShadow: i === 1 ? `0 18px 56px ${c.color}2a, 0 6px 16px rgba(42,26,14,0.08)` : "0 12px 36px rgba(42,26,14,0.1), 0 1px 0 rgba(255,255,255,0.85) inset" }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${c.color}1a`, border: `1px solid ${c.color}38`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.05rem" }}>
                    <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.85rem", color: c.color }}>☕</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: "1.2rem", color: "#1A120A", marginBottom: "0.3rem", letterSpacing: "-0.02em" }}>{c.title}</p>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "0.78rem", color: "#7A5C3A", marginBottom: "0.7rem", lineHeight: 1.4 }}>{c.sub}</p>
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.8rem", color: c.color, letterSpacing: "0.06em" }}>{c.price}</p>
                  {i === 1 && <div style={{ position: "absolute", inset: -12, borderRadius: 24, background: `radial-gradient(ellipse at center, ${c.color}18 0%, transparent 72%)`, zIndex: -1 }} />}
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: menu category teaser */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: "clamp(2.5rem,5vw,4.75rem) clamp(1.75rem,3.5vw,2.5rem) clamp(2.25rem,4vw,3rem)",
            background: "linear-gradient(160deg, rgba(255,252,247,0.92) 0%, rgba(255,249,240,0.88) 100%)",
            border: "1px solid rgba(122,92,58,0.18)",
            borderRadius: 20,
            boxShadow: "0 24px 64px rgba(42,26,14,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(122,92,58,0.65)", marginBottom: "1.25rem" }}>From the board</p>
          {[
            { label: "Espresso & Beyond", weight: 400, color: "#1A120A" },
            { label: "Teas & Tonics", weight: 400, color: "#1A120A" },
            { label: "Today's Specials", weight: 600, color: "#C8780A" },
          ].map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={isInView ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : {}} transition={{ delay: 1.0 + i * 0.15, duration: 0.45, ease: "easeOut" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: cat.weight, fontSize: "clamp(1.45rem,2.8vw,2.05rem)", color: cat.color, marginBottom: "0.65rem", lineHeight: 1.2 }}>{cat.label}</p>
              {i < 2 && <div style={{ height: 1, background: `linear-gradient(to right, rgba(122,92,58,0.35), transparent)`, marginBottom: "1rem" }} />}
            </motion.div>
          ))}
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }} style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(1rem,1.6vw,1.1rem)", color: "#B5621E", transform: "rotate(-1deg)", display: "inline-block", marginBottom: "1.75rem", marginTop: "0.25rem" }}>Saffron Latte · Date Latte</motion.p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/menu"
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#F7F0E3",
                textDecoration: "none",
                background: "linear-gradient(135deg, #C8780A 0%, #A86208 100%)",
                border: "1px solid rgba(168,98,8,0.5)",
                padding: "0.9rem 1.75rem",
                display: "inline-block",
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(200,120,10,0.28)",
              }}
            >
              Explore the Menu →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 3 — THE WALL (brick + glass panels)
// ══════════════════════════════════════════════════════════════════════════════
function Room3Wall({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  const PANELS = [
    { category: "Nature & Earth",             workshops: 6, color: "#4A6741", glow: "rgba(74,103,65,0.45)",    categoryKey: "nature-earth" as const },
    { category: "Light & Wonder",             workshops: 5, color: "#D4820A", glow: "rgba(212,130,10,0.4)",   categoryKey: "light-wonder" as const },
    { category: "Imagination & Expression",   workshops: 5, color: "#6B4C8A", glow: "rgba(107,76,138,0.42)", categoryKey: "imagination" as const },
    { category: "Making & Craft",             workshops: 4, color: "#C4501A", glow: "rgba(196,80,26,0.4)",   categoryKey: "making-craft" as const },
  ];

  const ROWS = 8;
  const BRICKS_PER_ROW = 12;
  const MORTAR = "#241A12";
  const brickStyle = (row: number, b: number) => {
    const hue = 22 + (row * 7 + b * 3) % 14;
    const sat = 22 + (b * 3) % 12;
    const light = 19 + (row + b) % 9;
    const top = `hsl(${hue}, ${sat}%, ${light + 6}%)`;
    const mid = `hsl(${hue}, ${sat}%, ${light}%)`;
    const bot = `hsl(${hue}, ${sat}%, ${Math.max(12, light - 5)}%)`;
    return {
      flex: b === 0 || b === BRICKS_PER_ROW - 1 ? ("0 0 28px" as const) : ("1" as const),
      height: 26,
      borderRadius: 2,
      background: `linear-gradient(180deg, ${top} 0%, ${mid} 42%, ${bot} 100%)`,
      boxShadow: `${`inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -2px 4px rgba(0,0,0,0.22), 0 3px 6px rgba(0,0,0,0.18)`}`,
    } as const;
  };

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="wall"
      style={{ position: "relative", overflow: "hidden", margin: 0, padding: 0 }}
    >
      {/* Brick section */}
      <div
        style={{
          background: `linear-gradient(180deg, #4F3B2C 0%, #3A2B1A 8%, #32261C 55%, #2C2118 100%)`,
          padding: "clamp(2.25rem, 5vw, 3.75rem) clamp(0.5rem, 2vw, 1.25rem) 0",
          position: "relative",
        }}
      >
        {/* Atmosphere: warmth behind future window + edge vignette */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", margin: 0 }}>
          <div
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              top: "18%",
              height: "42%",
              background: "radial-gradient(ellipse 70% 75% at 50% 80%, rgba(212,130,40,0.14) 0%, rgba(180,100,40,0.05) 45%, transparent 70%)",
              opacity: 0.85,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 85% 60% at 50% 50%, transparent 40%, rgba(10,8,6,0.55) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.12,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "rgba(201,169,110,0.45)",
            textAlign: "center",
            margin: "0 0 1.25rem",
            position: "relative",
            zIndex: 1,
            letterSpacing: "0.02em",
          }}
        >
          something glows behind the glass…
        </p>

        {Array.from({ length: ROWS }).map((_, row) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -36 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: row * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: 5, marginBottom: 5, paddingLeft: row % 2 === 0 ? 0 : 32, position: "relative", zIndex: 1 }}
          >
            {Array.from({ length: BRICKS_PER_ROW }).map((_, b) => {
              const s = brickStyle(row, b);
              return <div key={b} style={{ ...s, boxShadow: `${s.boxShadow}, 0 0 0 1px ${MORTAR}` }} />;
            })}
          </motion.div>
        ))}

        {/* Lintel + glass window strip */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 2,
            margin: "clamp(0.75rem, 2vw, 1.25rem) 0 0",
            borderRadius: 4,
            padding: "10px 12px 12px",
            background: "linear-gradient(180deg, #5C4332 0%, #3D2D22 45%, #2A1F18 100%)",
            boxShadow: "0 -2px 0 rgba(255,255,255,0.06) inset, 0 28px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.35)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 6,
              left: 16,
              right: 16,
              height: 3,
              borderRadius: 2,
              background: "linear-gradient(90deg, transparent, rgba(255,245,220,0.25), transparent)",
              opacity: 0.7,
            }}
          />
          <div
            style={{
              display: "flex",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(20,15,10,0.9)",
              boxShadow: "0 0 0 1px rgba(90,64,48,0.5), inset 0 0 40px rgba(0,0,0,0.35)",
              background: "#1A1410",
              position: "relative",
            }}
          >
            {/* Slow glass shimmer */}
            <motion.div
              aria-hidden="true"
              initial={{ x: "-40%" }}
              animate={isInView && !reduceMotion ? { x: "140%" } : { x: "-40%" }}
              transition={
                reduceMotion || !isInView
                  ? undefined
                  : { duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }
              }
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.07) 48%, transparent 52%)",
                width: "35%",
                pointerEvents: "none",
                zIndex: 4,
              }}
            />
            {PANELS.map((panel, i) => (
              <Link
                key={panel.categoryKey}
                href={`/workshops?category=${panel.categoryKey}`}
                aria-label={`${panel.category}: browse workshops`}
                style={{
                  flex: 1,
                  minWidth: 0,
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
              <motion.div
                onMouseEnter={() => setHoveredPanel(i)}
                onMouseLeave={() => setHoveredPanel(null)}
                animate={{
                  scale: hoveredPanel === i ? 1.02 : 1,
                  zIndex: hoveredPanel === i ? 3 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{
                  minHeight: 168,
                  height: "100%",
                  position: "relative",
                  borderRight: i < 3 ? "4px solid #3A2820" : "none",
                  cursor: "pointer",
                  overflow: "hidden",
                  boxShadow: hoveredPanel === i ? `inset 0 0 0 2px ${panel.color}, 0 0 32px ${panel.glow}` : "inset 0 0 0 1px rgba(255,255,255,0.03)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: 0,
                    background: `radial-gradient(ellipse 120% 100% at 50% 100%, ${panel.color}55 0%, ${panel.color}18 42%, transparent 72%)`,
                    transform: hoveredPanel === i ? "scale(1.06)" : "scale(1)",
                    transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: 0,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 35%, rgba(0,0,0,0.35) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    margin: 0,
                    background: "rgba(12,18,14,0.35)",
                    backdropFilter: hoveredPanel === i ? "blur(0px)" : "blur(6px)",
                    WebkitBackdropFilter: hoveredPanel === i ? "blur(0px)" : "blur(6px)",
                    transition: "backdrop-filter 0.35s ease, background 0.35s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 12,
                    fontFamily: "var(--font-dm-mono)",
                    fontSize: "0.5rem",
                    letterSpacing: "0.35em",
                    color: "rgba(237,232,218,0.22)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem 0.75rem" }}>
                  <motion.div
                    animate={{ opacity: hoveredPanel === i ? 1 : 0.5, y: hoveredPanel === i ? 0 : 4 }}
                    transition={{ duration: 0.25 }}
                    style={{ textAlign: "center" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-cormorant)",
                        fontStyle: "italic",
                        fontWeight: 600,
                        fontSize: "clamp(0.95rem, 1.8vw, 1.25rem)",
                        color: "#EDE8DA",
                        margin: "0 0 0.35rem",
                        lineHeight: 1.2,
                        textShadow: hoveredPanel === i ? `0 0 24px ${panel.glow}` : "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {panel.category}
                    </p>
                    <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: panel.color, marginBottom: 6 }}>
                      {panel.workshops} workshops
                    </p>
                    <div style={{ width: 36, height: 2, margin: "0 auto", borderRadius: 1, background: `linear-gradient(90deg, transparent, ${panel.color}, transparent)`, opacity: hoveredPanel === i ? 1 : 0.35 }} />
                  </motion.div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom brick rows */}
        <div style={{ padding: "clamp(0.75rem, 2vw, 1.25rem) 0 clamp(1.25rem, 3vw, 2rem)", position: "relative", zIndex: 1 }}>
          {Array.from({ length: 4 }).map((_, row) => (
            <motion.div
              key={`b${row}`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.65 + row * 0.05, duration: 0.4 }}
              style={{ display: "flex", gap: 5, marginBottom: 5, paddingLeft: row % 2 === 0 ? 0 : 32 }}
            >
              {Array.from({ length: BRICKS_PER_ROW }).map((_, b) => {
                const s = brickStyle(row + ROWS, b);
                return <div key={b} style={{ ...s, boxShadow: `${s.boxShadow}, 0 0 0 1px ${MORTAR}` }} />;
              })}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          background: "linear-gradient(180deg, #1E1810 0%, #16120E 100%)",
          padding: "clamp(1.25rem, 3vw, 1.85rem) 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem 2.5rem",
          borderTop: "1px solid rgba(201,169,110,0.12)",
          boxShadow: "0 -20px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,0.35))" }} />
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(201,169,110,0.75)" }}>THE ATELIER</span>
          <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, rgba(201,169,110,0.35), transparent)" }} />
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/workshops"
            style={{
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.64rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#1A1410",
              textDecoration: "none",
              background: "linear-gradient(180deg, #E8D4A8 0%, #C9A96E 100%)",
              border: "1px solid rgba(201,169,110,0.55)",
              padding: "0.72rem 1.6rem",
              borderRadius: 2,
              boxShadow: "0 6px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
            }}
          >
            Discover All Workshops →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 4 — THE ATELIER (workshop stack)
// ══════════════════════════════════════════════════════════════════════════════
function Room4Atelier({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const stackWorkshops = workshops.filter(w => STACK_IDS.includes(w.id)).slice(0, 6);
  const [topIndex, setTopIndex] = useState(0);
  const [currentLabel, setCurrentLabel] = useState(stackWorkshops[0]?.title ?? "");
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: false, amount: 0.3 });

  const advanceStack = useCallback(() => {
    if (stackWorkshops.length === 0) return;
    setTopIndex(prev => {
      const next = (prev + 1) % stackWorkshops.length;
      setCurrentLabel(stackWorkshops[next]?.title ?? "");
      return next;
    });
  }, [stackWorkshops]);

  useEffect(() => {
    if (!isInView || stackWorkshops.length === 0) return;
    const id = setInterval(() => {
      setTopIndex(prev => {
        const next = (prev + 1) % stackWorkshops.length;
        setCurrentLabel(stackWorkshops[next]?.title ?? "");
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [isInView, stackWorkshops]);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="atelier"
      style={{ background: "#1C1810", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)", margin: 0, position: "relative", overflow: "hidden" }}
    >
      {/* "make something →" annotation */}
      <motion.p
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.6 }}
        style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem", color: "#D4820A", transform: "rotate(1.5deg)", marginBottom: "1rem", display: "inline-block", float: "right", marginRight: "2rem" }}
      >
        make something →
      </motion.p>
      <div style={{ clear: "both" }} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 1.05fr)", gap: "clamp(2rem,5vw,4.5rem)", alignItems: "center", maxWidth: "min(1320px, 94vw)", margin: "0 auto" }}>
        {/* LEFT: content panel */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#E8A030", marginBottom: "0.3rem" }}>THE ATELIER</p>
            <AnimatePresence mode="wait">
              <motion.p key={currentLabel} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(237,232,218,0.82)", marginBottom: "1rem" }}>
                CURRENTLY SHOWING — {currentLabel}
              </motion.p>
            </AnimatePresence>
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.5rem,5vw,4rem)", color: "#EDE8DA", lineHeight: 1.0, marginBottom: "1rem" }}>
            Make something<br />with your hands.
          </h2>
          <p style={{ fontFamily: "var(--font-lora)", fontSize: "clamp(0.9rem,1.6vw,1rem)", color: "rgba(237,232,218,0.88)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "45ch" }}>
            Twenty workshops. Every material imaginable. A table, a teacher, and two hours of making something real.
          </p>

          {/* Category labels (decorative — not controls; spans avoid false button semantics) */}
          <div role="list" aria-label="Workshop categories" style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginBottom: "2rem" }}>
            {[
              { label: "Nature & Earth", color: "#4A6741" },
              { label: "Light & Wonder", color: "#D4820A" },
              { label: "Imagination",    color: "#6B4C8A" },
              { label: "Making & Craft", color: "#C4501A" },
            ].map(({ label, color }) => (
              <span
                key={label}
                role="listitem"
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#EDE8DA",
                  background: "rgba(237,232,218,0.08)",
                  border: `1px solid ${color}`,
                  boxShadow: `inset 0 0 0 1px ${color}33`,
                  padding: "0.5rem 1rem",
                  borderRadius: 2,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <Link href="/workshops" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#F0B040", textDecoration: "none", border: "1px solid rgba(240,176,64,0.55)", padding: "0.85rem 1.5rem", display: "inline-flex", alignItems: "center", minHeight: 48, boxSizing: "border-box" }}>
            Browse All 20 Workshops →
          </Link>
        </div>

        {/* RIGHT: workshop stack */}
        <div
          onClick={() => advanceStack()}
          style={{ position: "relative", height: "clamp(480px, 52vw, 600px)", minHeight: 480 }}
        >
          <AnimatePresence>
            {stackWorkshops.map((w, i) => {
              const offset = (i - topIndex + stackWorkshops.length) % stackWorkshops.length;
              if (offset > 2) return null;
              const isTop = offset === 0;
              const catLabel = categoryConfig[w.category]?.label ?? w.category.replace(/-/g, " · ");
              return (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ x: 80, opacity: 0, rotate: 8 }}
                  animate={{ x: offset * 14, y: offset * 16, rotate: offset === 0 ? -1.2 : offset === 1 ? 2.2 : -2.2, zIndex: 10 - offset, opacity: 1, scale: 1 - offset * 0.028 }}
                  exit={{ x: 160, opacity: 0, rotate: 14 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{ position: "absolute", inset: 0, cursor: "pointer" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      borderRadius: 22,
                      overflow: "hidden",
                      boxShadow: isTop ? "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,169,110,0.12)" : "0 14px 40px rgba(0,0,0,0.45)",
                      border: isTop ? "1px solid rgba(237,232,218,0.14)" : "1px solid rgba(0,0,0,0.35)",
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0 }}>
                      <Image
                        src={w.image}
                        alt={`${w.title} — Everwood workshop`}
                        fill
                        sizes="(min-width: 1024px) 560px, 90vw"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                        priority={isTop}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        margin: 0,
                        background: `linear-gradient(165deg, rgba(8,4,2,0.25) 0%, transparent 42%), linear-gradient(to top, rgba(10,6,4,0.94) 0%, rgba(10,6,4,0.45) 38%, transparent 62%), ${w.gradient}`,
                        opacity: 0.92,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        margin: 0,
                        background: "radial-gradient(ellipse 95% 70% at 50% 18%, rgba(255,240,220,0.12) 0%, transparent 50%), radial-gradient(ellipse 120% 90% at 50% 100%, rgba(6,4,2,0.55) 0%, transparent 52%)",
                        pointerEvents: "none",
                      }}
                    />
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(1.35rem, 3vw, 2rem)", background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)" }}>
                      <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#EDE8DA", borderLeft: `3px solid ${w.accentColor}`, paddingLeft: "0.65rem", marginBottom: "0.45rem" }}>{catLabel}</p>
                      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(1.45rem, 3.2vw, 2.15rem)", color: "#EDE8DA", lineHeight: 1.08, marginBottom: "0.4rem", textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>{w.title}</p>
                      <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "clamp(0.82rem, 1.5vw, 0.95rem)", color: "rgba(237,232,218,0.92)", marginBottom: "0.55rem", lineHeight: 1.45, maxWidth: "36ch" }}>{w.tagline}</p>
                      <p style={{ fontFamily: "var(--font-lora)", fontSize: "clamp(0.75rem, 1.25vw, 0.82rem)", color: "rgba(237,232,218,0.82)", marginBottom: "1rem", lineHeight: 1.5, maxWidth: "40ch", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{w.whatYoullMake}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", color: "rgba(237,232,218,0.78)", letterSpacing: "0.08em" }}>{w.duration} · {w.groupSize} people</span>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.78rem", color: "#E8D4A8", fontWeight: 500 }}>From {w.price} {w.currency}</span>
                      </div>
                      {isTop && (
                        <Link
                          href="/workshops"
                          onClick={e => e.stopPropagation()}
                          style={{
                            marginTop: "1.1rem",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 48,
                            fontFamily: "var(--font-dm-mono)",
                            fontSize: "0.58rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#1A1410",
                            textDecoration: "none",
                            background: "linear-gradient(180deg, #F0E0C0 0%, #C9A96E 100%)",
                            border: "1px solid rgba(201,169,110,0.5)",
                            padding: "0.65rem 1.25rem",
                            borderRadius: 2,
                            boxSizing: "border-box",
                          }}
                        >
                          View workshop →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <p style={{ position: "absolute", bottom: -36, right: 0, fontFamily: "var(--font-dm-mono)", fontSize: "0.54rem", color: "rgba(237,232,218,0.65)", letterSpacing: "0.12em" }}>CLICK STACK FOR NEXT</p>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 5 — THE CABINET (diagonal split)
// ══════════════════════════════════════════════════════════════════════════════
function Room5Cabinet({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ["start end", "end start"] });

  const stripY = useTransform(scrollYProgress, [0, 1], ["14%", "-32%"]);
  const stripInnerY = useTransform(scrollYProgress, [0, 1], ["6%", "-14%"]);
  const galleryRowY = [
    useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]),
    useTransform(scrollYProgress, [0, 1], ["1.5%", "-12%"]),
    useTransform(scrollYProgress, [0, 1], ["3%", "-16%"]),
    useTransform(scrollYProgress, [0, 1], ["0.5%", "-9%"]),
    useTransform(scrollYProgress, [0, 1], ["2%", "-11%"]),
    useTransform(scrollYProgress, [0, 1], ["1%", "-10%"]),
  ] as const;
  const leftGlowY = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);
  const leftGlowScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const leftPhotoY = useTransform(scrollYProgress, [0, 1], ["6%", "-14%"]);
  const medallionY = useTransform(scrollYProgress, [0, 1], ["-5%", "14%"]);
  const textBlockY = useTransform(scrollYProgress, [0, 1], ["3%", "-6%"]);
  const dividerShift = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const scanOpacity = useTransform(scrollYProgress, [0.2, 0.45, 0.7], [0.04, 0.14, 0.05]);

  const OBJECTS = [
    { name: "Brass Compass", desc: "Patina, needle, and the pull of true north.", bg: "radial-gradient(ellipse at 40% 30%, #4A2A0A, #2D0A14)", image: "/workshops/jewellery-making.png" },
    { name: "Ceramic Pitcher", desc: "Thrown by hand. Glazed by time.", bg: "radial-gradient(ellipse at 60% 60%, #3A1A28, #2D0A14)", image: "/workshops/pottery.png" },
    { name: "Leather-Bound Journal", desc: "Pages that remember every ink stroke.", bg: "radial-gradient(ellipse at 50% 20%, #4A3010, #2D0A14)", image: "/workshops/weaving.png" },
  ];
  // Use index 0 for SSR; randomise after hydration to avoid mismatch
  const [objIndex, setObjIndex] = useState(0);
  useEffect(() => { setObjIndex(Math.floor(Math.random() * OBJECTS.length)); }, []);
  const obj = OBJECTS[objIndex];

  const GALLERY = [
    { color: "#3A2A1E", aspect: "28%", image: "/workshops/terrarium.png", alt: "Everwood gallery — botanical still" },
    { color: "#2A3A28", aspect: "34%", image: "/workshops/mosaic.png", alt: "Everwood gallery — pattern and stone" },
    { color: "#2A1E3A", aspect: "40%", image: "/workshops/glass-painting.png", alt: "Everwood gallery — light through glass" },
    { color: "#1E2A32", aspect: "30%", image: "/workshops/wood-carving.png", alt: "Everwood gallery — carved wood" },
    { color: "#2A2520", aspect: "28%", image: "/workshops/candle-making.png", alt: "Everwood gallery — warm light" },
    { color: "#1E2830", aspect: "30%", image: "/workshops/resin-decor.png", alt: "Everwood gallery — resin and color" },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="cabinet"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "auto",
        overflow: "hidden",
        margin: 0,
        isolation: "isolate",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          flex: 1,
          width: "100%",
          minHeight: "clamp(680px, 88vh, 960px)",
        }}
      >
      {/* LEFT: Antiques */}
      <motion.div
        initial={{ background: "#1A1218" }}
        animate={isInView ? { background: "#2D0A14" } : {}}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ flex: 1, position: "relative", overflow: "hidden", clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%)" }}
      >
        <motion.div
          style={
            reduceMotion
              ? { position: "absolute", inset: "-5%", margin: 0, background: `${obj.bg}, radial-gradient(ellipse 55% 65% at 50% 22%, rgba(183,144,79,0.22) 0%, transparent 62%)`, transformOrigin: "center 25%" }
              : { position: "absolute", inset: "-5%", margin: 0, background: `${obj.bg}, radial-gradient(ellipse 55% 65% at 50% 22%, rgba(183,144,79,0.22) 0%, transparent 62%)`, transformOrigin: "center 25%", y: leftGlowY, scale: leftGlowScale }
          }
        />
        <motion.div
          key={obj.image}
          style={
            reduceMotion
              ? { position: "absolute", inset: "-4%", margin: 0, zIndex: 0 }
              : { position: "absolute", inset: "-4%", margin: 0, zIndex: 0, y: leftPhotoY }
          }
          aria-hidden="true"
        >
          <Image
            src={obj.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, margin: 0, zIndex: 1, background: "radial-gradient(ellipse 72% 82% at 48% 48%, transparent 28%, rgba(45,10,20,0.88) 100%)", pointerEvents: "none" }} />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            opacity: 0.2,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
        <motion.div
          aria-hidden="true"
          style={
            reduceMotion
              ? { position: "absolute", inset: 0, margin: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(105deg, transparent 40%, rgba(255,248,230,0.12) 50%, transparent 60%)", opacity: 0.08 }
              : { position: "absolute", inset: 0, margin: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(105deg, transparent 40%, rgba(255,248,230,0.12) 50%, transparent 60%)", opacity: scanOpacity }
          }
        />

        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "auto", zIndex: 3, maxWidth: "min(252px, 86vw)" }}>
          <Link href="/antiques" aria-label={`Explore antiques — ${obj.name}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={reduceMotion ? undefined : { rotate: 1.2, scale: 1.03 }}
              style={
                reduceMotion
                  ? {
                      padding: "clamp(0.75rem, 1.8vw, 1rem) clamp(0.95rem, 2.2vw, 1.25rem)",
                      borderRadius: 16,
                      background: "linear-gradient(165deg, rgba(14,10,12,0.82) 0%, rgba(8,5,8,0.88) 100%)",
                      border: "1px solid rgba(201,169,110,0.35)",
                      boxShadow: "0 14px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                    }
                  : {
                      y: medallionY,
                      padding: "clamp(0.75rem, 1.8vw, 1rem) clamp(0.95rem, 2.2vw, 1.25rem)",
                      borderRadius: 16,
                      background: "linear-gradient(165deg, rgba(14,10,12,0.82) 0%, rgba(8,5,8,0.88) 100%)",
                      border: "1px solid rgba(201,169,110,0.35)",
                      boxShadow: "0 14px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                    }
              }
            >
              <div
                style={{
                  width: "clamp(88px, 10.5vw, 118px)",
                  height: "clamp(88px, 10.5vw, 118px)",
                  borderRadius: "50%",
                  background: "linear-gradient(145deg, rgba(232,212,168,0.22) 0%, rgba(183,144,79,0.14) 100%)",
                  border: "1px solid rgba(232,212,168,0.45)",
                  boxShadow: "0 8px 28px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(2rem, 3.8vw, 2.85rem)",
                    color: "#F4ECD8",
                    lineHeight: 1,
                    textShadow: "0 2px 8px rgba(0,0,0,0.75), 0 0 20px rgba(201,169,110,0.4)",
                  }}
                >
                  ⊙
                </span>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "clamp(0.92rem, 1.75vw, 1.15rem)",
                  color: "#F4F1E8",
                  margin: "0.65rem 0 0",
                  letterSpacing: "0.03em",
                  lineHeight: 1.3,
                  textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.95)",
                  WebkitFontSmoothing: "antialiased",
                }}
              >
                {obj.name}
              </p>
            </motion.div>
          </Link>
        </div>

        <motion.div style={reduceMotion ? { position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 4 } : { position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 4, y: textBlockY }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.54rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,169,110,0.55)" }}>CURATED ANTIQUES</p>
        </motion.div>
        <motion.div style={reduceMotion ? { position: "absolute", bottom: "2rem", left: "1.5rem", maxWidth: 280, zIndex: 4 } : { position: "absolute", bottom: "2rem", left: "1.5rem", maxWidth: 280, zIndex: 4, y: textBlockY }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.25rem, 2.8vw, 1.85rem)", color: "rgba(239,231,216,0.82)", lineHeight: 1.2, marginBottom: "0.65rem", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>{obj.desc}</p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/antiques"
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#1A1410",
                textDecoration: "none",
                background: "linear-gradient(180deg, #E8D4A8 0%, #C9A96E 100%)",
                border: "1px solid rgba(201,169,110,0.45)",
                padding: "0.65rem 1.35rem",
                display: "inline-block",
                borderRadius: 2,
                boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              }}
            >
              Explore the Collection →
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Diagonal divider */}
      <motion.div
        style={
          reduceMotion
            ? { position: "absolute", top: 0, bottom: 0, left: "50%", x: "-50%", width: 2, zIndex: 10, margin: 0, pointerEvents: "none" }
            : { position: "absolute", top: 0, bottom: 0, left: "50%", x: "-50%", width: 2, zIndex: 10, margin: 0, pointerEvents: "none", y: dividerShift }
        }
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.65) 28%, rgba(201,169,110,0.65) 72%, transparent)", filter: "blur(1px)" }} />
        <motion.div
          animate={reduceMotion ? undefined : { rotate: [2, -2, 2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "2px solid rgba(201,169,110,0.65)",
            boxShadow: "0 0 24px rgba(201,169,110,0.25), inset 0 0 12px rgba(201,169,110,0.12)",
          }}
        />
      </motion.div>

      {/* RIGHT: Gallery strip */}
      <motion.div
        initial={{ background: "#0D1018" }}
        animate={isInView ? { background: "#0E1622" } : {}}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ flex: 1, position: "relative", overflow: "hidden", clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(100,130,160,0.08) 0%, transparent 55%), linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "10%",
            width: 18,
            background: `repeating-linear-gradient(180deg, transparent 0px, transparent 14px, rgba(201,169,110,0.12) 14px, rgba(201,169,110,0.12) 18px)`,
            opacity: 0.5,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        <div style={{ position: "absolute", top: "50%", left: "1.25rem", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center", zIndex: 5 }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(201,169,110,0.38)" }}>GALLERY</p>
        </div>

        <motion.div
          style={
            reduceMotion
              ? { position: "absolute", top: "-4%", left: "11%", right: 0, height: "108%", display: "flex", flexDirection: "column", gap: 4, paddingRight: "0.5rem" }
              : { position: "absolute", top: "-4%", left: "11%", right: 0, height: "108%", display: "flex", flexDirection: "column", gap: 4, paddingRight: "0.5rem", y: stripY }
          }
        >
          <motion.div
            style={
              reduceMotion
                ? { position: "absolute", inset: 0, margin: 0, pointerEvents: "none" }
                : { position: "absolute", inset: 0, margin: 0, pointerEvents: "none", y: stripInnerY }
            }
            aria-hidden="true"
          >
            <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "22px 100%" }} />
          </motion.div>
          {GALLERY.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ filter: "saturate(1.05) contrast(1.05)", boxShadow: "inset 0 0 0 2px rgba(201,169,110,0.45)" }}
              style={
                reduceMotion
                  ? { paddingBottom: g.aspect, position: "relative", background: g.color, filter: "saturate(0.55) contrast(1.08)", transition: "filter 0.3s", borderRadius: 2, overflow: "hidden" }
                  : { paddingBottom: g.aspect, position: "relative", background: g.color, filter: "saturate(0.55) contrast(1.08)", transition: "filter 0.3s", borderRadius: 2, overflow: "hidden", y: galleryRowY[i] ?? galleryRowY[0] }
              }
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <Image src={g.image} alt={g.alt} fill sizes="(min-width: 1024px) 40vw, 85vw" style={{ objectFit: "cover", objectPosition: "center" }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: g.color, opacity: 0.35, mixBlendMode: "multiply" }} aria-hidden="true" />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 45% 35%, rgba(201,169,110,0.12) 0%, transparent 65%)" }} aria-hidden="true" />
              <div style={{ position: "absolute", top: 8, left: 8, right: 8, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} aria-hidden="true" />
            </motion.div>
          ))}
        </motion.div>

        <div style={{ position: "absolute", bottom: "2rem", right: "1.5rem", zIndex: 6 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/gallery"
              style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#EDE8DA",
                textDecoration: "none",
                border: "1px solid rgba(201,169,110,0.45)",
                padding: "0.65rem 1.35rem",
                display: "inline-block",
                borderRadius: 2,
                background: "rgba(20,30,45,0.5)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
              }}
            >
              View the Gallery →
            </Link>
          </motion.div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 6 — THE GATHERING (events + story)
// ══════════════════════════════════════════════════════════════════════════════
function Room6Gathering({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const upcomingEvents = events.filter(e => !e.soldOut).slice(0, 3);
  const genreLabel = { jazz: "Jazz", swing: "Swing", blues: "Blues", special: "Evening" } as const;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="gathering"
      style={{ background: "#F4ECDF", margin: 0, overflow: "hidden" }}
    >
      {/* Story letterbox */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.85 }}
        animate={isInView ? { opacity: 1, scaleY: 1 } : {}}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", height: 240, overflow: "hidden", margin: 0, transformOrigin: "top" }}
      >
        <motion.div
          style={{ position: "absolute", inset: 0, margin: 0, background: "linear-gradient(135deg, #3A2A1E 0%, #2C1A0E 50%, #4A3020 100%)", y: photoY }}
        />
        {/* Warm overlay */}
        <div style={{ position: "absolute", inset: 0, margin: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(212,148,58,0.15), transparent 60%)" }} />
        {/* Dark gradient for text */}
        <div style={{ position: "absolute", inset: 0, margin: 0, background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.20) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "clamp(2rem,6vw,4rem)", maxWidth: 500 }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)", marginBottom: "0.5rem" }}>OUR STORY</p>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(1.3rem,3vw,2rem)", color: "rgba(239,231,216,0.9)", lineHeight: 1.25, marginBottom: "0.8rem" }}>
            Built on three obsessions:<br />fire, time, and making things by hand.
          </p>
          <Link href="/about" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.8)", textDecoration: "none" }}>Read Our Story →</Link>
        </div>
      </motion.div>

      {/* Upcoming events — ticket-style cards */}
      <div
        style={{
          position: "relative",
          padding: "clamp(3rem, 7vw, 5.5rem) clamp(1.5rem, 6vw, 5rem) clamp(3.5rem, 8vw, 6rem)",
          background: "linear-gradient(180deg, #F4ECDF 0%, #EFE4D4 50%, #EBDECC 100%)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: "clamp(2rem, 4vw, 3rem)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "0.75rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(181,98,30,0.35))", maxWidth: 72 }} />
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "#B5621E", margin: 0 }}>Upcoming events</p>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(181,98,30,0.35))", maxWidth: 72 }} />
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "clamp(1.05rem, 2vw, 1.35rem)", color: "#7A5C3A", margin: "0 0 0.35rem", textAlign: "center" }}>Nights that fill the house</p>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(122,92,58,0.55)", textAlign: "center", margin: 0 }}>
              {upcomingEvents.length} on the calendar · doors, lights, music
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem, 2vw, 1.35rem)" }}>
            {upcomingEvents.map((ev, i) => {
              const [c0, c1] = ev.bgColors;
              const soldPct = Math.min(100, Math.max(0, ev.availability));
              const urgency = soldPct >= 85;
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 28 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reduceMotion ? undefined : { y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }}
                  style={{ position: "relative" }}
                >
                  <Link
                    href="/events"
                    style={{ textDecoration: "none", color: "inherit", display: "block" }}
                  >
                    <div
                      style={{
                        position: "relative",
                        borderRadius: 14,
                        overflow: "hidden",
                        background: `linear-gradient(135deg, rgba(255,252,247,0.97) 0%, ${c0}14 45%, ${c1}0d 100%)`,
                        border: "1px solid rgba(42,26,14,0.08)",
                        boxShadow: "0 4px 24px rgba(42,26,14,0.06), 0 0 0 1px rgba(255,255,255,0.8) inset",
                        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
                      }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 5,
                          background: `linear-gradient(180deg, ${ev.accent} 0%, ${ev.accent}99 100%)`,
                          boxShadow: `inset -1px 0 0 rgba(255,255,255,0.2)`,
                        }}
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(76px, 100px) minmax(0, 1fr) minmax(140px, 180px)",
                          gap: "clamp(1rem, 3vw, 1.75rem)",
                          alignItems: "center",
                          padding: "clamp(1.15rem, 2.5vw, 1.65rem) clamp(1.25rem, 3vw, 2rem) clamp(1.15rem, 2.5vw, 1.65rem) clamp(1.35rem, 3vw, 2rem)",
                          paddingLeft: "calc(1.35rem + 5px)",
                        }}
                      >
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 900, fontSize: "clamp(2.4rem, 5vw, 3.6rem)", color: "#D4943A", lineHeight: 0.95, margin: "0 0 0.2rem" }}>{ev.day}</p>
                          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.22em", color: "#7A5C3A", margin: 0 }}>{ev.monthLabel}</p>
                          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", letterSpacing: "0.14em", color: "rgba(122,92,58,0.65)", margin: "0.35rem 0 0" }}>{ev.time}</p>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span
                            style={{
                              display: "inline-block",
                              fontFamily: "var(--font-dm-mono)",
                              fontSize: "0.48rem",
                              letterSpacing: "0.2em",
                              textTransform: "uppercase",
                              color: ev.accent,
                              border: `1px solid ${ev.accent}44`,
                              background: `${ev.accent}12`,
                              padding: "0.2rem 0.55rem",
                              borderRadius: 2,
                              marginBottom: "0.55rem",
                            }}
                          >
                            {genreLabel[ev.genre]}
                          </span>
                          <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 700, fontSize: "clamp(1.15rem, 2.4vw, 1.65rem)", color: "#2C1A0E", lineHeight: 1.15, margin: "0 0 0.35rem" }}>{ev.title}</p>
                          <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "clamp(0.88rem, 1.6vw, 1rem)", color: "#5C4030", margin: "0 0 0.4rem" }}>{ev.artist}</p>
                          <p style={{ fontFamily: "var(--font-garamond)", fontSize: "0.82rem", color: "#7A5C3A", margin: 0, lineHeight: 1.45 }}>{ev.venue} · {ev.capacity}</p>
                        </div>
                        <div style={{ textAlign: "right", alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.65rem" }}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 8 }}>
                              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.48rem", letterSpacing: "0.14em", color: "#7A5C3A" }}>Capacity</span>
                              <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.1em", color: urgency ? "#C4501A" : "#5C4030", fontWeight: 600 }}>{soldPct}% sold</span>
                            </div>
                            <div style={{ height: 4, borderRadius: 2, background: "rgba(42,26,14,0.08)", overflow: "hidden" }}>
                              <motion.div
                                initial={{ scaleX: 0 }}
                                animate={isInView ? { scaleX: 1 } : {}}
                                transition={{ delay: 0.45 + i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  height: "100%",
                                  width: `${soldPct}%`,
                                  borderRadius: 2,
                                  background: `linear-gradient(90deg, ${ev.accent}99, ${ev.accent})`,
                                  transformOrigin: "left",
                                }}
                              />
                            </div>
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-dm-mono)",
                              fontSize: "0.54rem",
                              letterSpacing: "0.18em",
                              textTransform: "uppercase",
                              color: "#2C1A0E",
                              background: "linear-gradient(180deg, #F5E6C8 0%, #E8C88A 100%)",
                              border: "1px solid rgba(212,148,58,0.45)",
                              padding: "0.5rem 0.95rem",
                              borderRadius: 2,
                              display: "inline-block",
                              alignSelf: "flex-end",
                              boxShadow: "0 6px 18px rgba(212,148,58,0.2)",
                            }}
                          >
                            Book →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65, duration: 0.5 }}
            style={{ marginTop: "clamp(2rem, 4vw, 2.75rem)", textAlign: "center" }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/events"
                style={{
                  fontFamily: "var(--font-dm-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#F4ECDF",
                  textDecoration: "none",
                  background: "linear-gradient(180deg, #C4501A 0%, #9A3A12 100%)",
                  border: "1px solid rgba(154,58,18,0.5)",
                  padding: "0.75rem 1.85rem",
                  display: "inline-block",
                  borderRadius: 2,
                  boxShadow: "0 10px 28px rgba(196,80,26,0.28)",
                }}
              >
                See all upcoming events →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 7 — THE CONVERSATION (botanical closing)
// ══════════════════════════════════════════════════════════════════════════════
function Room7Conversation({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.2 });

  const LINES = [
    { text: "A table is waiting.", delay: 0.5 },
    { text: "A workshop is ready.", delay: 0.62 },
    { text: "Something beautiful is here.", delay: 0.74 },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="conversation"
      style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFE7D8", overflow: "hidden", margin: 0, padding: "clamp(5rem,10vw,8rem) clamp(1.5rem,6vw,5rem)" }}
    >
      {/* Botanical illustrations */}
      <div style={{ position: "absolute", top: "5%", left: "3%", margin: 0 }} aria-hidden="true">
        <BotanicalA opacity={0.06} />
      </div>
      <div style={{ position: "absolute", bottom: "8%", right: "5%", margin: 0, transform: "rotate(180deg)" }} aria-hidden="true">
        <BotanicalA opacity={0.05} />
      </div>
      <div style={{ position: "absolute", top: "40%", right: "2%", margin: 0 }} aria-hidden="true">
        <LeafA opacity={0.05} />
      </div>

      {/* Paper grain */}
      <div style={{ position: "absolute", inset: 0, margin: 0, opacity: 0.04, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "220px", mixBlendMode: "multiply", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 680, width: "100%" }}>
        {/* Top rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{ width: 60, height: 1, background: "rgba(201,169,110,0.4)", margin: "0 auto 2rem", transformOrigin: "center" }}
        />

        {/* Three lines */}
        {LINES.map(({ text, delay }) => (
          <motion.p
            key={text}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, type: "spring", stiffness: 200, damping: 22 }}
            style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,3rem)", color: "#2C1A0E", lineHeight: 1.15, marginBottom: "0.1em" }}
          >
            {text}
          </motion.p>
        ))}

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.3 }}
          style={{ width: 60, height: 1, background: "rgba(201,169,110,0.4)", margin: "1.5rem auto" }}
        />

        {/* "Come find it." */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 0.7, y: 0 } : {}}
          transition={{ delay: 1.1, duration: 0.35 }}
          style={{ fontFamily: "var(--font-lora)", fontSize: "clamp(1rem,1.8vw,1.2rem)", color: "#5A3E28", marginBottom: "2.5rem" }}
        >
          Come find it.
        </motion.p>

        {/* Three buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { href: "/contact", label: "Reserve a Table →",   style: { background: "#2E4B3A", color: "#EFE7D8", border: "none" } },
            { href: "/workshops", label: "Explore Workshops →", style: { background: "transparent", color: "#7A5C3A", border: "1px solid rgba(201,169,110,0.5)" } },
            { href: "/contact", label: "Write to Us →",       style: { background: "transparent", color: "#5C8A3A", border: "1px solid rgba(92,138,58,0.4)" } },
          ].map(({ href, label, style }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 + i * 0.1, type: "spring", stiffness: 240, damping: 22 }}
            >
              <Link href={href} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 48, boxSizing: "border-box", fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", padding: "0.85rem 1.6rem", ...style }}>
                {label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Address */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.45, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.35 }}
          style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "#7A5C3A", marginTop: "3rem" }}
        >
          Everwood · Casablanca Medina · Open daily from 8:00
        </motion.p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOMEPAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [timeOfDay] = useState<TimeOfDay>(() => getTimeOfDay());
  const tod = TOD[timeOfDay];
  const [activeRoom, setActiveRoom] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Section refs for IntersectionObserver
  const sectionRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      setScrollProgress(scrollTop / (scrollHeight - clientHeight));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Room detection
  useEffect(() => {
    const observers = sectionRefs.map((ref, i) => {
      if (!ref.current) return null;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveRoom(i); }, { threshold: 0.35 });
      obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ background: "#0A0A14", overflowX: "hidden", position: "relative" }}>
      {/* Fixed elements */}
      <DeferredPollenTrail />
      <ScrollMeridian activeRoom={activeRoom} progress={scrollProgress} />
      <RoomIndicator activeRoom={activeRoom} refs={sectionRefs} />
      <HomepageNav activeRoom={activeRoom} tod={tod} />

      {/* The Seven Rooms — with gradient blends between jarring dark↔light transitions */}
      <Room0Threshold sectionRef={sectionRefs[0]} />
      <SectionBlend from="#0E1810" to="#EDE4CF" height={120} />
      <Room1Meridian sectionRef={sectionRefs[1]} />
      <Room2Coffee sectionRef={sectionRefs[2]} />
      <SectionBlend from="#F7F0E3" to="#3A2B1A" height={100} />
      <Room3Wall sectionRef={sectionRefs[3]} />
      <Room4Atelier sectionRef={sectionRefs[4]} />
      <Room5Cabinet sectionRef={sectionRefs[5]} />
      <Room6Gathering sectionRef={sectionRefs[6]} />
      <Room7Conversation sectionRef={sectionRefs[7]} />
      <Footer />
    </div>
  );
}

