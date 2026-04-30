"use client";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Play, Bell, Music, ChevronDown, Clock, MapPin, Ticket } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import EventDetailPanel from "@/components/events/EventDetailPanel";
import FeaturedHeroYoutube from "@/components/events/FeaturedHeroYoutube";
import TextSplit from "@/components/effects/TextSplit";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import { events, type Event } from "@/lib/data/events";
import { EV, evR, evMuted, evMuted65, evSoftLine, onBronze, bronzeButtonGlow, washNightToViolet } from "@/lib/events-theme";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const GENRES = ["all", "jazz", "swing", "blues", "special"] as const;
const MONTHS = [
  { value: "all", label: "All Dates" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
] as const;

const HERO_BG_IMAGE = "/images/nav/1event.jpeg";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 5.4) % 88}%`,
  bottom: `${6 + (i * 7.3) % 58}%`,
  size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  dur: 6 + (i * 0.7) % 6,
  delay: (i * 0.38) % 4,
  drift: i % 2 === 0 ? -14 : 10,
}));

export default function EventsPage() {
  const [genre, setGenre] = useState<string>("all");
  const [month, setMonth] = useState<string>("all");
  const [selected, setSelected] = useState<Event | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY        = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentY   = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const filtered = useMemo(
    () => events.filter(e => (genre === "all" || e.genre === genre) && (month === "all" || e.month === month)),
    [genre, month]
  );

  const featured = events.find(e => !e.soldOut && e.genre === "swing");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: EV.bg,
        margin: 0,
        padding: 0,
        ["--ev-footer-bg" as string]: EV.bg,
        ["--ev-footer-hover" as string]: EV.bronze,
        ["--ev-footer-muted" as string]: evR.cream(0.68),
        ["--ev-footer-rule" as string]: evR.bronze(0.22),
        ["--ev-footer-rule-strong" as string]: evR.bronze(0.28),
      }}
    >
      <Navigation />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        aria-labelledby="hero-title"
        style={{
          position: "relative",
          height: "100dvh",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: EV.bg,
          margin: 0,
          padding: 0,
        }}
      >
        {/* Photo + tint — parallax scroll */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            pointerEvents: "none",
            y: prefersReducedMotion ? 0 : bgY,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-12%",
              margin: 0,
              backgroundImage: `url(${HERO_BG_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* readability — dark veil over busy venue photography */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: 0,
              background: `linear-gradient(180deg, rgba(15,17,21,0.78) 0%, rgba(15,17,21,0.42) 42%, rgba(15,17,21,0.82) 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              margin: 0,
              background: washNightToViolet,
              opacity: 0.35,
            }}
          />
          <div style={{ position:"absolute", inset:0, margin:0, background:`radial-gradient(ellipse 80% 65% at 18% 58%, ${evR.burgundy(0.16)}, transparent 65%)` }} />
          <div style={{ position:"absolute", inset:0, margin:0, background:`radial-gradient(ellipse 55% 70% at 88% 18%, ${evR.violet(0.22)}, transparent 55%)` }} />
          <div style={{ position:"absolute", inset:0, margin:0, background:`radial-gradient(ellipse 60% 45% at 52% 100%, ${evR.bronze(0.06)}, transparent 58%)` }} />
          <div style={{ position:"absolute", inset:0, margin:0, background:`radial-gradient(ellipse 30% 28% at 68% 72%, ${evR.burgundy(0.07)}, transparent 50%)` }} />
        </motion.div>

        {/* grain */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            margin: 0, padding: 0, pointerEvents: "none",
            opacity: 0.032,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />

        {/* particles — decorative, suppressed when reduced-motion is preferred */}
        {!prefersReducedMotion && PARTICLES.map(p => (
          <motion.span key={p.id} aria-hidden="true"
            style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none", margin:0, left:p.left, bottom:p.bottom, width:p.size, height:p.size, background: evR.burgundy(0.55) }}
            animate={{ y:[0,-(48+Math.abs(p.drift)),0], opacity:[.22,.6,.22], x:[0,p.drift*.4,0] }}
            transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:"easeInOut" }} />
        ))}

        {/* hero content */}
        <motion.div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "clamp(4.75rem, 11vh, 6.5rem)",
            paddingBottom: "clamp(3.5rem, 9vh, 5.5rem)",
            y: contentY,
            opacity: heroOpacity,
            margin: 0,
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 pb-4">

            <div className="grid lg:grid-cols-[1fr_minmax(460px,38vw)] xl:grid-cols-[1fr_minmax(520px,34vw)] gap-10 xl:gap-14 items-start">

              {/* ── LEFT ── */}
              <div>
                {/* eyebrow — line draws in, then text slides */}
                <div className="flex items-center gap-3 mb-6">
                  <motion.span
                    initial={{ scaleX:0, opacity:0 }}
                    animate={{ scaleX:1, opacity:1 }}
                    transition={{ duration:.55, ease:[.16,1,.3,1], delay:.1 }}
                    style={{ width:40, height:1, background: EV.burgundy, flexShrink:0, display:"inline-block", transformOrigin:"left center" }} />
                  <motion.span
                    initial={{ opacity:0, x:-14 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ duration:.6, ease:[.16,1,.3,1], delay:.22 }}
                    style={{ fontSize:".68rem", letterSpacing:".32em", textTransform:"uppercase", fontWeight:500, color: evMuted65 }}>
                    Season 2026 · Now Booking
                  </motion.span>
                </div>

                {/* title */}
                <div className="mb-6">
                  <TextSplit text="Where Music" as="h1" delay={.3} stagger={.1}
                    style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(3rem,6.8vw,5.85rem)", color: EV.cream, lineHeight:1, display:"block", marginBottom:".05em" }} />
                  <motion.span
                    initial={{ opacity:0, y:64, rotate:4, filter:"blur(10px)" }}
                    animate={{ opacity:1, y:0, rotate:0, filter:"blur(0px)" }}
                    transition={{ duration:1.1, ease:[.34,1.56,.64,1], delay:.85 }}
                    style={{ display:"block", fontFamily:"var(--font-playfair)", fontSize:"clamp(3rem,6.8vw,5.85rem)", fontStyle:"italic", color: EV.cream, lineHeight:1, opacity: 0.92 }}>
                    Comes Alive.
                  </motion.span>
                </div>

                {/* description */}
                <RevealOnScroll delay={.85} y={16}>
                  <p style={{ fontFamily:"var(--font-garamond)", fontSize:"clamp(1.02rem,1.55vw,1.18rem)", color: evMuted65, maxWidth:"44ch", lineHeight:1.75, marginBottom:"0.85rem" }}>
                    Enjoy our live sessions and revisit unforgettable performances from the artists who shaped music as we know it. Whether you&apos;re here to discover something new or reconnect with sounds you already love, take your time, and let each sound deliver its message.
                  </p>
                </RevealOnScroll>

                {/* CTAs */}
                <RevealOnScroll delay={1.05} y={12}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"1.1rem", marginBottom:"0.85rem" }}>
                    <motion.a href="#lineup"
                      style={{
                        display:"inline-flex", alignItems:"center", gap:11,
                        background: EV.bronze, color: onBronze, padding:"1rem 1.95rem",
                        fontSize:".76rem", letterSpacing:".15em", textTransform:"uppercase", fontWeight:600,
                        textDecoration:"none", borderRadius:9999,
                        boxShadow: `inset 0 1px 0 ${evR.cream(0.22)}`,
                      }}
                      whileHover={{ scale:1.03, boxShadow: bronzeButtonGlow }}
                      whileTap={{ scale:.97 }}
                      transition={{ type:"spring", stiffness:400, damping:20 }}>
                      <Play size={14} strokeWidth={2.5} />Browse Events
                    </motion.a>
                    <motion.a href="/contact"
                      style={{
                        display:"inline-flex", alignItems:"center", gap:11,
                        border:`1px solid ${evR.burgundy(0.45)}`, color: EV.cream,
                        padding:"1rem 1.95rem", fontSize:".76rem", letterSpacing:".15em", textTransform:"uppercase",
                        fontWeight:500, textDecoration:"none", borderRadius:9999,
                      }}
                      whileHover={{ scale:1.03, borderColor: EV.bronze, color: EV.bronze, backgroundColor: evR.bronze(0.06) }}
                      whileTap={{ scale:.97 }}
                      transition={{ type:"spring", stiffness:400, damping:20 }}>
                      <Bell size={14} strokeWidth={2} />Get Notified
                    </motion.a>
                  </div>
                </RevealOnScroll>

                {/* stats */}
                <RevealOnScroll delay={1.2} y={10}>
                  <div style={{ display:"flex", gap:"2.35rem", paddingTop:"1.15rem", borderTop:`1px solid ${evR.burgundy(0.35)}` }}>
                    {[{ num:"6+", label:"Events this season" }, { num:"3", label:"Unique spaces" }, { num:"280", label:"Max capacity" }].map(({ num, label }) => (
                      <div key={label}>
                        <span style={{ display:"block", fontFamily:"var(--font-playfair)", fontSize:"1.72rem", color: EV.cream, lineHeight:1 }}>{num}</span>
                        <span style={{ display:"block", fontSize:".62rem", letterSpacing:".11em", textTransform:"uppercase", color: evMuted, marginTop:5 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </RevealOnScroll>
              </div>

              {/* ── RIGHT: featured card ── */}
              {featured && (
                <RevealOnScroll delay={.55} y={24} className="hidden lg:block">
                  <motion.div
                    className="relative cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${featured.title} — featured event`}
                    whileHover="hover"
                    onClick={() => setSelected(featured)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelected(featured); } }}
                  >
                    {/* glow halo — soft merge with hero */}
                    <motion.div className="absolute -inset-px pointer-events-none rounded-lg" variants={{ hover:{ opacity:1 }, idle:{ opacity:0 } }} initial="idle"
                      style={{ background:`radial-gradient(ellipse at 50% 0%, ${evR.cream(0.14)}, transparent 70%)`, boxShadow:`0 12px 48px rgba(15,17,21,0.45)` }} />

                    <div
                      style={{
                        position: "relative",
                        background: evR.violet(0.26),
                        backdropFilter: "blur(22px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(22px) saturate(1.2)",
                        border: `1px solid ${evR.cream(0.16)}`,
                        overflow: "hidden",
                        borderRadius: 12,
                        boxShadow: `inset 0 1px 0 ${evR.cream(0.08)}`,
                      }}
                    >
                      {/* top bar */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".8rem 1.1rem .4rem" }}>
                        <span style={{ fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", fontWeight:500, color: evMuted65 }}>Featured Tonight</span>
                        <motion.div style={{ display:"flex", alignItems:"center", gap:6, fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase", color: evMuted }}
                          variants={{ hover:{ color: EV.bronze } }}>
                          <Ticket size={10} />View tickets
                        </motion.div>
                      </div>

                      {/* poster — 16:9 clip; FeaturedHeroYoutube = start @ 0s, tab-aware mute/unmute */}
                      <div
                        style={{
                          position: "relative",
                          margin: "0 0.5rem",
                          aspectRatio: "16 / 9",
                          overflow: "hidden",
                          borderRadius: 10,
                          background: EV.bg,
                          isolation: "isolate",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            overflow: "hidden",
                          }}
                        >
                          <FeaturedHeroYoutube />
                        </div>
                        <div
                          aria-hidden
                          style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 2,
                            pointerEvents: "none",
                            background: `linear-gradient(180deg, rgba(15,17,21,0.28) 0%, transparent 28%, transparent 72%, rgba(15,17,21,0.38) 100%)`,
                          }}
                        />
                        <div style={{
                          position:"absolute", top:10, left:10, zIndex: 3,
                          borderLeft:`3px solid ${EV.burgundy}`,
                          background:`rgba(15,17,21,0.72)`, backdropFilter:"blur(6px)",
                          color: EV.cream, padding:"4px 10px", fontSize:".55rem", letterSpacing:".15em",
                          textTransform:"uppercase", borderRadius:2,
                        }}>
                          {featured.genre}
                        </div>
                      </div>

                      {/* body */}
                      <div style={{ padding:".8rem 1.1rem 1rem" }}>
                        <h3 style={{ fontFamily:"var(--font-playfair)", fontSize:"1.22rem", color: EV.cream, lineHeight:1.15, marginBottom:".15rem" }}>{featured.title}</h3>
                        <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", color: evMuted65, fontSize:".92rem", marginBottom:".65rem" }}>{featured.artist}</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:".75rem" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:".7rem", color: evMuted }}><Clock size={11} color={EV.burgundy} />{featured.time} · Doors {featured.doors}</span>
                          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:".7rem", color: evMuted }}><MapPin size={11} color={EV.burgundy} />{featured.venue} · {featured.capacity}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                          <div>
                            <span style={{ display:"block", fontSize:".56rem", letterSpacing:".12em", textTransform:"uppercase", color: evMuted, marginBottom:2 }}>From</span>
                            <span style={{ fontFamily:"var(--font-playfair)", fontSize:"1.35rem", color: EV.cream }}>{formatPrice(Math.min(...featured.tiers.map(t=>t.price)))}</span>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <span style={{ display:"block", fontSize:".56rem", letterSpacing:".12em", textTransform:"uppercase", color: evMuted, marginBottom:4 }}>Availability</span>
                            <div style={{ width:72, height:3, background: evR.cream(0.12), borderRadius:2, overflow:"hidden" }}>
                              <motion.div style={{ height:"100%", background: EV.bronze, borderRadius:2 }}
                                initial={{ width:0 }} animate={{ width:`${featured.availability}%` }} transition={{ duration:1.2, ease:"easeOut", delay:.8 }} />
                            </div>
                            <span style={{ fontSize:".56rem", color: evMuted, display:"block", marginTop:3 }}>{featured.availability}% sold</span>
                          </div>
                        </div>
                      </div>

                      {/* hover shimmer */}
                      <motion.div
                        aria-hidden="true"
                        variants={{ hover:{ opacity:1 }, idle:{ opacity:0 } }} initial="idle"
                        style={{
                          position: "absolute", top:0, left:0, right:0, bottom:0, margin:0,
                          pointerEvents:"none",
                          background:`linear-gradient(135deg, ${evR.cream(0.1)}, transparent)`,
                        }} />
                    </div>
                  </motion.div>
                </RevealOnScroll>
              )}
            </div>
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.button
          aria-label="Scroll to lineup"
          onClick={() => document.getElementById("lineup")?.scrollIntoView({ behavior: "smooth" })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.8 }}
          style={{
            position: "absolute", bottom: "2rem",
            left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
            background: "transparent", border: "none", cursor: "pointer", padding: 0,
            opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) as any,
          }}
        >
          {/* animated vertical line with traveling dot */}
          <div style={{ position: "relative", width: 1, height: 48, background: evR.burgundy(0.35) }}>
            {!prefersReducedMotion && (
              <motion.div
                style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)",
                  width: 3, height: 3, borderRadius: "50%",
                  background: EV.burgundy,
                  top: 0,
                }}
                animate={{ top: [0, 44, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>

          {/* label */}
          <span style={{
            fontSize: ".58rem", letterSpacing: ".32em", textTransform: "uppercase",
            color: evMuted65, fontFamily: "var(--font-grotesk)",
          }}>
            Scroll
          </span>

          {/* double chevron */}
          <motion.div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: -6 }}
            animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={13} strokeWidth={1.5} style={{ color: evMuted65, marginBottom: -6 }} />
            <ChevronDown size={13} strokeWidth={1.5} style={{ color: evMuted }} />
          </motion.div>
        </motion.button>
      </section>

      {/* breathing room — separates hero from filter bar */}
      <div aria-hidden="true" style={{ height:"2rem", background: EV.bg }} />

      {/* ══════════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════════ */}
      <div id="lineup" className="sticky top-[172px] z-40"
        style={{ background:`color-mix(in srgb, ${EV.bg} 92%, transparent)`, backdropFilter:"blur(20px) saturate(1.35)", borderBottom:`1px solid ${evSoftLine}` }}>
        <div className="w-full py-3.5 flex flex-col items-center gap-2.5">
          {/* pills row — centered */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* genre pills */}
            <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Filter by genre">
              {GENRES.map(g => (
                <motion.button key={g} type="button" onClick={() => setGenre(g)}
                  aria-pressed={genre === g}
                  style={{
                    padding:".36rem 1.1rem", fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase",
                    border:`1px solid ${genre===g ? EV.burgundy : evSoftLine}`, borderRadius:9999, cursor:"pointer", transition:"none",
                    background: genre===g ? evR.burgundy(0.18) : "transparent",
                    color: genre===g ? EV.cream : evMuted,
                  }}
                  whileHover={{ color: genre===g ? EV.cream : EV.bronze, borderColor: genre===g ? EV.burgundy : evR.bronze(0.4), scale:1.03 }}
                  whileTap={{ scale:.94 }}>
                  {g === "all" ? "All" : g}
                </motion.button>
              ))}
            </div>

            {/* divider */}
            <div className="hidden sm:block" style={{ width:2, height:18, background: EV.burgundy, opacity:0.35, flexShrink:0 }} />

            {/* date pills */}
            <div className="flex gap-1.5" role="group" aria-label="Filter by month">
              {MONTHS.map(m => (
                <motion.button key={m.value} type="button" onClick={() => setMonth(m.value)}
                  aria-pressed={month === m.value}
                  style={{
                    padding:".36rem 1.1rem", fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase",
                    border:`1px solid ${month===m.value ? EV.burgundy : evSoftLine}`, borderRadius:9999, cursor:"pointer", transition:"none",
                    background: month===m.value ? evR.burgundy(0.18) : "transparent",
                    color: month===m.value ? EV.cream : evMuted,
                  }}
                  whileHover={{ color: month===m.value ? EV.cream : EV.bronze, borderColor: month===m.value ? EV.burgundy : evR.bronze(0.4), scale:1.03 }}
                  whileTap={{ scale:.94 }}>
                  {m.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* event count — centred below pills */}
          <AnimatePresence mode="wait">
            <motion.span key={filtered.length}
              aria-live="polite"
              aria-atomic="true"
              style={{ fontSize:".58rem", letterSpacing:".14em", color: evR.cream(0.42) }}
              initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }} transition={{ duration:.16 }}>
              {filtered.length} event{filtered.length !== 1 ? "s" : ""} showing
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          LINEUP GRID
      ══════════════════════════════════════════ */}
      <section
        className="relative pt-16 pb-44 flex flex-col items-center overflow-hidden"
        style={{
          paddingLeft: "clamp(1rem, 5vw, 60px)",
          paddingRight: "clamp(1rem, 5vw, 60px)",
          background: washNightToViolet,
        }}
      >
        {/* violet veil behind grid */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[min(520px,55vh)] opacity-[0.35]"
          style={{ background: `radial-gradient(ellipse 90% 80% at 50% 0%, ${evR.violet(0.55)}, transparent 72%)` }} />
        {/* section heading */}
        <RevealOnScroll className="relative z-[1] w-full mb-12">
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", paddingBottom:"1.5rem", borderBottom:`1px solid ${evSoftLine}` }}>
            <div>
              <p style={{ fontSize:".6rem", letterSpacing:".3em", textTransform:"uppercase", color: EV.burgundy, marginBottom:10 }}>Upcoming</p>
              <h2 style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(1.8rem,3.5vw,2.75rem)", color: EV.cream, lineHeight:1 }}>
                This Season&apos;s Lineup
              </h2>
            </div>
            <p className="hidden md:block" style={{ fontFamily:"var(--font-playfair)", fontSize:"4rem", color: evR.cream(0.06), lineHeight:1, letterSpacing:"-.02em" }}>2026</p>
          </div>
        </RevealOnScroll>

        {/* cards — 3-col max */}
        <div className="relative z-[1] w-full">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="py-32 flex flex-col items-center gap-5" style={{ color: evMuted }}>
                <Music size={36} style={{ opacity:.22 }} />
                <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", fontSize:"1.1rem" }}>No events match your current filters.</p>
                <motion.button type="button" onClick={() => { setGenre("all"); setMonth("all"); }}
                  style={{
                    fontSize:".62rem", letterSpacing:".15em", textTransform:"uppercase",
                    border:`1px solid ${evSoftLine}`, borderRadius:9999, padding:".5rem 1.25rem",
                    background:"transparent", color: EV.cream, cursor:"pointer",
                  }}
                  whileHover={{ borderColor: EV.bronze, color: EV.bronze, boxShadow: bronzeButtonGlow }}>
                  Clear filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key={`${genre}-${month}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                style={{ gap:"2.25rem" }}>
                {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} onClick={setSelected} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* breathing room — cards to newsletter */}
      <div aria-hidden="true" style={{ height:"5rem", background: EV.bg }} />

      {/* ══════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════ */}
      <section style={{ background: EV.violet, borderTop:`1px solid ${evR.burgundy(0.35)}`, borderBottom:`1px solid ${evSoftLine}`, boxShadow:`inset 0 1px 0 ${evR.burgundy(0.15)}` }}
        className="flex justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-6xl py-20 grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <RevealOnScroll>
            <p style={{ fontSize:".6rem", letterSpacing:".3em", textTransform:"uppercase", color: EV.burgundy, marginBottom:12 }}>Stay in the loop</p>
            <h2 style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(1.75rem,3vw,2.5rem)", color: EV.cream, lineHeight:1.1, marginBottom:12 }}>
              Never Miss<br />a Note.
            </h2>
            <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", color: evMuted65, fontSize:"1.05rem", maxWidth:"32ch", lineHeight:1.65 }}>
              Early access to tickets, new arrivals in the cabinet, and invitations to private evenings.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={.15}>
            <form className="flex flex-col sm:flex-row"
              onSubmit={e => { e.preventDefault(); toast.success("You're on the list.", { description:"We'll be in touch before doors open." }); }}>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Your email address"
                required
                style={{ flex:1, minWidth:0, background: EV.bg, border:`1px solid ${evSoftLine}`, borderRight:"none", padding:".95rem 1rem", fontSize:".85rem", color: EV.cream, outline:"none" }}
                onFocus={e => (e.currentTarget.style.borderColor = EV.bronze)}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(230,196,154,0.08)")}
              />
              <motion.button type="submit"
                style={{
                  background: EV.bronze, color: onBronze, padding:".95rem 1.4rem",
                  fontSize:".68rem", letterSpacing:".15em", textTransform:"uppercase",
                  fontWeight:600, border:"none", cursor:"pointer", whiteSpace:"nowrap",
                  boxShadow: `inset 0 1px 0 ${evR.cream(0.18)}`,
                }}
                whileHover={{ boxShadow: bronzeButtonGlow, filter: "brightness(1.06)" }}
                whileTap={{ scale:.98 }}>
                Subscribe
              </motion.button>
            </form>
            <p style={{ marginTop:10, fontSize:".6rem", letterSpacing:".06em", color: evR.cream(0.38) }}>No spam. Unsubscribe any time.</p>
          </RevealOnScroll>
        </div>
      </section>

      {/* breathing room before footer */}
      <div aria-hidden="true" style={{ height:"5rem", background: EV.bg }} />

      <Footer />
      <EventDetailPanel event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
