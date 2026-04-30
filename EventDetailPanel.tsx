"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin, Users, Minus, Plus, Ticket, Check } from "lucide-react";
import type { Event } from "@/lib/data/events";
import { EV, evR, evMuted, evMuted65, evSoftLine, onBronze, bronzeButtonGlow } from "@/lib/events-theme";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  event: Event | null;
  onClose: () => void;
}

export default function EventDetailPanel({ event, onClose }: Props) {
  const [selectedTier, setSelectedTier] = useState(0);
  const [qty, setQty] = useState(1);
  const [stage, setStage] = useState<"idle" | "loading" | "success">("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  // reset state on new event
  useEffect(() => {
    setSelectedTier(0);
    setQty(1);
    setStage("idle");
  }, [event]);

  // Focus management — save/restore + move focus into modal on open
  useEffect(() => {
    if (event) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const first = panel.querySelector<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
        );
        first?.focus();
      });
    } else {
      prevFocusRef.current?.focus();
    }
  }, [event]);

  // Focus trap — keep Tab navigation inside modal while open
  useEffect(() => {
    if (!event) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [event]);

  // close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = event ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [event]);

  const handleBuy = async () => {
    if (!event || stage !== "idle") return;
    setStage("loading");
    await new Promise(r => setTimeout(r, 1500));
    setStage("success");
    setTimeout(() => {
      toast.success(`${qty} ticket${qty > 1 ? "s" : ""} reserved`, { description: `${event.title} · Confirmation sent.` });
      onClose();
    }, 900);
  };

  const tier = event?.tiers[selectedTier];
  const total = tier ? tier.price * qty : 0;

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-[600]"
            style={{ background: `linear-gradient(165deg, ${evR.burgundy(0.22)} 0%, rgba(15,17,21,0.92) 45%, rgba(10,8,14,0.94) 100%)`, backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal */}
          <motion.div
            className="fixed inset-0 z-[610] flex items-center justify-center p-4 sm:p-6 lg:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              ref={panelRef}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col md:flex-row"
              style={{ background: EV.violet, border: `1px solid ${evSoftLine}`, boxShadow: `0 40px 120px ${evR.burgundy(0.25)}` }}
              initial={{ scale: .92, y: 24, opacity: 0 }}
              animate={{ scale: 1,  y: 0,  opacity: 1 }}
              exit={{ scale: .94, y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >

              {/* ── LEFT — visual column ──────────────────────── */}
              <div
                className="relative flex-shrink-0 w-full md:w-[42%] flex flex-col overflow-hidden"
                style={{ minHeight: 280 }}
              >
                {/* gradient bg */}
                <div className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 35% 65%, ${event.bgColors[0]}, ${event.bgColors[1]} 52%, ${event.bgColors[2]})` }} />

                {/* layered rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {[160, 120, 84, 54].map((s, i) => (
                    <motion.div key={i} className="absolute rounded-full border"
                      style={{ width: s, height: s, borderColor: `${event.accent}${["0d","16","26","38"][i]}` }}
                      initial={{ scale: .8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: .1 + i * .07, duration: .5, ease: [.16,1,.3,1] }} />
                  ))}
                </div>

                {/* glow blob */}
                <div className="absolute rounded-full pointer-events-none"
                  style={{ width: 90, height: 90, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: event.accent, opacity: .18, filter: "blur(32px)" }} />

                {/* big initials */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span initial={{ opacity:0, scale:.8 }} animate={{ opacity:.75, scale:1 }}
                    transition={{ delay:.2, duration:.6, ease:[.34,1.56,.64,1] }}
                    style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(4rem,8vw,6rem)", fontWeight:700, color:event.accent }}>
                    {event.initials}
                  </motion.span>
                </div>

                {/* top-left: genre + date */}
                <div className="relative z-10 flex items-start justify-between p-5">
                  <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:.25 }}
                    style={{
                      borderLeft:`3px solid ${EV.burgundy}`,
                      background: "rgba(15,17,21,0.72)",
                      color: EV.cream,
                      padding:"4px 10px 4px 8px",
                      fontSize:".55rem",
                      letterSpacing:".18em",
                      textTransform:"uppercase",
                    }}>
                    {event.genre}
                  </motion.div>
                  <motion.div initial={{ opacity:0, scale:.7 }} animate={{ opacity:1, scale:1 }}
                    transition={{ delay:.28, type:"spring", stiffness:280, damping:18 }}
                    className="flex flex-col items-center justify-center rounded-full"
                    style={{ width:46, height:46, background:"transparent", border:`1px solid ${evSoftLine}` }}>
                    <span style={{ fontFamily:"var(--font-grotesk)", fontSize:".95rem", fontWeight:700, color: EV.cream, lineHeight:1 }}>{event.day}</span>
                    <span style={{ fontFamily:"var(--font-grotesk)", fontSize:".48rem", letterSpacing:".12em", color: evMuted65, lineHeight:1, marginTop:2 }}>{event.monthLabel}</span>
                  </motion.div>
                </div>

                {/* bottom: set-time timeline */}
                <div className="relative z-10 mt-auto p-5 pt-0">
                  <div style={{ background:`rgba(15,17,21,.72)`, backdropFilter:"blur(10px)", padding:"1rem", borderTop:`1px solid ${evSoftLine}` }}>
                    <p style={{ fontSize:".55rem", letterSpacing:".2em", textTransform:"uppercase", color: EV.burgundy, marginBottom:".75rem" }}>Running Order</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:0, position:"relative" }}>
                      {/* vertical line */}
                      <div style={{ position:"absolute", left:5, top:6, bottom:6, width:1, background: EV.burgundy, opacity:0.45 }} />
                      {event.setTimes.map(({ time, act }, i) => (
                        <motion.div key={time}
                          initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                          transition={{ delay: .4 + i * .07 }}
                          style={{ display:"flex", alignItems:"center", gap:10, padding:"4px 0", paddingLeft:2 }}>
                          {/* dot */}
                          <div style={{ width:10, height:10, borderRadius:"50%", border:`1px solid ${event.accent}`, background: i === 0 ? event.accent : "transparent", flexShrink:0 }} />
                          <span style={{ fontFamily:"var(--font-grotesk)", fontSize:".62rem", color: EV.cream, width:32, flexShrink:0 }}>{time}</span>
                          <span style={{ fontSize:".72rem", color: evMuted65 }}>{act}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT — info + tickets ────────────────────── */}
              <div className="flex-1 overflow-y-auto flex flex-col" style={{ borderLeft:`1px solid ${evSoftLine}` }}>

                {/* close button */}
                <button type="button" onClick={onClose} aria-label="Close event details"
                  className="absolute top-3 right-3 z-20 flex items-center justify-center rounded-full transition-colors duration-200"
                  style={{ width:44, height:44, background: evR.violet(0.6), border:`1px solid ${evSoftLine}`, color: evMuted }}
                  onMouseEnter={e => (e.currentTarget.style.color = EV.bronze)}
                  onMouseLeave={e => (e.currentTarget.style.color = evMuted)}>
                  <X size={15} />
                </button>

                {/* header */}
                <div style={{ padding:"2rem 2rem 1.25rem", borderBottom:`1px solid ${evSoftLine}` }}>
                  <p style={{ fontSize:".58rem", letterSpacing:".22em", textTransform:"uppercase", color: EV.burgundy, marginBottom:8 }}>{event.date}</p>
                  <h2 id="modal-title" style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(1.4rem,2.5vw,1.9rem)", color: EV.cream, lineHeight:1.1, marginBottom:4 }}>
                    {event.title}
                  </h2>
                  <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", color: evMuted65, fontSize:"1rem" }}>{event.artist}</p>
                </div>

                {/* meta pills */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, padding:"1.25rem 2rem", borderBottom:`1px solid ${evSoftLine}` }}>
                  {[
                    { icon: Clock,  label: "Doors",    value: event.doors },
                    { icon: Clock,  label: "Show",     value: event.time },
                    { icon: MapPin, label: "Venue",    value: event.venue },
                    { icon: Users,  label: "Capacity", value: event.capacity },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display:"flex", alignItems:"flex-start", gap:7, background: evR.burgundy(0.08), border:`1px solid ${evSoftLine}`, padding:"8px 12px", flex:"1 1 130px" }}>
                      <Icon size={13} style={{ color: EV.burgundy, marginTop:1, flexShrink:0 }} />
                      <div>
                        <div style={{ fontSize:".55rem", letterSpacing:".12em", textTransform:"uppercase", color: evMuted, marginBottom:2 }}>{label}</div>
                        <div style={{ fontSize:".78rem", color: EV.cream }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* description */}
                <div style={{ padding:"1.25rem 2rem 1rem", borderBottom:`1px solid ${evSoftLine}` }}>
                  <p style={{ fontFamily:"var(--font-garamond)", fontSize:"1rem", color: evMuted65, lineHeight:1.75 }}>
                    {event.description}
                  </p>
                </div>

                {/* tickets section */}
                {event.soldOut ? (
                  <div style={{ margin:"1.5rem 2rem", padding:"1.25rem", border:`1px solid ${evSoftLine}`, textAlign:"center", background: evR.burgundy(0.06) }}>
                    <p style={{ fontSize:".72rem", letterSpacing:".15em", textTransform:"uppercase", color: evMuted }}>This event is sold out</p>
                    <p style={{ fontFamily:"var(--font-garamond)", fontStyle:"italic", color: evR.cream(0.42), fontSize:".85rem", marginTop:6 }}>
                      Join the waitlist or browse upcoming events.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding:"1.25rem 2rem 2rem", flex:1, display:"flex", flexDirection:"column", gap:"1rem" }}>
                    <p style={{ fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color: EV.burgundy }}>Select Tickets</p>

                    {/* tier cards */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {event.tiers.map((t, i) => {
                        const sel = selectedTier === i;
                        const avail = t.available > 0;
                        return (
                          <motion.button type="button" key={t.name}
                            onClick={() => avail && setSelectedTier(i)}
                            disabled={!avail}
                            style={{
                              textAlign:"left", padding:"1rem", border:`1px solid`,
                              borderColor: sel ? EV.burgundy : evSoftLine,
                              background: sel ? evR.burgundy(0.12) : "transparent",
                              opacity: avail ? 1 : .38, cursor: avail ? "pointer" : "not-allowed",
                              position:"relative", overflow:"hidden",
                            }}
                            whileHover={avail && !sel ? { borderColor: evR.burgundy(0.55), backgroundColor: evR.burgundy(0.06) } : {}}
                            transition={{ duration:.15 }}>
                            {/* selected indicator */}
                            {sel && (
                              <motion.div layoutId="tier-sel" className="absolute inset-0 pointer-events-none"
                                style={{ border:`1px solid ${evR.burgundy(0.45)}`, background: evR.burgundy(0.06) }}
                                transition={{ type:"spring", stiffness:400, damping:28 }} />
                            )}
                            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", position:"relative" }}>
                              <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                                {/* radio dot */}
                                <div style={{ width:16, height:16, borderRadius:"50%", border:`1px solid ${sel ? EV.burgundy : evSoftLine}`, display:"flex", alignItems:"center", justifyContent:"center", marginTop:2, flexShrink:0 }}>
                                  {sel && <div style={{ width:7, height:7, borderRadius:"50%", background: EV.burgundy }} />}
                                </div>
                                <div>
                                  <div style={{ fontSize:".82rem", color: EV.cream, fontWeight:500, marginBottom:3 }}>{t.name}</div>
                                  <div style={{ fontSize:".72rem", color: evMuted }}>{t.perks}</div>
                                  {t.low && avail && (
                                    <div style={{ fontSize:".6rem", color: EV.burgundy, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
                                      <span style={{ width:5, height:5, borderRadius:"50%", background: EV.burgundy, display:"inline-block" }} />
                                      Only {t.available} left
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={{ textAlign:"right", flexShrink:0 }}>
                                {!avail ? (
                                  <span style={{ fontSize:".72rem", color: evR.cream(0.35) }}>Sold out</span>
                                ) : (
                                  <span style={{ fontFamily:"var(--font-playfair)", fontSize:"1.05rem", color: EV.cream, fontWeight: sel ? 600 : 400 }}>{formatPrice(t.price)}</span>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* qty + total */}
                    {tier && tier.available > 0 && (
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1rem", background: evR.violet(0.35), border:`1px solid ${evSoftLine}`, marginTop:4 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:0 }}>
                          <button type="button" onClick={() => setQty(q => Math.max(1, q-1))} aria-label="Decrease quantity"
                            style={{ width:40, height:40, border:`1px solid ${evSoftLine}`, background:"transparent", color: evMuted, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .15s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = EV.burgundy; (e.currentTarget as HTMLButtonElement).style.color = EV.cream; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(230,196,154,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = evMuted; }}>
                            <Minus size={13} />
                          </button>
                          <div style={{ width:48, height:40, display:"flex", alignItems:"center", justifyContent:"center", borderTop:`1px solid ${evSoftLine}`, borderBottom:`1px solid ${evSoftLine}` }}>
                            <AnimatePresence mode="wait">
                              <motion.span key={qty}
                                initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }}
                                transition={{ duration:.15 }}
                                style={{ fontFamily:"var(--font-grotesk)", fontSize:".9rem", color: EV.cream }}>
                                {qty}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <button type="button" onClick={() => setQty(q => Math.min(10, q+1))} aria-label="Increase quantity"
                            style={{ width:40, height:40, border:`1px solid ${evSoftLine}`, background:"transparent", color: evMuted, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .15s" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = EV.burgundy; (e.currentTarget as HTMLButtonElement).style.color = EV.cream; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(230,196,154,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = evMuted; }}>
                            <Plus size={13} />
                          </button>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <span style={{ display:"block", fontSize:".56rem", letterSpacing:".12em", textTransform:"uppercase", color: evMuted, marginBottom:2 }}>Total</span>
                          <AnimatePresence mode="wait">
                            <motion.span key={total}
                              initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}
                              transition={{ duration:.18 }}
                              style={{ fontFamily:"var(--font-playfair)", fontSize:"1.3rem", color: EV.cream }}>
                              {formatPrice(total)}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* buy button */}
                    <motion.button onClick={handleBuy} disabled={stage !== "idle"}
                      style={{
                        width:"100%", padding:"1rem", border:"none", cursor: stage !== "idle" ? "default" : "pointer",
                        background: stage === "success" ? evR.bronze(0.14) : EV.bronze,
                        borderBottom: stage === "success" ? `2px solid ${EV.burgundy}` : "none",
                        display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                        fontFamily:"var(--font-grotesk)", fontSize:".72rem", letterSpacing:".15em", textTransform:"uppercase",
                        color: stage === "success" ? EV.cream : onBronze,
                        transition:"background .3s, color .3s, box-shadow .25s",
                        marginTop:"auto",
                        boxShadow: stage === "idle" ? `inset 0 1px 0 ${evR.cream(0.2)}` : undefined,
                      }}
                      whileHover={stage === "idle" ? { boxShadow: bronzeButtonGlow, filter: "brightness(1.05)" } : {}}
                      whileTap={stage === "idle" ? { scale:.98 } : {}}>
                      {stage === "loading" && (
                        <motion.span className="rounded-full"
                          style={{ width:16, height:16, border:`2px solid ${evSoftLine}`, borderTopColor: EV.cream, display:"inline-block" }}
                          animate={{ rotate:360 }} transition={{ duration:.75, repeat:Infinity, ease:"linear" }} />
                      )}
                      {stage === "success" && <Check size={15} strokeWidth={2.5} />}
                      {stage === "idle" && <Ticket size={14} />}
                      {stage === "idle"   && `Reserve ${qty} Ticket${qty > 1 ? "s" : ""}`}
                      {stage === "loading" && "Processing…"}
                      {stage === "success" && "Tickets Reserved!"}
                    </motion.button>
                    <p style={{ textAlign:"center", fontSize:".58rem", color: evR.cream(0.38), letterSpacing:".06em" }}>
                      Secure checkout · Instant confirmation
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
