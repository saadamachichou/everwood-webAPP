"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { events } from "@/lib/data/events";
import { workshops } from "@/lib/data/workshops";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

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
      style={{ position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)", zIndex: 300, display: "flex", flexDirection: "column", gap: 8, margin: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Page navigation"
    >
      {ROOMS.map((r, i) => (
        <button
          key={r.id}
          onClick={() => scrollTo(i)}
          aria-label={`Go to ${labels[i]}`}
          style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8,
            background: "transparent", border: "none", cursor: "pointer", padding: 0, margin: 0,
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
          {/* Logo */}
          <Link href="/" aria-label="Everwood — home" style={{ textDecoration: "none", display: "block", lineHeight: 0 }}>
            <img
              src="/images/nav/logo.png"
              alt="Everwood"
              style={{ height: 140, width: "auto", display: "block", opacity: 0.95, transition: "opacity 0.25s ease" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.95")}
            />
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
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem",
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: textColor, textDecoration: "none",
                    opacity: 0.75, transition: "opacity 0.25s ease",
                  }}
                  className="hidden md:flex"
                >
                  <img
                    src={`/images/nav/${slug}.png`}
                    alt=""
                    aria-hidden="true"
                    style={{
                      height: 36,
                      width: "auto",
                      maxWidth: 44,
                      objectFit: "contain",
                      display: "block",
                      // Light bg: multiply blends white away, lines stay sharp
                      // Dark bg: invert to white lines, screen blends black away
                      filter: isLightBg ? "none" : "invert(1) contrast(1.1)",
                      mixBlendMode: isLightBg ? "multiply" : "screen",
                      opacity: isLightBg ? 0.65 : 0.85,
                      transition: "opacity 0.25s ease",
                    }}
                  />
                  {l}
                </Link>
              );
            })}

            <Link href="/login"
              onMouseEnter={e => { e.currentTarget.style.background = "#C9A96E"; e.currentTarget.style.color = "#0E1810"; e.currentTarget.style.borderColor = "#C9A96E"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9A96E"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)"; }}
              style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", textDecoration: "none", border: "1px solid rgba(201,169,110,0.5)", padding: "0.45rem 1rem", borderRadius: 2, transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease" }}
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
function Room0Threshold({ tod, sectionRef }: { tod: typeof TOD[TimeOfDay]; sectionRef: React.RefObject<HTMLElement | null> }) {
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

  const WORDS = [
    { w: "Where",   delay: 0,    y: -55, r: -1.5, s: 180, d: 20 },
    { w: "craft",   delay: 0.12, y: -45, r: 2,    s: 200, d: 18 },
    { w: "meets",   delay: 0.22, y: -38, r: -1,   s: 220, d: 22 },
    { w: "culture", delay: 0.31, y: -65, r: 0.5,  s: 160, d: 18 },
  ];

  const nextEvent = events.find(e => !e.soldOut);

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="threshold"
      style={{ position: "relative", height: "100dvh", overflow: "hidden", margin: 0, padding: 0 }}
    >
      {/* ── Video layer ───────────────────────────────────────────── */}
      <motion.div
        style={{ position: "absolute", inset: 0, margin: 0, opacity: videoOpacity, zIndex: 0 }}
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
        {/* Video — drop hero.mp4 into /public/videos/ */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoReady(true)}
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
        style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(2.5rem, 8vw, 7rem)", paddingTop: "5rem", y: headlineY }}
      >
        {/* Eyebrow */}
        <motion.div
          style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.2rem" }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{ display: "block", width: 48, height: 1, background: "#C9A96E", transformOrigin: "left", flexShrink: 0 }}
          />
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C9A96E" }}>
            Everwood · Casablanca · Est. 2024
          </span>
        </motion.div>

        {/* Headline — always ivory over video, text-shadow for extra clarity */}
        <h1 style={{ display: "flex", flexWrap: "wrap", gap: "0.2em 0.35em", marginBottom: "0.8rem", lineHeight: 0.95, margin: 0 }}>
          {WORDS.map(({ w, delay, y, r, s, d }) => (
            <motion.span
              key={w}
              initial={{ opacity: 0, y, rotate: r }}
              animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ delay, type: "spring", stiffness: s, damping: d }}
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
            </motion.span>
          ))}
          {/* Gold period */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.62, duration: 0.3 }}
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
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          <Link href="/events" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(212,148,58,0.18)",
            border: "1px solid rgba(212,148,58,0.55)",
            color: "#E8C870",
            padding: "0.9rem 2rem",
            fontSize: "0.68rem", letterSpacing: "0.18em",
            textTransform: "uppercase", textDecoration: "none",
            fontFamily: "var(--font-dm-mono)",
            backdropFilter: "blur(6px)",
            fontWeight: 500,
          }}>
            Explore Everwood <ArrowRight size={11} />
          </Link>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: "1px solid rgba(244,241,232,0.28)",
            color: "rgba(244,241,232,0.82)",
            padding: "0.9rem 2rem",
            fontSize: "0.68rem", letterSpacing: "0.18em",
            textTransform: "uppercase", textDecoration: "none",
            fontFamily: "var(--font-dm-mono)",
            backdropFilter: "blur(4px)",
          }}>
            Reserve a Table
          </Link>
        </motion.div>

        {/* Bottom row: next event + clock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3, duration: 0.6 }}
          style={{ position: "absolute", bottom: "2.5rem", left: "clamp(2.5rem,8vw,7rem)", right: "clamp(2.5rem,8vw,7rem)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          {nextEvent && (
            <div style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.15em", color: "rgba(244,241,232,0.50)", lineHeight: 1.6 }}>
              <span style={{ display: "block", color: "rgba(201,169,110,0.7)", marginBottom: 3 }}>NEXT EVENT</span>
              <span style={{ color: "rgba(244,241,232,0.65)" }}>{nextEvent.title}</span>
              <span style={{ opacity: 0.5 }}> · {nextEvent.date} · {nextEvent.venue}</span>
            </div>
          )}
          <LiveClock color="#F4F1E8" />
        </motion.div>
      </motion.div>

      {/* ── Mute / unmute video sound ─────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        onClick={toggleMute}
        aria-label={muted ? "Unmute video" : "Mute video"}
        style={{
          position: "absolute", bottom: "2.5rem", right: "clamp(2.5rem,8vw,7rem)",
          zIndex: 20, display: "flex", alignItems: "center", gap: 7,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(244,241,232,0.18)", borderRadius: "2rem",
          padding: "0.45rem 0.9rem", cursor: "pointer",
          color: "rgba(244,241,232,0.65)",
          fontFamily: "var(--font-dm-mono)", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase",
          margin: 0,
        }}
        whileHover={{ borderColor: "rgba(212,148,58,0.5)", color: "#C9A96E" }}
        whileTap={{ scale: 0.95 }}
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

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 clamp(1.5rem,8vw,6rem)", width: "100%", maxWidth: 780 }}>

        {/* Decorative top ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: "2.2rem" }}
          aria-hidden="true"
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(122,92,58,0.28))", maxWidth: 100 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A96E", flexShrink: 0 }} />
          <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.45)", flexShrink: 0 }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A96E", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(122,92,58,0.28))", maxWidth: 100 }} />
        </motion.div>

        {LINES.map(({ text, delay }, li) => (
          <motion.div
            key={li}
            initial={{ opacity: 0.15 }}
            style={{ opacity: useTransform(light, [delay, delay + 0.35], [0.15, 1]) }}
          >
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(2.2rem,5vw,4rem)", color: "#2C1A0E", lineHeight: 1.15, margin: "0 0 0.1em" }}>
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
          style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#7A5C3A", marginTop: "1.5rem" }}
        >
          — Everwood
        </motion.p>

        {/* Divider with dots */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", margin: "2rem 0" }}
          aria-hidden="true"
        >
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(122,92,58,0.2))", maxWidth: 80 }} />
          {[0,1,2].map(i => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(122,92,58,0.35)" }} />)}
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(122,92,58,0.2))", maxWidth: 80 }} />
        </motion.div>

        {/* Ambient facts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 0.9, duration: 0.5, type: "spring", stiffness: 180, damping: 22 }}
          style={{ display: "flex", justifyContent: "center", gap: "clamp(2.5rem,7vw,6rem)", alignItems: "center" }}
        >
          {FACTS.map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 600, fontSize: "clamp(1.6rem,3.5vw,2.6rem)", color: "#C8780A", lineHeight: 1, marginBottom: "0.25rem" }}>{value}</p>
              <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(122,92,58,0.55)" }}>{label}</p>
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

  const CARDS = [
    { title: "Espresso", sub: "Single origin · Yirgacheffe", color: "#2C1A0E", price: "18 MAD", style: { left: "0%", top: 24, rotate: -4, z: 1 } },
    { title: "Saffron Latte", sub: "Today's special · House favourite", color: "#C8780A", price: "45 MAD", style: { left: "25%", top: 0, rotate: 0, z: 2, scale: 1.08 } },
    { title: "Atay bi Nana", sub: "Moroccan Mint Tea · Ritual", color: "#4A6741", price: "20 MAD", style: { right: "-2%", top: 40, rotate: 3, z: 1 } },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="coffee"
      style={{ position: "relative", background: "#F7F0E3", overflow: "hidden", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,6vw,5rem)", margin: 0 }}
    >
      {/* Lamp glow */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "radial-gradient(ellipse 60% 80% at 20% 0%, rgba(200,120,10,0.08) 0%, transparent 65%)", pointerEvents: "none", margin: 0 }} />

      {/* "through the door →" annotation */}
      <motion.p
        initial={{ opacity: 0, x: -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontFamily: "var(--font-caveat)", fontSize: "1.1rem", color: "#C8780A", transform: "rotate(-2deg)", marginBottom: "1rem", display: "inline-block" }}
      >
        through the door →
      </motion.p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,4rem)", alignItems: "start", maxWidth: 1100, margin: "0 auto" }}>
        {/* LEFT: scattered illustrated cards */}
        <div>
          <motion.p initial={{ opacity: 0, scaleX: 0 }} animate={isInView ? { opacity: 1, scaleX: 1 } : {}} transition={{ delay: 0.3 }} style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#7A5C3A", marginBottom: "0.5rem", transformOrigin: "left" }}>THE COFFEE ROOM</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5, duration: 0.7, type: "spring", stiffness: 160 }} style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.2rem,4.5vw,3.8rem)", color: "#1A120A", lineHeight: 1.05, marginBottom: "0.2rem" }}>
            A cup for every<br />quiet moment.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} style={{ fontFamily: "var(--font-caveat)", fontSize: "1rem", color: "#C8780A", transform: "rotate(-1.5deg)", display: "inline-block", marginBottom: "2rem" }}>all day, every day</motion.p>

          {/* Card trio */}
          <div style={{ position: "relative", height: 320, marginTop: "1rem" }}>
            {CARDS.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: i === 0 ? -80 : i === 1 ? 0 : 80, y: i === 1 ? -60 : 0 }}
                animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.15, type: "spring", stiffness: 200, damping: 22 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                style={{ position: "absolute", ...c.style, width: 180, zIndex: c.style.z, transform: `rotate(${c.style.rotate}deg) scale(${(c.style as any).scale ?? 1})` }}
              >
                <div style={{ background: "#FFF9F0", border: `1.5px solid ${c.color}22`, borderRadius: 12, padding: "1.2rem", boxShadow: i === 1 ? `0 8px 32px ${c.color}25` : "0 4px 16px rgba(42,26,14,0.1)" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${c.color}18`, border: `1px solid ${c.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.8rem" }}>
                    <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.4rem", color: c.color }}>☕</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontWeight: 600, fontSize: "0.95rem", color: "#1A120A", marginBottom: "0.2rem" }}>{c.title}</p>
                  <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "0.62rem", color: "#7A5C3A", marginBottom: "0.5rem" }}>{c.sub}</p>
                  <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.65rem", color: c.color }}>{c.price}</p>
                  {i === 1 && <div style={{ position: "absolute", inset: -8, borderRadius: 18, background: `radial-gradient(ellipse at center, ${c.color}15 0%, transparent 70%)`, zIndex: -1 }} />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: menu category teaser */}
        <div style={{ paddingTop: "4rem" }}>
          {[
            { label: "Espresso & Beyond", weight: 400, color: "#1A120A" },
            { label: "Teas & Tonics", weight: 400, color: "#1A120A" },
            { label: "Today's Specials", weight: 600, color: "#C8780A" },
          ].map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={isInView ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : {}} transition={{ delay: 1.0 + i * 0.15, duration: 0.4, ease: "easeOut" }}>
              <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: cat.weight, fontSize: "clamp(1.3rem,2.5vw,1.8rem)", color: cat.color, marginBottom: "0.6rem" }}>{cat.label}</p>
              {i < 2 && <div style={{ height: 1, background: `linear-gradient(to right, #7A5C3A40, transparent)`, marginBottom: "0.8rem" }} />}
            </motion.div>
          ))}
          <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.5 }} style={{ fontFamily: "var(--font-caveat)", fontSize: "0.95rem", color: "#B5621E", transform: "rotate(-1deg)", display: "inline-block", marginBottom: "1.5rem" }}>Saffron Latte · Date Latte</motion.p>
          <div><Link href="/menu" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C8780A", textDecoration: "none", border: "1px solid rgba(200,120,10,0.4)", padding: "0.7rem 1.4rem", display: "inline-block" }}>Explore the Menu →</Link></div>
        </div>
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

  const PANELS = [
    { category: "Nature & Earth",             workshops: 6, color: "#4A6741" },
    { category: "Light & Wonder",             workshops: 5, color: "#D4820A" },
    { category: "Imagination & Expression",   workshops: 5, color: "#6B4C8A" },
    { category: "Making & Craft",             workshops: 4, color: "#C4501A" },
  ];

  const ROWS = 8;
  const BRICKS_PER_ROW = 12;

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="wall"
      style={{ position: "relative", overflow: "hidden", margin: 0, padding: 0 }}
    >
      {/* Brick section */}
      <div style={{ background: "#3A2B1A", padding: "2.5rem 0 0", position: "relative" }}>
        {Array.from({ length: ROWS }).map((_, row) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: row * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", gap: 3, marginBottom: 3, paddingLeft: row % 2 === 0 ? 0 : 28 }}
          >
            {Array.from({ length: BRICKS_PER_ROW }).map((_, b) => (
              <div key={b} style={{ flex: b === 0 || b === BRICKS_PER_ROW - 1 ? "0 0 28px" : "1", height: 22, background: `hsl(${22 + (row * 7 + b * 3) % 12}, ${25 + (b * 3) % 15}%, ${20 + (row + b) % 8}%)`, borderRadius: 1 }} />
            ))}
          </motion.div>
        ))}

        {/* Glass window strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ display: "flex", borderTop: "3px solid #5A4030", borderBottom: "3px solid #5A4030", background: "#2A1F12" }}
        >
          {PANELS.map((panel, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredPanel(i)}
              onMouseLeave={() => setHoveredPanel(null)}
              style={{ flex: 1, height: 140, position: "relative", borderRight: i < 3 ? "3px solid #5A4030" : "none", cursor: "pointer", overflow: "hidden" }}
            >
              {/* Blurred workshop background */}
              <div style={{ position: "absolute", inset: 0, margin: 0, background: `radial-gradient(ellipse at center, ${panel.color}25, ${panel.color}08)`, filter: hoveredPanel === i ? "blur(0px)" : "blur(4px)", transition: "filter 0.3s ease" }} />
              {/* Window frame glare */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(255,255,255,0.15)" }} />
              {/* Glass tint */}
              <div style={{ position: "absolute", inset: 0, margin: 0, background: "rgba(30,50,40,0.55)", backdropFilter: "blur(2px)" }} />
              {/* Panel content */}
              <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0.8rem" }}>
                <AnimatePresence>
                  {hoveredPanel === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      style={{ textAlign: "center" }}
                    >
                      <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", color: panel.color, marginBottom: 4 }}>{panel.category}</p>
                      <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", color: "rgba(237,232,218,0.5)", letterSpacing: "0.1em" }}>{panel.workshops} workshops</p>
                    </motion.div>
                  )}
                  {hoveredPanel !== i && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }} style={{ width: 20, height: 20, borderRadius: "50%", background: panel.color }} />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom brick rows */}
        <div style={{ padding: "0 0 1rem" }}>
          {Array.from({ length: 4 }).map((_, row) => (
            <motion.div
              key={`b${row}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 + row * 0.04 }}
              style={{ display: "flex", gap: 3, marginBottom: 3, paddingLeft: row % 2 === 0 ? 0 : 28 }}
            >
              {Array.from({ length: BRICKS_PER_ROW }).map((_, b) => (
                <div key={b} style={{ flex: b === 0 || b === BRICKS_PER_ROW - 1 ? "0 0 28px" : "1", height: 22, background: `hsl(${22 + (row * 7 + b * 3) % 12}, ${25 + (b * 3) % 15}%, ${20 + (row + b) % 8}%)`, borderRadius: 1 }} />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#2A1F12", padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,169,110,0.6)" }}>THE ATELIER</span>
        <Link href="/workshops" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#C9A96E", textDecoration: "none", border: "1px solid rgba(201,169,110,0.4)", padding: "0.6rem 1.4rem" }}>
          Discover All Workshops →
        </Link>
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
  const [paused, setPaused] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(stackWorkshops[0]?.title ?? "");
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: false, amount: 0.3 });

  useEffect(() => {
    if (!isInView || paused || stackWorkshops.length === 0) return;
    const id = setInterval(() => {
      setTopIndex(prev => {
        const next = (prev + 1) % stackWorkshops.length;
        setCurrentLabel(stackWorkshops[next]?.title ?? "");
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [isInView, paused, stackWorkshops]);

  const activeWorkshop = stackWorkshops[topIndex];

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

      <div style={{ display: "grid", gridTemplateColumns: "55fr 45fr", gap: "clamp(2rem,4vw,4rem)", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        {/* LEFT: content panel */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#D4820A", marginBottom: "0.3rem" }}>THE ATELIER</p>
            <AnimatePresence mode="wait">
              <motion.p key={currentLabel} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(237,232,218,0.4)", marginBottom: "1rem" }}>
                CURRENTLY SHOWING — {currentLabel}
              </motion.p>
            </AnimatePresence>
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.5rem,5vw,4rem)", color: "#EDE8DA", lineHeight: 1.0, marginBottom: "1rem" }}>
            Make something<br />with your hands.
          </h2>
          <p style={{ fontFamily: "var(--font-lora)", fontSize: "clamp(0.9rem,1.6vw,1rem)", color: "rgba(237,232,218,0.6)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "45ch" }}>
            Twenty workshops. Every material imaginable. A table, a teacher, and two hours of making something real.
          </p>

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {[
              { label: "Nature & Earth", color: "#4A6741" },
              { label: "Light & Wonder", color: "#D4820A" },
              { label: "Imagination",    color: "#6B4C8A" },
              { label: "Making & Craft", color: "#C4501A" },
            ].map(({ label, color }) => (
              <button key={label} style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color, background: `${color}18`, border: `1px solid ${color}44`, padding: "0.35rem 0.9rem", cursor: "pointer", borderRadius: 2 }}>
                {label}
              </button>
            ))}
          </div>
          <Link href="/workshops" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4820A", textDecoration: "none", border: "1px solid rgba(212,130,10,0.4)", padding: "0.7rem 1.4rem", display: "inline-block" }}>
            Browse All 20 Workshops →
          </Link>
        </div>

        {/* RIGHT: workshop stack */}
        <div style={{ position: "relative", height: 440 }} onClick={() => setPaused(!paused)}>
          <AnimatePresence>
            {stackWorkshops.map((w, i) => {
              const offset = (i - topIndex + stackWorkshops.length) % stackWorkshops.length;
              if (offset > 2) return null;
              const isTop = offset === 0;
              return (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ x: 80, opacity: 0, rotate: 8 }}
                  animate={{ x: offset * 8, y: offset * 10, rotate: offset === 0 ? -1 : offset === 1 ? 2 : -2, zIndex: 10 - offset, opacity: 1, scale: 1 - offset * 0.03 }}
                  exit={{ x: 160, opacity: 0, rotate: 14 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{ position: "absolute", inset: 0, cursor: "pointer" }}
                >
                  <div style={{ position: "relative", width: "100%", height: "100%", background: w.gradient, borderRadius: 16, overflow: "hidden", boxShadow: isTop ? "0 24px 64px rgba(0,0,0,0.6)" : "0 8px 24px rgba(0,0,0,0.4)" }}>
                    {/* gradient bg */}
                    <div style={{ position: "absolute", inset: 0, margin: 0, background: w.gradient }} />
                    {/* content */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.5rem", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                      <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: w.accentColor, marginBottom: "0.3rem" }}>{w.category.replace(/-/g, " & ")}</p>
                      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: "#EDE8DA", lineHeight: 1.1, marginBottom: "0.3rem" }}>{w.title}</p>
                      <p style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", fontSize: "0.78rem", color: "rgba(237,232,218,0.65)", marginBottom: "0.8rem" }}>{w.tagline}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", color: "rgba(237,232,218,0.45)", letterSpacing: "0.1em" }}>{w.duration} · {w.groupSize} people</span>
                        <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.7rem", color: "#C9A96E" }}>From {w.price} {w.currency}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <p style={{ position: "absolute", bottom: -28, right: 0, fontFamily: "var(--font-dm-mono)", fontSize: "0.54rem", color: "rgba(237,232,218,0.3)", letterSpacing: "0.12em" }}>{paused ? "CLICK TO RESUME" : "CLICK TO PAUSE"}</p>
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
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ["start end", "end start"] });
  const stripY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const OBJECTS = [
    { name: "Brass Compass", desc: "Objects with lives longer than ours.", bg: "radial-gradient(ellipse at 40% 30%, #4A2A0A, #2D0A14)" },
    { name: "Ceramic Pitcher", desc: "Objects with lives longer than ours.", bg: "radial-gradient(ellipse at 60% 60%, #3A1A28, #2D0A14)" },
    { name: "Leather-Bound Journal", desc: "Objects with lives longer than ours.", bg: "radial-gradient(ellipse at 50% 20%, #4A3010, #2D0A14)" },
  ];
  // Use index 0 for SSR; randomise after hydration to avoid mismatch
  const [objIndex, setObjIndex] = useState(0);
  useEffect(() => { setObjIndex(Math.floor(Math.random() * OBJECTS.length)); }, []);
  const obj = OBJECTS[objIndex];

  const GALLERY = [
    { color: "#3A2A1E", aspect: "56.25%" },
    { color: "#2A3A28", aspect: "75%" },
    { color: "#2A1E3A", aspect: "100%" },
  ];

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLElement>}
      id="cabinet"
      style={{ position: "relative", display: "flex", height: "80vh", overflow: "hidden", margin: 0 }}
    >
      {/* LEFT: Antiques */}
      <motion.div
        initial={{ background: "#1A1218" }}
        animate={isInView ? { background: "#2D0A14" } : {}}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ flex: 1, position: "relative", overflow: "hidden", clipPath: "polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%)" }}
      >
        {/* Spotlight */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeIn" }}
          style={{ position: "absolute", inset: 0, margin: 0, background: `${obj.bg}, radial-gradient(ellipse 50% 60% at 50% 20%, rgba(183,144,79,0.20) 0%, transparent 60%)`, transformOrigin: "center 20%" }}
        />
        {/* Vignette */}
        <div style={{ position: "absolute", inset: 0, margin: 0, background: "radial-gradient(ellipse 70% 80% at 50% 50%, transparent 30%, rgba(45,10,20,0.85) 100%)" }} />

        {/* Object SVG placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ rotate: 1.5, scale: 1.04 }}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}
        >
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "rgba(183,144,79,0.12)", border: "1px solid rgba(183,144,79,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <span style={{ fontSize: "3.5rem" }}>⊙</span>
          </div>
        </motion.div>

        {/* Text */}
        <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.54rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,169,110,0.5)" }}>CURATED ANTIQUES</p>
        </div>
        <div style={{ position: "absolute", bottom: "2rem", left: "1.5rem", maxWidth: 220 }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(1.2rem,2.5vw,1.6rem)", color: "rgba(239,231,216,0.75)", lineHeight: 1.2, marginBottom: "0.6rem" }}>Objects with lives<br />longer than ours.</p>
          <Link href="/antiques" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.7)", textDecoration: "none" }}>Explore the Collection →</Link>
        </div>
      </motion.div>

      {/* Diagonal divider */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: 2, zIndex: 10, margin: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(201,169,110,0.6) 30%, rgba(201,169,110,0.6) 70%, transparent)", filter: "blur(1px)" }} />
        {/* Brass ring ornament */}
        <motion.div
          animate={{ rotate: [2, -2, 2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(201,169,110,0.6)" }}
        />
      </div>

      {/* RIGHT: Gallery strip */}
      <motion.div
        initial={{ background: "#111218" }}
        animate={isInView ? { background: "#141E29" } : {}}
        transition={{ delay: 0.2, duration: 0.4 }}
        style={{ flex: 1, position: "relative", overflow: "hidden", clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        {/* GALLERY label rotated */}
        <div style={{ position: "absolute", top: "50%", left: "1.5rem", transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "center", zIndex: 5 }}>
          <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(201,169,110,0.4)" }}>GALLERY</p>
        </div>

        {/* Film strip */}
        <motion.div
          style={{ position: "absolute", top: 0, left: "12%", right: 0, y: stripY, display: "flex", flexDirection: "column", gap: 3 }}
        >
          {GALLERY.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.15 }}
              whileHover={{ filter: "saturate(1.0)", boxShadow: "inset 0 0 0 2px rgba(201,169,110,0.4)" }}
              style={{ paddingBottom: g.aspect, position: "relative", background: g.color, filter: "saturate(0.5) contrast(1.1)", transition: "filter 0.25s" }}
            >
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,169,110,0.08) 0%, transparent 70%)" }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Link */}
        <div style={{ position: "absolute", bottom: "2rem", right: "1.5rem" }}>
          <Link href="/gallery" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.7)", textDecoration: "none" }}>View the Gallery →</Link>
        </div>
      </motion.div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOM 6 — THE GATHERING (events + story)
// ══════════════════════════════════════════════════════════════════════════════
function Room6Gathering({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const isInView = useInView(sectionRef as React.RefObject<Element>, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({ target: sectionRef as React.RefObject<HTMLElement>, offset: ["start end", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const upcomingEvents = events.filter(e => !e.soldOut).slice(0, 3);

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

      {/* Date event rows */}
      <div style={{ padding: "clamp(2.5rem,5vw,4rem) clamp(1.5rem,6vw,5rem)" }}>
        <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#B5621E", marginBottom: "2rem" }}>UPCOMING EVENTS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {upcomingEvents.map((ev, i) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200, damping: 24 }}
              whileHover="hover"
              style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", gap: "2rem", alignItems: "center", padding: "1.25rem 0", borderBottom: "1px solid rgba(42,26,14,0.08)", cursor: "pointer", position: "relative" }}
            >
              {/* Left: date */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.12, duration: 0.45, type: "spring", stiffness: 260, damping: 22 }}
                  style={{ fontFamily: "var(--font-cormorant)", fontWeight: 900, fontSize: "clamp(2.8rem,5vw,4rem)", color: "#D4943A", lineHeight: 1 }}
                >
                  {ev.day}
                </motion.p>
                <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.52rem", letterSpacing: "0.2em", color: "#7A5C3A" }}>{ev.monthLabel} · {ev.time.split(":")[0].padStart(2, "0")}</p>
              </div>
              {/* Center: event info */}
              <div>
                <p style={{ fontFamily: "var(--font-cormorant)", fontWeight: 700, fontSize: "clamp(1.1rem,2.5vw,1.5rem)", color: "#2C1A0E", lineHeight: 1.1, marginBottom: "0.25rem" }}>{ev.title}</p>
                <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", fontSize: "0.88rem", color: "#7A5C3A", marginBottom: "0.3rem" }}>{ev.artist}</p>
                <p style={{ fontFamily: "var(--font-garamond)", fontSize: "0.8rem", color: "#7A5C3A" }}>{ev.venue} · {ev.capacity}</p>
              </div>
              {/* Right: availability + CTA */}
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.12em", color: ev.availability > 80 ? "#C4501A" : "#7A5C3A", marginBottom: "0.4rem" }}>{ev.availability}% sold</p>
                <motion.div
                  variants={{ hover: { x: 0, opacity: 1 }, initial: { x: 20, opacity: 0 } }}
                  initial="initial"
                  style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4943A", border: "1px solid rgba(212,148,58,0.4)", padding: "0.3rem 0.8rem", display: "inline-block" }}
                >
                  Book →
                </motion.div>
                {/* Left border on hover */}
                <motion.div variants={{ hover: { scaleY: 1 }, initial: { scaleY: 0 } }} initial="initial" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "#D4943A", transformOrigin: "top" }} />
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <Link href="/events" style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#B5621E", textDecoration: "none" }}>See All Upcoming Events →</Link>
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
              <Link href={href} style={{ display: "inline-block", fontFamily: "var(--font-dm-mono)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", padding: "0.85rem 1.6rem", ...style }}>
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
      <PollenTrail />
      <ScrollMeridian activeRoom={activeRoom} progress={scrollProgress} />
      <RoomIndicator activeRoom={activeRoom} refs={sectionRefs} />
      <HomepageNav activeRoom={activeRoom} tod={tod} />

      {/* The Seven Rooms — with gradient blends between jarring dark↔light transitions */}
      <Room0Threshold tod={tod} sectionRef={sectionRefs[0]} />
      <SectionBlend from="#0E1810" to="#EDE4CF" height={120} />
      <Room1Meridian sectionRef={sectionRefs[1]} />
      <Room2Coffee sectionRef={sectionRefs[2]} />
      <SectionBlend from="#F7F0E3" to="#3A2B1A" height={100} />
      <Room3Wall sectionRef={sectionRefs[3]} />
      <Room4Atelier sectionRef={sectionRefs[4]} />
      <Room5Cabinet sectionRef={sectionRefs[5]} />
      <SectionBlend from="#2D0A14" to="#F4ECDF" height={140} />
      <Room6Gathering sectionRef={sectionRefs[6]} />
      <Room7Conversation sectionRef={sectionRefs[7]} />
    </div>
  );
}
