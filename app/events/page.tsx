"use client";
import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Play, Bell, Music, ChevronDown, Clock, MapPin, Ticket } from "lucide-react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import EventCard from "@/components/events/EventCard";
import EventDetailPanel from "@/components/events/EventDetailPanel";
import TextSplit from "@/components/effects/TextSplit";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import { events, type Event } from "@/lib/data/events";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const GENRES = ["all", "jazz", "swing", "blues", "special"] as const;
const MONTHS = [
  { value: "all", label: "All Dates" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
] as const;

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
    <div style={{ minHeight: "100vh", background: "#0F1115", margin: 0, padding: 0 }}>
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
          background: "#0F1115",
          margin: 0,
          padding: 0,
        }}
      >

        {/* parallax bg */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            margin: 0, padding: 0, pointerEvents: "none",
            y: bgY,
          }}
        >
          <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, margin:0, background:"radial-gradient(ellipse 80% 65% at 18% 58%, rgba(107,30,47,.38), transparent 65%)" }} />
          <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, margin:0, background:"radial-gradient(ellipse 55% 70% at 88% 18%, rgba(58,43,68,.28), transparent 55%)" }} />
          <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, margin:0, background:"radial-gradient(ellipse 60% 45% at 52% 100%, rgba(212,148,58,.2), transparent 58%)" }} />
          <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, margin:0, background:"radial-gradient(ellipse 30% 28% at 68% 72%, rgba(107,30,47,.14), transparent 50%)" }} />
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
            style={{ position:"absolute", borderRadius:"50%", pointerEvents:"none", margin:0, left:p.left, bottom:p.bottom, width:p.size, height:p.size, background:"#D4943A" }}
            animate={{ y:[0,-(48+Math.abs(p.drift)),0], opacity:[.22,.6,.22], x:[0,p.drift*.4,0] }}
            transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:"easeInOut" }} />
        ))}

        {/* hero content */}
        <motion.div
          style={{
            position: "relative", flex: 1,
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            paddingTop: "178px",
            y: contentY, opacity: heroOpacity,
            margin: 0,
          }}
        >
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-6">

            <div className="grid lg:grid-cols-[1fr_380px] gap-10 xl:gap-14 items-start">

              {/* ── LEFT ── */}
              <div>
                {/* eyebrow — line draws in, then text slides */}
                <div className="flex items-center gap-3 mb-5">
                  <motion.span
                    initial={{ scaleX:0, opacity:0 }}
                    animate={{ scaleX:1, opacity:1 }}
                    transition={{ duration:.55, ease:[.16,1,.3,1], delay:.1 }}
                    style={{ width:32, height:1, background:"#D4943A", flexShrink:0, display:"inline-block", transformOrigin:"left center" }} />
                  <motion.span
                    initial={{ opacity:0, x:-14 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ duration:.6, ease:[.16,1,.3,1], delay:.22 }}
                    style={{ fontSize:".62rem", letterSpacing:".3em", textTransform:"uppercase", fontWeight:500, color:"#D4943A" }}>
                    Season 2026 · Now Booking
                  </motion.span>
                </div>

                {/* title */}
                <div className="mb-5">
                  <TextSplit text="Where Music" as="h1" delay={.3} stagger={.1}
                    style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(2.6rem,6vw,5.2rem)", color:"#F2E8D8", lineHeight:1, display:"block", marginBottom:".05em" }} />
                  <motion.span
                    initial={{ opacity:0, y:64, rotate:4, filter:"blur(10px)" }}
                    animate={{ opacity:1, y:0, rotate:0, filter:"blur(0px)" }}
                    transition={{ duration:1.1, ease:[.34,1.56,.64,1], delay:.85 }}
                    style={{ display:"block", fontFamily:"var(--font-playfair)", fontSize:"clamp(2.6rem,6vw,5.2rem)", fontStyle:"italic", color:"#D4943A", lineHeight:1 }}>
                    Comes Alive.
                  </motion.span>
                </div>

                {/* description */}
                <RevealOnScroll delay={.85} y={16}>
                  <p style={{ fontFamily:"var(--font-garamond)", fontSize:"clamp(.95rem,1.4vw,1.05rem)", color:"#8A7E72", maxWidth:"40ch", lineHeight:1.7, marginBottom:"0.75rem" }}>
                    Jazz, swing, blues, and the unexpected — curated inside a 16th‑century riad in the heart of Casablanca&apos;s medina.
                  </p>
                </RevealOnScroll>

                {/* CTAs */}
                <RevealOnScroll delay={1.05} y={12}>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", marginBottom:"0.75rem" }}>
                    <motion.a href="#lineup"
                      style={{ display:"inline-flex", alignItems:"center", gap:10, background:"#6B1E2F", color:"#F2E8D8", padding:".875rem 1.75rem", fontSize:".72rem", letterSpacing:".14em", textTransform:"uppercase", fontWeight:500, textDecoration:"none", borderRadius:9999 }}
                      whileHover={{ scale:1.03, backgroundColor:"#8B2E3F" }} whileTap={{ scale:.97 }}
                      transition={{ type:"spring", stiffness:400, damping:20 }}>
                      <Play size={13} strokeWidth={2.5} />Browse Events
                    </motion.a>
                    <motion.a href="/contact"
                      style={{ display:"inline-flex", alignItems:"center", gap:10, border:"1px solid rgba(212,148,58,.35)", color:"#D4943A", padding:".875rem 1.75rem", fontSize:".72rem", letterSpacing:".14em", textTransform:"uppercase", fontWeight:500, textDecoration:"none", borderRadius:9999 }}
                      whileHover={{ scale:1.03, borderColor:"#D4943A", backgroundColor:"rgba(212,148,58,.06)" }} whileTap={{ scale:.97 }}
                      transition={{ type:"spring", stiffness:400, damping:20 }}>
                      <Bell size={13} strokeWidth={2} />Get Notified
                    </motion.a>
                  </div>
                </RevealOnScroll>

                {/* stats */}
                <RevealOnScroll delay={1.2} y={10}>
                  <div style={{ display:"flex", gap:"2rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,255,255,.06)" }}>
                    {[{ num:"6+", label:"Events this season" }, { num:"3", label:"Unique spaces" }, { num:"280", label:"Max capacity" }].map(({ num, label }) => (
                      <div key={label}>
                        <span style={{ display:"block", fontFamily:"var(--font-playfair)", fontSize:"1.5rem", color:"#E6C49A", lineHeight:1 }}>{num}</span>
                        <span style={{ display:"block", fontSize:".6rem", letterSpacing:".1em", textTransform:"uppercase", color:"#8A7E72", marginTop:4 }}>{label}</span>
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
                    {/* glow halo */}
                    <motion.div className="absolute -inset-px pointer-events-none" variants={{ hover:{ opacity:1 }, idle:{ opacity:0 } }} initial="idle"
                      style={{ background:"radial-gradient(ellipse at 50% 0%, rgba(212,148,58,.15), transparent 70%)", boxShadow:"0 0 40px rgba(212,148,58,.07)" }} />

                    <div style={{ background:"#1A1820", border:"1px solid rgba(230,196,154,.1)", overflow:"hidden" }}>
                      {/* top bar */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:".8rem 1.1rem .4rem" }}>
                        <span style={{ fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", fontWeight:500, color:"#D4943A" }}>Featured Tonight</span>
                        <motion.div style={{ display:"flex", alignItems:"center", gap:6, fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase", color:"#8A7E72" }}
                          variants={{ hover:{ color:"#D4943A" } }}>
                          <Ticket size={10} />View tickets
                        </motion.div>
                      </div>

                      {/* poster */}
                      <div style={{ position:"relative", margin:"0 1.1rem", aspectRatio:"16/7", overflow:"hidden" }}>
                        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 30% 70%, ${featured.bgColors[0]}, ${featured.bgColors[1]} 50%, ${featured.bgColors[2]})` }} />
                        {/* rings */}
                        {[80,56,36].map((s,i) => (
                          <motion.div key={i} className="absolute rounded-full border"
                            style={{ width:s, height:s, top:"50%", left:"50%", transform:"translate(-50%,-50%)", borderColor:`${featured.accent}${["18","28","40"][i]}` }}
                            variants={{ hover:{ scale:1.1 } }} transition={{ delay:i*.06, type:"spring", stiffness:200, damping:20 }} />
                        ))}
                        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <motion.span style={{ fontFamily:"var(--font-playfair)", fontSize:"2.5rem", fontWeight:700, color:featured.accent, opacity:.7 }} variants={{ hover:{ opacity:1 } }}>
                            {featured.initials}
                          </motion.span>
                        </div>
                        <div style={{ position:"absolute", top:10, left:10, background:"#6B1E2F", color:"#F2E8D8", padding:"3px 8px", fontSize:".55rem", letterSpacing:".15em", textTransform:"uppercase", borderRadius:9999 }}>
                          {featured.genre}
                        </div>
                      </div>

                      {/* body */}
                      <div style={{ padding:".8rem 1.1rem 1rem" }}>
                        <h3 style={{ fontFamily:"var(--font-playfair)", fontSize:"1.1rem", color:"#F2E8D8", lineHeight:1.15, marginBottom:".15rem" }}>{featured.title}</h3>
                        <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", color:"#8A7E72", fontSize:".85rem", marginBottom:".65rem" }}>{featured.artist}</p>
                        <div style={{ display:"flex", flexDirection:"column", gap:4, marginBottom:".75rem" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:".7rem", color:"#8A7E72" }}><Clock size={11} />{featured.time} · Doors {featured.doors}</span>
                          <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:".7rem", color:"#8A7E72" }}><MapPin size={11} />{featured.venue} · {featured.capacity}</span>
                        </div>
                        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between" }}>
                          <div>
                            <span style={{ display:"block", fontSize:".56rem", letterSpacing:".12em", textTransform:"uppercase", color:"#8A7E72", marginBottom:2 }}>From</span>
                            <span style={{ fontFamily:"var(--font-playfair)", fontSize:"1.35rem", color:"#D4943A" }}>{formatPrice(Math.min(...featured.tiers.map(t=>t.price)))}</span>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <span style={{ display:"block", fontSize:".56rem", letterSpacing:".12em", textTransform:"uppercase", color:"#8A7E72", marginBottom:4 }}>Availability</span>
                            <div style={{ width:72, height:3, background:"#211F2A", borderRadius:2, overflow:"hidden" }}>
                              <motion.div style={{ height:"100%", background:"linear-gradient(90deg,#6B1E2F,#D4943A)", borderRadius:2 }}
                                initial={{ width:0 }} animate={{ width:`${featured.availability}%` }} transition={{ duration:1.2, ease:"easeOut", delay:.8 }} />
                            </div>
                            <span style={{ fontSize:".56rem", color:"#8A7E72", display:"block", marginTop:3 }}>{featured.availability}% sold</span>
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
                          background:"linear-gradient(135deg, rgba(107,30,47,.06), transparent)",
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
          <div style={{ position: "relative", width: 1, height: 48, background: "rgba(212,148,58,0.18)" }}>
            {!prefersReducedMotion && (
              <motion.div
                style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)",
                  width: 3, height: 3, borderRadius: "50%",
                  background: "#D4943A",
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
            color: "rgba(212,148,58,0.6)", fontFamily: "var(--font-grotesk)",
          }}>
            Scroll
          </span>

          {/* double chevron */}
          <motion.div
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: -6 }}
            animate={prefersReducedMotion ? {} : { y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={13} strokeWidth={1.5} style={{ color: "rgba(212,148,58,0.45)", marginBottom: -6 }} />
            <ChevronDown size={13} strokeWidth={1.5} style={{ color: "rgba(212,148,58,0.25)" }} />
          </motion.div>
        </motion.button>
      </section>

      {/* breathing room — separates hero from filter bar */}
      <div aria-hidden="true" style={{ height:"2rem", background:"#0F1115" }} />

      {/* ══════════════════════════════════════════
          FILTER BAR
      ══════════════════════════════════════════ */}
      <div id="lineup" className="sticky top-[172px] z-40"
        style={{ background:"rgba(15,17,21,.95)", backdropFilter:"blur(20px) saturate(1.4)", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
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
                    border:"1px solid", borderRadius:9999, cursor:"pointer", transition:"none",
                    background: genre===g ? "#6B1E2F" : "transparent",
                    borderColor: genre===g ? "#6B1E2F" : "rgba(255,255,255,.12)",
                    color: genre===g ? "#F2E8D8" : "#8A7E72",
                  }}
                  whileHover={{ color: genre===g ? "#F2E8D8" : "#D4943A", borderColor: genre===g ? "#6B1E2F" : "rgba(212,148,58,.45)", scale:1.03 }}
                  whileTap={{ scale:.94 }}>
                  {g === "all" ? "All" : g}
                </motion.button>
              ))}
            </div>

            {/* divider */}
            <div className="hidden sm:block" style={{ width:1, height:18, background:"rgba(255,255,255,.08)", flexShrink:0 }} />

            {/* date pills */}
            <div className="flex gap-1.5" role="group" aria-label="Filter by month">
              {MONTHS.map(m => (
                <motion.button key={m.value} type="button" onClick={() => setMonth(m.value)}
                  aria-pressed={month === m.value}
                  style={{
                    padding:".36rem 1.1rem", fontSize:".6rem", letterSpacing:".12em", textTransform:"uppercase",
                    border:"1px solid", borderRadius:9999, cursor:"pointer", transition:"none",
                    background: month===m.value ? "#6B1E2F" : "transparent",
                    borderColor: month===m.value ? "#6B1E2F" : "rgba(255,255,255,.12)",
                    color: month===m.value ? "#F2E8D8" : "#8A7E72",
                  }}
                  whileHover={{ color: month===m.value ? "#F2E8D8" : "#D4943A", borderColor: month===m.value ? "#6B1E2F" : "rgba(212,148,58,.45)", scale:1.03 }}
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
              style={{ fontSize:".58rem", letterSpacing:".14em", color:"#6B6474" }}
              initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:4 }} transition={{ duration:.16 }}>
              {filtered.length} event{filtered.length !== 1 ? "s" : ""} showing
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          LINEUP GRID
      ══════════════════════════════════════════ */}
      <section className="pt-16 pb-44 flex flex-col items-center" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
        {/* section heading */}
        <RevealOnScroll className="w-full mb-12">
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", paddingBottom:"1.5rem", borderBottom:"1px solid rgba(255,255,255,.05)" }}>
            <div>
              <p style={{ fontSize:".6rem", letterSpacing:".3em", textTransform:"uppercase", color:"#D4943A", marginBottom:10 }}>Upcoming</p>
              <h2 style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(1.8rem,3.5vw,2.75rem)", color:"#F2E8D8", lineHeight:1 }}>
                This Season&apos;s Lineup
              </h2>
            </div>
            <p className="hidden md:block" style={{ fontFamily:"var(--font-playfair)", fontSize:"4rem", color:"rgba(230,196,154,.06)", lineHeight:1, letterSpacing:"-.02em" }}>2026</p>
          </div>
        </RevealOnScroll>

        {/* cards — 3-col max */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="py-32 flex flex-col items-center gap-5" style={{ color:"#8A7E72" }}>
                <Music size={36} style={{ opacity:.22 }} />
                <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", fontSize:"1.1rem" }}>No events match your current filters.</p>
                <motion.button type="button" onClick={() => { setGenre("all"); setMonth("all"); }}
                  style={{ fontSize:".62rem", letterSpacing:".15em", textTransform:"uppercase", border:"1px solid rgba(255,255,255,.1)", borderRadius:9999, padding:".5rem 1.25rem", background:"transparent", color:"#8A7E72", cursor:"pointer" }}
                  whileHover={{ borderColor:"rgba(255,255,255,.3)", color:"#F2E8D8" }}>
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
      <div aria-hidden="true" style={{ height:"5rem", background:"#0F1115" }} />

      {/* ══════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════ */}
      <section style={{ background:"#1A1820", borderTop:"1px solid rgba(255,255,255,.05)", borderBottom:"1px solid rgba(255,255,255,.05)" }}
        className="flex justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-6xl py-20 grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <RevealOnScroll>
            <p style={{ fontSize:".6rem", letterSpacing:".3em", textTransform:"uppercase", color:"#D4943A", marginBottom:12 }}>Stay in the loop</p>
            <h2 style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(1.75rem,3vw,2.5rem)", color:"#F2E8D8", lineHeight:1.1, marginBottom:12 }}>
              Never Miss<br />a Note.
            </h2>
            <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", color:"#8A7E72", fontSize:"1.05rem", maxWidth:"32ch", lineHeight:1.65 }}>
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
                style={{ flex:1, minWidth:0, background:"#0F1115", border:"1px solid rgba(255,255,255,.1)", borderRight:"none", padding:".95rem 1rem", fontSize:".85rem", color:"#F2E8D8", outline:"none" }}
                onFocus={e => (e.currentTarget.style.borderColor="#D4943A")}
                onBlur={e => (e.currentTarget.style.borderColor="rgba(255,255,255,.1)")}
              />
              <motion.button type="submit"
                style={{ background:"#D4943A", color:"#0F1115", padding:".95rem 1.4rem", fontSize:".68rem", letterSpacing:".15em", textTransform:"uppercase", fontWeight:500, border:"none", cursor:"pointer", whiteSpace:"nowrap" }}
                whileHover={{ backgroundColor:"#E8AA56" }} whileTap={{ scale:.98 }}>
                Subscribe
              </motion.button>
            </form>
            <p style={{ marginTop:10, fontSize:".6rem", letterSpacing:".06em", color:"#6B6474" }}>No spam. Unsubscribe any time.</p>
          </RevealOnScroll>
        </div>
      </section>

      {/* breathing room before footer */}
      <div aria-hidden="true" style={{ height:"5rem", background:"#0F1115" }} />

      <Footer />
      <EventDetailPanel event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
