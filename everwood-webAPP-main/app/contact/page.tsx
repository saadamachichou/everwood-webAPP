"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, X, MapPin, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TextSplit from "@/components/effects/TextSplit";
import RevealOnScroll from "@/components/effects/RevealOnScroll";
import { toast } from "sonner";

const schema = z.object({
  name:    z.string().min(2, "Name required"),
  email:   z.string().email({ message: "Valid email required" }),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message too short").max(500, "Max 500 characters"),
});
type FormData = z.infer<typeof schema>;

const FAQS = [
  { q: "Are the antiques available for international shipping?",      a: "Yes. We partner with specialist art shippers who handle customs documentation, insurance, and white-glove delivery worldwide. Each quote is tailored to the piece and destination." },
  { q: "Can I host a private event at the riad?",                     a: "Absolutely. We open the riad for private dinners, launches, ceremonies, and intimate concerts. Capacities range from 20 to 150 guests depending on the format." },
  { q: "Do you offer provenance verification or restoration services?",a: "All objects in the cabinet come with documented provenance chains. We work with a network of specialist conservators — pieces can be assessed for restoration on request." },
  { q: "Is there parking near the riad?",                             a: "The medina is pedestrian-only. The nearest parking is at Place Mohamed V (10-minute walk). We recommend arriving by petit taxi; drivers know the derb entrance well." },
  { q: "How do I sell or consign a piece to the collection?",         a: "We acquire selectively — quality over volume. Send photographs and provenance documentation to hello@everwood.ma with subject 'Acquisition Proposal'." },
];

const HOURS = [
  { day: "Monday",            hours: "Closed"          },
  { day: "Tuesday – Thursday",hours: "11:00 – 20:00"   },
  { day: "Friday",            hours: "11:00 – 23:00"   },
  { day: "Saturday",          hours: "10:00 – 23:00"   },
  { day: "Sunday",            hours: "10:00 – 18:00"   },
];

type SubmitState = "idle" | "loading" | "success" | "error";

// ── Shared horizontal page gutter ─────────────────────────────────────────────
const H_PAD: React.CSSProperties = { paddingLeft: "60px", paddingRight: "60px" };

// ── Thin label used throughout ─────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <p style={{
    fontFamily: "var(--font-grotesk)", fontSize: "0.54rem",
    letterSpacing: "0.24em", textTransform: "uppercase",
    color: "#3A3A52", marginBottom: "1.1rem",
  }}>{children}</p>
);

