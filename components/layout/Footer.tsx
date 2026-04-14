"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import RevealOnScroll from "@/components/effects/RevealOnScroll";

const NAV = [
  { href: "/",         label: "Events"   },
  { href: "/antiques", label: "Antiques" },
  { href: "/about",    label: "About"    },
  { href: "/contact",  label: "Contact"  },
];

/* Inline SVG brand icons — Lucide-stroke style */
const IgIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none"/>
  </svg>
);

const FbIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const SOCIAL = [
  { href: "#", label: "Instagram", Icon: IgIcon },
  { href: "#", label: "Facebook",  Icon: FbIcon  },
];

export default function Footer() {
  return (
    <footer className="w-full" style={{ background: "#03030A" }} aria-label="Site footer">

      {/* ── top decorative rule — full width ── */}
      <div className="flex items-center gap-6" style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "4rem" }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(212,148,58,.2))" }} />
        <span style={{
          fontSize: ".55rem", letterSpacing: ".42em", textTransform: "uppercase",
          color: "rgba(212,148,58,.38)", fontFamily: "var(--font-grotesk)", whiteSpace: "nowrap",
        }}>
          Season 2026 · Casablanca
        </span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(212,148,58,.2))" }} />
      </div>

      {/* ── main grid — full width, generous side padding ── */}
      <div className="w-full" style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "3.5rem", paddingBottom: "5rem" }}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.2fr] gap-14 lg:gap-24 xl:gap-32">

          {/* ── Brand column ── */}
          <RevealOnScroll y={18}>
            <div>
              {/* wordmark */}
              <p style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(2.5rem,4vw,4rem)",
                color: "#F4F1E8", lineHeight: 1,
                marginBottom: ".65rem", letterSpacing: "-.015em",
              }}>
                Ever<span style={{ color: "#C9A96E" }}>wood</span>
              </p>

              <p style={{
                fontSize: ".56rem", letterSpacing: ".32em", textTransform: "uppercase",
                color: "rgba(201,169,110,.4)", marginBottom: "1.75rem",
                fontFamily: "var(--font-grotesk)",
              }}>
                Where music comes alive
              </p>

              <p style={{
                fontFamily: "var(--font-garamond)", fontStyle: "italic",
                fontSize: "1.02rem", color: "#8884A8",
                lineHeight: 1.8, maxWidth: "32ch", marginBottom: "2.25rem",
              }}>
                A living archaeology of music, art, and rare objects inside a
                16th-century riad in the heart of Casablanca&apos;s medina.
              </p>

              {/* social — icon only */}
              <div className="flex items-center gap-3">
                {SOCIAL.map(({ href, label, Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={`Follow us on ${label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 44, height: 44,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1px solid rgba(255,255,255,.1)",
                      color: "#8884A8", textDecoration: "none",
                      borderRadius: "50%",
                    }}
                    whileHover={{ borderColor: "rgba(201,169,110,.55)", color: "#C9A96E", scale: 1.08 }}
                    whileTap={{ scale: .93 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  >
                    <Icon />
                  </motion.a>
                ))}

                {/* mail — icon only */}
                <motion.a
                  href="mailto:hello@everwood.ma"
                  aria-label="Send us an email"
                  style={{
                    width: 44, height: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid rgba(255,255,255,.1)",
                    color: "#8884A8", textDecoration: "none",
                    borderRadius: "50%",
                  }}
                  whileHover={{ borderColor: "rgba(201,169,110,.55)", color: "#C9A96E", scale: 1.08 }}
                  whileTap={{ scale: .93 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                >
                  <Mail size={15} />
                </motion.a>
              </div>
            </div>
          </RevealOnScroll>

          {/* ── Navigate column ── */}
          <RevealOnScroll delay={.1} y={18}>
            <div>
              <p style={{
                fontSize: ".55rem", letterSpacing: ".3em", textTransform: "uppercase",
                color: "rgba(201,169,110,.38)", marginBottom: ".75rem",
                fontFamily: "var(--font-grotesk)",
              }}>
                Navigate
              </p>
              <div style={{ width: 28, height: 1, background: "rgba(201,169,110,.22)", marginBottom: "1.75rem" }} />

              <nav className="flex flex-col">
                {NAV.map(({ href, label }) => (
                  <motion.div key={href} whileHover="hover" initial="rest">
                    <Link
                      href={href}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontFamily: "var(--font-playfair)", fontSize: "1.05rem",
                        color: "rgba(244,241,232,.6)", textDecoration: "none",
                        padding: ".5rem 0",
                      }}
                      className="transition-colors duration-200 hover:!text-[#F4F1E8]"
                    >
                      {label}
                      <motion.span
                        variants={{ rest: { x: 0, opacity: 0 }, hover: { x: 4, opacity: 1 } }}
                        transition={{ duration: .2 }}
                        style={{ color: "#C9A96E" }}
                      >
                        <ArrowUpRight size={13} />
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </RevealOnScroll>

          {/* ── Visit column ── */}
          <RevealOnScroll delay={.2} y={18}>
            <div>
              <p style={{
                fontSize: ".55rem", letterSpacing: ".3em", textTransform: "uppercase",
                color: "rgba(201,169,110,.38)", marginBottom: ".75rem",
                fontFamily: "var(--font-grotesk)",
              }}>
                Visit
              </p>
              <div style={{ width: 28, height: 1, background: "rgba(201,169,110,.22)", marginBottom: "1.75rem" }} />

              {/* address */}
              <div className="flex gap-3 mb-5">
                <MapPin size={14} style={{ color: "#C9A96E", flexShrink: 0, marginTop: 3 }} />
                <address style={{ fontStyle: "normal", fontSize: ".88rem", color: "#8884A8", lineHeight: 1.8 }}>
                  12 Derb Moulay Cherif<br />
                  Ancienne Médina<br />
                  Casablanca 20250, Morocco
                </address>
              </div>

              {/* email */}
              <div className="flex gap-3 mb-8">
                <Mail size={14} style={{ color: "#C9A96E", flexShrink: 0, marginTop: 2 }} />
                <a
                  href="mailto:hello@everwood.ma"
                  style={{ fontSize: ".88rem", color: "#8884A8", textDecoration: "none" }}
                  className="hover:text-[#C9A96E] transition-colors duration-200"
                >
                  hello@everwood.ma
                </a>
              </div>

              {/* hours card */}
              <div style={{
                borderLeft: "2px solid rgba(201,169,110,.28)",
                background: "rgba(201,169,110,.04)",
                padding: "1.1rem 1.25rem",
              }}>
                <p style={{
                  fontSize: ".52rem", letterSpacing: ".24em", textTransform: "uppercase",
                  color: "rgba(201,169,110,.45)", marginBottom: ".6rem",
                  fontFamily: "var(--font-grotesk)",
                }}>
                  Opening Hours
                </p>
                <p style={{ fontSize: ".85rem", color: "#8884A8", lineHeight: 1.7 }}>
                  Thu – Sun&nbsp;
                  <span style={{ color: "rgba(244,241,232,.65)" }}>7:00 PM – late</span>
                </p>
              </div>
            </div>
          </RevealOnScroll>

        </div>
      </div>

      {/* ── bottom bar — full width ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
        <div className="w-full flex flex-wrap gap-4 items-center justify-between" style={{ paddingLeft: "60px", paddingRight: "60px", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <p style={{
            fontSize: ".62rem", letterSpacing: ".08em",
            color: "#ffffff",
            fontFamily: "var(--font-grotesk)",
          }}>
            © 2026 Everwood. All rights reserved.
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            {["Privacy Policy", "Terms of Use"].map(t => (
              <a
                key={t}
                href="#"
                style={{ fontSize: ".62rem", letterSpacing: ".06em", color: "#ffffff", textDecoration: "none" }}
              >
                {t}
              </a>
            ))}
            <span style={{ width: 1, height: 12, background: "rgba(255,255,255,.3)", display: "inline-block" }} />
            <span style={{
              fontSize: ".62rem", letterSpacing: ".12em",
              color: "#ffffff",
              fontFamily: "var(--font-grotesk)",
            }}>
              Casablanca, Morocco
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
