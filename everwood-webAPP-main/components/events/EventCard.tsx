"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import type { Event } from "@/lib/data/events";
import { formatPrice } from "@/lib/utils";

interface Props {
  event: Event;
  index: number;
  onClick: (event: Event) => void;
}

export default function EventCard({ event, index, onClick }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  const minPrice = Math.min(...event.tiers.map(t => t.price));
  const lowTickets = event.tiers.some(t => t.low && t.available > 0);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      layout
      className="group cursor-pointer"
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${event.title}`}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(event); } }}
    >
      <motion.div
        className="relative overflow-hidden"
        style={{
          borderRadius: 24,
          padding: 10,
          background: `radial-gradient(ellipse at 30% 20%, ${event.bgColors[0]}, ${event.bgColors[1]} 50%, ${event.bgColors[2]})`,
        }}
        whileHover={{ scale: 1.01, boxShadow: `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px ${event.accent}44` }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {/* ── Decorative rings — visible in the border gap ─────────── */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-hidden="true"
        >
          {[200, 150, 108, 74].map((size, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size, height: size,
                borderColor: `${event.accent}${["12", "1E", "2E", "44"][i]}`,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: index * 0.08 + 0.2 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </div>

        {/* ── Glow blob ─────────────────────────────────────────────── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 90, height: 90,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: event.accent,
            opacity: 0.18,
            filter: "blur(32px)",
          }}
          aria-hidden="true"
        />

        {/* ── Floating initials in top-right gap area ───────────────── */}
        <motion.span
          className="absolute pointer-events-none select-none"
          style={{
            top: 14, right: 18,
            fontFamily: "var(--font-playfair)",
            fontSize: "1.6rem", fontWeight: 700,
            color: event.accent, opacity: 0.45,
            lineHeight: 1,
          }}
          animate={inView ? { opacity: 0.45 } : { opacity: 0 }}
          whileHover={{ opacity: 0.75 }}
          transition={{ delay: index * 0.08 + 0.3 }}
          aria-hidden="true"
        >
          {event.initials}
        </motion.span>

        {/* ── Sold-out tint over entire gradient ────────────────────── */}
        {event.soldOut && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.45)", borderRadius: 24, zIndex: 1 }}
            aria-hidden="true"
          />
        )}

        {/* ── INNER CONTENT PANEL — the image "borders" this ────────── */}
        <motion.div
          className="relative flex flex-col"
          style={{
            background: "rgba(10, 8, 16, 0.88)",
            backdropFilter: "blur(4px)",
            borderRadius: 16,
            overflow: "hidden",
            zIndex: 2,
          }}
          whileHover={{ background: "rgba(10, 8, 16, 0.82)" }}
          transition={{ duration: 0.3 }}
        >
          {/* top accent strip — matches event accent */}
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${event.accent}CC, transparent)` }} aria-hidden="true" />

          {/* genre + date row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.9rem 1.25rem 0" }}>
            <motion.div
              style={{
                fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500,
                background: "#6B1E2F", color: "#F2E8D8",
                padding: "0.25rem 0.6rem",
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.08 + 0.35 }}
            >
              {event.genre}
            </motion.div>

            <motion.div
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(212,148,58,0.1)", border: "1px solid rgba(212,148,58,0.28)",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.08 + 0.3, type: "spring", stiffness: 320, damping: 18 }}
            >
              <span style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.9rem", fontWeight: 700, color: "#D4943A", lineHeight: 1 }}>{event.day}</span>
              <span style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.44rem", letterSpacing: "0.12em", color: "#D4943A", lineHeight: 1, marginTop: 2 }}>{event.monthLabel}</span>
            </motion.div>
          </div>

          {/* title + artist */}
          <div style={{ padding: "0.75rem 1.25rem 0" }}>
            <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.3rem", color: "#F2E8D8", lineHeight: 1.15, marginBottom: "0.3rem" }}>
              {event.title}
            </h3>
            <p style={{ fontFamily: "var(--font-garamond)", fontStyle: "italic", color: "#8A7E72", fontSize: "0.95rem" }}>
              {event.artist}
            </p>
          </div>

          {/* bio */}
          <p
            className="line-clamp-2"
            style={{ fontFamily: "var(--font-garamond)", fontSize: "0.88rem", color: "rgba(138,126,114,0.65)", lineHeight: 1.65, padding: "0.6rem 1.25rem 0.9rem" }}
          >
            {event.bio}
          </p>

          {/* divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 1.25rem" }} aria-hidden="true" />

          {/* meta */}
          <div style={{ padding: "0.85rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.75rem", color: "#8A7E72" }}>
              <Clock size={11} style={{ color: "#D4943A", flexShrink: 0 }} />
              <span>{event.time} — Doors {event.doors}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.75rem", color: "#8A7E72" }}>
              <MapPin size={11} style={{ color: "#D4943A", flexShrink: 0 }} />
              <span className="truncate">{event.venue} · {event.capacity}</span>
            </div>
          </div>

          {/* price + cta */}
          <div style={{ padding: "0 1.25rem 1.1rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "0.75rem" }}>
            <div>
              {event.soldOut ? (
                <span style={{ fontSize: "0.75rem", color: "#8A7E72" }}>Sold Out</span>
              ) : (
                <>
                  <span style={{ display: "block", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A7E72", marginBottom: 2 }}>From</span>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", color: "#D4943A" }}>{formatPrice(minPrice)}</span>
                </>
              )}
              {lowTickets && !event.soldOut && (
                <motion.div
                  style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.6 }}
                >
                  <AlertCircle size={9} style={{ color: "#E85D26" }} />
                  <span style={{ fontSize: "0.56rem", letterSpacing: "0.1em", color: "#E85D26" }}>Few tickets left</span>
                </motion.div>
              )}
            </div>

            {!event.soldOut && (
              <motion.div
                style={{
                  fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase",
                  border: `1px solid ${event.accent}55`, color: event.accent,
                  padding: "0.35rem 0.75rem",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                Details →
              </motion.div>
            )}
          </div>

          {/* availability bar */}
          <div style={{ height: 2, background: "#211F2A", position: "relative", overflow: "hidden" }}>
            <motion.div
              style={{
                position: "absolute", inset: "0 auto 0 0",
                background: `linear-gradient(90deg, #6B1E2F, ${event.accent})`,
              }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${event.availability}%` } : {}}
              transition={{ duration: 1.1, ease: "easeOut", delay: index * 0.08 + 0.5 }}
            />
          </div>

          {/* sold-out text badge */}
          {event.soldOut && (
            <div style={{ padding: "0.6rem 1.25rem", display: "flex", justifyContent: "center" }}>
              <span style={{
                fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase",
                color: "#8A7E72", border: "1px solid #8A7E72",
                padding: "0.3rem 0.9rem",
              }}>Sold Out</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