// ── Short gold underline ───────────────────────────────────────────────────────
const GoldRule = () => (
  <div style={{ width: 22, height: 1, background: "rgba(201,169,110,0.28)", marginBottom: "1.5rem" }} />
);

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [openFaq,     setOpenFaq]     = useState<number | null>(null);
  const [charCount,   setCharCount]   = useState(0);
  const [isOpen,      setIsOpen]      = useState(false);

  // Live open/closed status
  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const h   = now.getHours();
    setIsOpen(
      (day === 0 && h >= 10 && h < 18) ||
      (day >= 2 && day <= 4 && h >= 11 && h < 20) ||
      (day === 5 && h >= 11 && h < 23) ||
      (day === 6 && h >= 10 && h < 23)
    );
  }, []);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const msgValue = watch("message", "");
  useEffect(() => setCharCount(msgValue?.length ?? 0), [msgValue]);

  const onSubmit = async (_data: FormData) => {
    setSubmitState("loading");
    await new Promise(r => setTimeout(r, 1800));
    const ok = Math.random() > 0.1;
    if (ok) {
      setSubmitState("success");
      if (typeof window !== "undefined") {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ["#C9A96E", "#F4F1E8", "#2AFFA8"] });
      }
    } else {
      setSubmitState("error");
      toast.error("Something went wrong. Please try again.");
      setTimeout(() => setSubmitState("idle"), 600);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#03030A" }}>
      <Navigation />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO  —  full viewport, centered, sonar pulse
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        ...H_PAD,
        position: "relative",
        minHeight: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "172px",
        paddingBottom: "3.5rem",
        overflowX: "hidden",
        overflowY: "visible",
        textAlign: "center",
      }}>

        {/* Sonar rings — upper band */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "172px",
          height: "min(520px, 46svh)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          pointerEvents: "none",
        }} aria-hidden="true">
          {[260, 520, 780, 1040].map((size, i) => (
            <motion.div key={i}
              style={{
                position: "absolute", width: size, height: size, borderRadius: "50%",
                border: `1px solid rgba(201,169,110,${0.18 - i * 0.04})`,
              }}
              animate={{ scale: [0.85, 1.18], opacity: [0.75, 0] }}
              transition={{ duration: 4.5, delay: i * 1.1, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
          <div style={{
            position: "absolute", width: 8, height: 8, borderRadius: "50%",
            background: "#C9A96E",
            boxShadow: "0 0 20px rgba(201,169,110,0.55), 0 0 48px rgba(201,169,110,0.18)",
          }} />
        </div>

        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "172px",
          height: "min(520px, 46svh)",
          zIndex: 3,
          overflow: "hidden",
          pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(201,169,110,0.045) 0%, transparent 68%)",
        }} aria-hidden="true" />

        {/* ── Hero content (above illustration) ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "54rem",
            width: "100%",
            marginBottom: "2.25rem",
          }}
        >

          {/* Open / closed badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: `1px solid ${isOpen ? "rgba(42,255,168,0.25)" : "rgba(232,93,38,0.25)"}`,
              background: isOpen ? "rgba(42,255,168,0.06)" : "rgba(232,93,38,0.06)",
              borderRadius: 100,
              padding: "0.45rem 1.2rem",
              marginBottom: "2.75rem",
            }}
          >
            <motion.span
              style={{ width: 6, height: 6, borderRadius: "50%", background: isOpen ? "#2AFFA8" : "#E85D26", flexShrink: 0 }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.6rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: isOpen ? "#2AFFA8" : "#E85D26",
            }}>
              {isOpen ? "Open now · Come visit" : "Currently closed"}
            </span>
          </motion.div>

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.0, delay: 0.22 }}
            style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.6rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.5)", marginBottom: "1.75rem",
            }}
          >
            The Transmission
          </motion.p>

          {/* Headline */}
          <div style={{ marginBottom: "2rem" }}>
            <TextSplit
              text="Send a Signal."
              as="h1"
              delay={0.35}
              stagger={0.07}
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                lineHeight: 0.94,
                letterSpacing: "-0.02em",
                color: "#F4F1E8",
                textShadow: "0 2px 28px rgba(3,3,10,0.95), 0 1px 4px rgba(3,3,10,1)",
              } as React.CSSProperties}
            />
          </div>

          {/* Ornamental rule */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.85 }}
            style={{ width: 36, height: 1, background: "rgba(201,169,110,0.32)", transformOrigin: "center", margin: "0 auto 2rem" }}
          />

          {/* Subtitle */}
          <RevealOnScroll delay={0.9} y={16}>
            <p style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              fontSize: "clamp(1.05rem, 1.7vw, 1.28rem)",
              color: "#A8A4C4", lineHeight: 1.9,
              maxWidth: "44ch", margin: "0 auto",
              textShadow: "0 2px 18px rgba(3,3,10,0.92)",
            }}>
              We read every message. Whether you&apos;re planning a visit,
              inquiring about an object, or proposing something extraordinary —
              reach us here.
            </p>
          </RevealOnScroll>
        </div>

        {/* Smoke signal illustration — full art, intrinsic 1024×1536 */}
        <div
          style={{
            position: "relative",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            aspectRatio: "1024 / 1536",
            background: "#03030A",
            zIndex: 1,
          }}
        >
          <Image
            src="/images/nav/send%20a%20signal.png"
            alt=""
            fill
            sizes="100vw"
            priority
            style={{
              objectFit: "contain",
              objectPosition: "center center",
            }}
          />
        </div>

        {/* Scroll cue */}
        <div style={{ position: "relative", marginTop: "1.75rem", zIndex: 12, display: "flex", justifyContent: "center" }}>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}
          >
            <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, rgba(201,169,110,0.4), transparent)" }} />
            <ChevronDown size={12} style={{ color: "rgba(201,169,110,0.32)" }} />
          </motion.div>
        </div>

        {/* Bottom edge rule */}
        <div style={{
          marginTop: "2rem",
          width: "100%",
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(201,169,110,0.1) 25%, rgba(201,169,110,0.1) 75%, transparent)",
        }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 01 — Contact details + Form
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{ ...H_PAD, paddingTop: "8rem", paddingBottom: "8rem", background: "#0A0A14" }}>

        {/* Section marker */}
        <RevealOnScroll y={18}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "5rem" }}>
            <span style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontSize: "5rem", lineHeight: 1,
              color: "rgba(201,169,110,0.07)", userSelect: "none",
            }}>01</span>
            <div>
              <p style={{
                fontFamily: "var(--font-grotesk)", fontSize: "0.57rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(201,169,110,0.5)", marginBottom: "0.55rem",
              }}>Get in touch</p>
              <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.28)" }} />
            </div>
          </div>
        </RevealOnScroll>

        {/* Two-column grid — stacks on mobile */}
        <div className="grid md:grid-cols-[1fr_1.65fr] gap-16 md:gap-24 items-start">

          {/* ── Left column: details ── */}
          <RevealOnScroll y={22}>
            <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>

              {/* Address */}
              <div>
                <Label>Address</Label>
                <GoldRule />
                <address style={{
                  fontStyle: "italic",
                  fontFamily: "var(--font-garamond)",
                  fontSize: "1.08rem", color: "#8884A8", lineHeight: 2.05,
                }}>
                  12 Derb Moulay Cherif<br />
                  Ancienne Médina<br />
                  Casablanca 20250, Morocco
                </address>
              </div>

              {/* Contact */}
              <div>
                <Label>Contact</Label>
                <GoldRule />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
                  <a href="tel:+212522000000" style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    color: "#8884A8", textDecoration: "none",
                    fontFamily: "var(--font-grotesk)", fontSize: "0.85rem",
                    lineHeight: 1.6, transition: "color 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#F4F1E8")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8884A8")}
                  >
                    <Phone size={11} style={{ color: "#C9A96E", flexShrink: 0 }} />
                    +212 522 000 000
                  </a>
                  <a href="mailto:hello@everwood.ma" style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    color: "#8884A8", textDecoration: "none",
                    fontFamily: "var(--font-grotesk)", fontSize: "0.85rem",
                    lineHeight: 1.6, transition: "color 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#8884A8")}
                  >
                    <Mail size={11} style={{ color: "#C9A96E", flexShrink: 0 }} />
                    hello@everwood.ma
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div>
                <Label>Opening Hours</Label>
                <GoldRule />
                <div>
                  {HOURS.map(({ day, hours }) => (
                    <div key={day} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.9rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}>
                      <span style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.75rem", color: "#3A3A52", lineHeight: 1.6 }}>
                        {day}
                      </span>
                      <span style={{
                        fontFamily: "var(--font-grotesk)", fontSize: "0.75rem", lineHeight: 1.6,
                        color: hours === "Closed" ? "#3A3A52" : "#8884A8",
                        fontFeatureSettings: '"tnum"',
                      }}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map card */}
              <div
                style={{
                  position: "relative", aspectRatio: "4/3",
                  background: "#0D0D1A",
                  border: "1px solid rgba(201,169,110,0.08)",
                  overflow: "hidden", cursor: "crosshair",
                }}
                onMouseEnter={e => {
                  const grid = e.currentTarget.querySelector<HTMLElement>(".map-grid");
                  const pin  = e.currentTarget.querySelector<HTMLElement>(".map-pin");
                  const hint = e.currentTarget.querySelector<HTMLElement>(".map-hint");
                  if (grid) grid.style.opacity = "1";
                  if (pin)  pin.style.opacity  = "1";
                  if (hint) hint.style.opacity = "0";
                }}
                onMouseLeave={e => {
                  const grid = e.currentTarget.querySelector<HTMLElement>(".map-grid");
                  const pin  = e.currentTarget.querySelector<HTMLElement>(".map-pin");
                  const hint = e.currentTarget.querySelector<HTMLElement>(".map-hint");
                  if (grid) grid.style.opacity = "0";
                  if (pin)  pin.style.opacity  = "0";
                  if (hint) hint.style.opacity = "1";
                }}
              >
                <div className="map-grid" style={{
                  position: "absolute", inset: 0, opacity: 0, transition: "opacity 0.45s",
                  backgroundImage: "linear-gradient(rgba(201,169,110,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,0.06) 1px,transparent 1px)",
                  backgroundSize: "30px 30px",
                }} />
                <div className="map-hint" style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.6rem",
                  transition: "opacity 0.3s",
                }}>
                  <MapPin size={17} style={{ color: "#3A3A52" }} />
                  <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A3A52" }}>
                    Hover to reveal
                  </p>
                </div>
                <div className="map-pin" style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 10, height: 10, borderRadius: "50%",
                  background: "#C9A96E",
                  boxShadow: "0 0 0 8px rgba(201,169,110,0.15), 0 0 22px rgba(201,169,110,0.35)",
                  opacity: 0, transition: "opacity 0.45s",
                }} />
              </div>
            </div>
          </RevealOnScroll>

          {/* ── Right column: form ── */}
          <RevealOnScroll delay={0.12} y={22}>

            <p style={{
              fontFamily: "var(--font-grotesk)", fontSize: "0.57rem",
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(201,169,110,0.5)", marginBottom: "3.5rem",
            }}>
              Write to us
            </p>

            <AnimatePresence mode="wait">
              {submitState === "success" ? (

                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "5rem 3rem", textAlign: "center",
                    border: "1px solid rgba(42,255,168,0.15)",
                    background: "rgba(42,255,168,0.03)",
                  }}
                >
                  <div style={{ width: 1, height: 52, background: "linear-gradient(to bottom, #2AFFA8, transparent)", margin: "0 auto 2.25rem" }} />
                  <h3 style={{
                    fontFamily: "var(--font-playfair)", fontSize: "1.9rem",
                    color: "#2AFFA8", marginBottom: "1.1rem", lineHeight: 1.2,
                  }}>
                    Signal received.
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-garamond)", fontStyle: "italic",
                    fontSize: "1.05rem", color: "#8884A8", lineHeight: 1.9,
                  }}>
                    We have your message and will be in touch shortly.
                  </p>
                  <div style={{ width: 1, height: 52, background: "linear-gradient(to top, #2AFFA8, transparent)", margin: "2.25rem auto 0" }} />
                </motion.div>

              ) : (

                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
                >

                  {/* Name */}
                  <div>
                    <label htmlFor="name" style={{
                      display: "block", fontFamily: "var(--font-grotesk)",
                      fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "#3A3A52", marginBottom: "0.9rem",
                    }}>Your Name</label>
                    <input
                      id="name" {...register("name")} autoComplete="name"
                      style={{
                        width: "100%", background: "transparent",
                        border: "none", borderBottom: "1px solid rgba(255,255,255,0.09)",
                        paddingBottom: "0.8rem", paddingTop: "0.15rem",
                        fontSize: "1.05rem", fontFamily: "var(--font-garamond)",
                        color: "#F4F1E8", outline: "none", lineHeight: 1.6,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e  => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
                      onBlur={e   => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.09)")}
                    />
                    {errors.name && (
                      <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.62rem", color: "#E85D26", marginTop: "0.5rem" }}>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" style={{
                      display: "block", fontFamily: "var(--font-grotesk)",
                      fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "#3A3A52", marginBottom: "0.9rem",
                    }}>Email Address</label>
                    <input
                      id="email" type="email" {...register("email")} autoComplete="email"
                      style={{
                        width: "100%", background: "transparent",
                        border: "none", borderBottom: "1px solid rgba(255,255,255,0.09)",
                        paddingBottom: "0.8rem", paddingTop: "0.15rem",
                        fontSize: "1.05rem", fontFamily: "var(--font-garamond)",
                        color: "#F4F1E8", outline: "none", lineHeight: 1.6,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e  => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
                      onBlur={e   => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.09)")}
                    />
                    {errors.email && (
                      <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.62rem", color: "#E85D26", marginTop: "0.5rem" }}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" style={{
                      display: "block", fontFamily: "var(--font-grotesk)",
                      fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "#3A3A52", marginBottom: "0.9rem",
                    }}>Reason for Contact</label>
                    <select
                      id="subject" {...register("subject")}
                      style={{
                        width: "100%", background: "#0A0A14",
                        border: "none", borderBottom: "1px solid rgba(255,255,255,0.09)",
                        paddingBottom: "0.8rem", paddingTop: "0.15rem",
                        fontSize: "1.05rem", fontFamily: "var(--font-garamond)",
                        color: "#F4F1E8", outline: "none", appearance: "none",
                        cursor: "pointer", lineHeight: 1.6,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e  => (e.currentTarget.style.borderBottomColor = "#C9A96E")}
                      onBlur={e   => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.09)")}
                    >
                      <option value="">Select…</option>
                      <option value="visit">Planning a visit</option>
                      <option value="antique">Antique inquiry</option>
                      <option value="event">Event booking</option>
                      <option value="press">Press & media</option>
                      <option value="other">Something else</option>
                    </select>
                    {errors.subject && (
                      <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.62rem", color: "#E85D26", marginTop: "0.5rem" }}>
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div style={{ position: "relative" }}>
                    <label htmlFor="message" style={{
                      display: "block", fontFamily: "var(--font-grotesk)",
                      fontSize: "0.54rem", letterSpacing: "0.22em", textTransform: "uppercase",
                      color: "#3A3A52", marginBottom: "0.9rem",
                    }}>Your Message</label>
                    <textarea
                      id="message" {...register("message")} rows={6} maxLength={500}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.016)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderLeft: "2px solid rgba(201,169,110,0.38)",
                        padding: "1.1rem 1.25rem",
                        fontSize: "1.05rem", fontFamily: "var(--font-garamond)",
                        color: "#F4F1E8", outline: "none",
                        resize: "none", lineHeight: 1.9,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor     = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.borderLeftColor = "#C9A96E";
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor     = "rgba(255,255,255,0.06)";
                        e.currentTarget.style.borderLeftColor = "rgba(201,169,110,0.38)";
                      }}
                    />
                    <span style={{
                      position: "absolute", bottom: "0.75rem", right: "0.85rem",
                      fontFamily: "var(--font-grotesk)", fontSize: "0.58rem",
                      color: charCount > 450 ? "#E85D26" : "#3A3A52",
                      fontFeatureSettings: '"tnum"',
                    }}>
                      {charCount} / 500
                    </span>
                    {errors.message && (
                      <p style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.62rem", color: "#E85D26", marginTop: "0.5rem" }}>
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem", paddingTop: "0.5rem" }}>
                    <motion.button
                      type="submit"
                      disabled={submitState === "loading"}
                      style={{
                        position: "relative", flexShrink: 0,
                        border: submitState === "error"
                          ? "1px solid #E85D26"
                          : "1px solid rgba(201,169,110,0.5)",
                        color: submitState === "error" ? "#E85D26" : "#C9A96E",
                        background: "transparent",
                        fontFamily: "var(--font-grotesk)", fontSize: "0.7rem",
                        letterSpacing: "0.24em", textTransform: "uppercase",
                        padding: submitState === "loading" ? "0" : "1.05rem 2.5rem",
                        width:  submitState === "loading" ? "3.2rem" : "auto",
                        height: submitState === "loading" ? "3.2rem" : "auto",
                        borderRadius: submitState === "loading" ? "50%" : 0,
                        cursor: submitState === "loading" ? "not-allowed" : "pointer",
                        overflow: "hidden", transition: "all 0.3s",
                      }}
                      whileHover={submitState === "idle"
                        ? { backgroundColor: "rgba(201,169,110,0.07)", borderColor: "rgba(201,169,110,0.85)" }
                        : {}}
                      whileTap={submitState === "idle" ? { scale: 0.98 } : {}}
                      animate={submitState === "error" ? { x: [-5, 5, -3, 3, 0] } : {}}
                      transition={{ duration: 0.35 }}
                    >
                      {submitState === "loading" ? (
                        <motion.span style={{
                          display: "block", width: "1.1rem", height: "1.1rem",
                          border: "1px solid rgba(255,255,255,0.15)",
                          borderTopColor: "#C9A96E", borderRadius: "50%", margin: "auto",
                        }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        />
                      ) : submitState === "error" ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                          <X size={13} />Try again
                        </span>
                      ) : (
                        "Send Transmission"
                      )}
                    </motion.button>

                    <p style={{
                      fontFamily: "var(--font-garamond)", fontStyle: "italic",
                      fontSize: "0.88rem", color: "#3A3A52", lineHeight: 1.75,
                    }}>
                      We aim to respond<br />within 48 hours.
                    </p>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>
          </RevealOnScroll>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 02 — FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        ...H_PAD,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        background: "#03030A",
      }}>

        {/* Section marker */}
        <RevealOnScroll y={18} style={{ width: "100%", maxWidth: "700px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
            <span style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontSize: "5rem", lineHeight: 1,
              color: "rgba(201,169,110,0.07)", userSelect: "none",
            }}>02</span>
            <div>
              <p style={{
                fontFamily: "var(--font-grotesk)", fontSize: "0.57rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                color: "rgba(201,169,110,0.5)", marginBottom: "0.55rem",
              }}>Frequently asked</p>
              <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.28)" }} />
            </div>
          </div>
        </RevealOnScroll>

        <div style={{ width: "100%", maxWidth: "700px" }}>
          {FAQS.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 0.06} y={12}>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "grid", gridTemplateColumns: "1.4rem 1fr 1rem",
                    gap: "1rem", alignItems: "center",
                    padding: "1.6rem 0",
                    background: "transparent", border: "none", cursor: "pointer",
                    color: openFaq === i ? "#F4F1E8" : "#8884A8",
                    transition: "color 0.2s",
                  }}
                >
                  <span style={{
                    fontFamily: "var(--font-grotesk)", fontSize: "0.72rem",
                    color: "#C9A96E", fontWeight: 500,
                  }}>&gt;</span>
                  <span style={{
                    fontFamily: "var(--font-garamond)", fontSize: "1.06rem",
                    lineHeight: 1.65,
                  }}>{faq.q}</span>
                  <motion.span
                    style={{ fontFamily: "var(--font-grotesk)", fontSize: "0.82rem", color: "#3A3A52", textAlign: "right", display: "block" }}
                    animate={{ rotate: openFaq === i ? 90 : 0 }}
                    transition={{ duration: 0.22 }}
                  >›</motion.span>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{
                        paddingBottom: "1.75rem", paddingLeft: "2.4rem",
                        fontFamily: "var(--font-garamond)",
                        fontSize: "1rem", color: "#8884A8", lineHeight: 1.95,
                      }}>
                        <span style={{ color: "#2AFFA8", fontSize: "0.8rem", marginRight: "0.4rem" }}>&gt;</span>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 03 — Closing banner
      ══════════════════════════════════════════════════════════════════════ */}
      <section style={{
        ...H_PAD,
        position: "relative",
        paddingTop: "8rem", paddingBottom: "8rem",
        textAlign: "center", overflow: "hidden",
        background: "#0A0A14",
      }}>
        {/* Diagonal texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(201,169,110,0.016) 0px, rgba(201,169,110,0.016) 1px, transparent 1px, transparent 40px)",
        }} aria-hidden="true" />

        <RevealOnScroll y={28}>
          <div style={{ position: "relative", zIndex: 10 }}>
            {/* Section number */}
            <p style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic",
              fontSize: "5rem", lineHeight: 1,
              color: "rgba(201,169,110,0.06)", userSelect: "none",
              marginBottom: "1.5rem",
            }}>03</p>

            {/* Vertical gold drip */}
            <div style={{
              width: 1, height: 64,
              background: "linear-gradient(to bottom, #C9A96E, transparent)",
              margin: "0 auto 2.75rem",
            }} />

            <h2 style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              color: "#F4F1E8", lineHeight: 1.15,
              letterSpacing: "-0.01em", marginBottom: "1.5rem",
            }}>
              The door is always open.
            </h2>

            <p style={{
              fontFamily: "var(--font-garamond)", fontStyle: "italic",
              fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
              color: "#8884A8", lineHeight: 1.95,
              maxWidth: "40ch", margin: "0 auto 3.75rem",
            }}>
              Come for the objects. Stay for the music.<br />
              Leave with a story.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <motion.a
                href="/"
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(201,169,110,0.5)", color: "#C9A96E",
                  padding: "1.05rem 2.5rem",
                  fontFamily: "var(--font-grotesk)", fontSize: "0.7rem",
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  textDecoration: "none", transition: "all 0.25s",
                }}
                whileHover={{ backgroundColor: "rgba(201,169,110,0.08)", borderColor: "rgba(201,169,110,0.9)" }}
                whileTap={{ scale: 0.98 }}
              >
                Upcoming Events
              </motion.a>
              <motion.a
                href="/antiques"
                style={{
                  display: "inline-block",
                  border: "1px solid rgba(255,255,255,0.1)", color: "#8884A8",
                  padding: "1.05rem 2.5rem",
                  fontFamily: "var(--font-grotesk)", fontSize: "0.7rem",
                  letterSpacing: "0.22em", textTransform: "uppercase",
                  textDecoration: "none", transition: "all 0.25s",
                }}
                whileHover={{ borderColor: "rgba(255,255,255,0.3)", color: "#F4F1E8" }}
                whileTap={{ scale: 0.98 }}
              >
                Browse the Cabinet
              </motion.a>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />
    </div>
  );
}
