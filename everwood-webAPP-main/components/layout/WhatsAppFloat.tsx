"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

const PHONE = "212600000000"; // ← replace with real number (no + or spaces)

const GREETINGS = [
  "Hello Everwood! 🌿 I came across your space and I'd love to know more.",
  "Hi there! 👋 I heard about Everwood — what's on this week?",
  "Bonjour Everwood! 🎶 Je suis intéressé(e) par votre espace. Pouvez-vous me donner plus d'infos?",
  "Hey! I just visited your site and Everwood sounds amazing. Can we chat? ✨",
  "Salam! 🌙 I'd love to visit Everwood — could you tell me about upcoming events?",
  "Hello! I'm interested in booking a workshop at Everwood. What's available? 🎨",
  "Hi Everwood! 🕯️ Your space looks incredible. I'd love to know your opening hours.",
  "Hey there! I'm thinking of visiting Everwood — any events happening soon? 🎵",
];

function randomGreeting() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WhatsAppIcon = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const DoubleCheckIcon = () => (
  <svg viewBox="0 0 16 11" width="16" height="11" fill="none" aria-hidden="true">
    <path d="M1 5.5l3.5 3.5L11 2" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 5.5l3.5 3.5L15 2" stroke="#53BDEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function WhatsAppFloat() {
  const [open, setOpen]       = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent]       = useState(false);
  const [sentTime, setSentTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pick a fresh greeting each time the popup opens
  const handleOpen = useCallback(() => {
    setGreeting(randomGreeting());
    setMessage("");
    setSent(false);
    setSentTime("");
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  // Auto-resize textarea
  useEffect(() => {
    if (!open) return;
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
    }
  }, [message, open]);

  // Focus textarea when popup opens
  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  const handleSend = useCallback(() => {
    const text = message.trim() || greeting;
    setSent(true);
    setSentTime(formatTime(new Date()));
    setTimeout(() => {
      const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }, 600);
  }, [message, greeting]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      {/* ── Popup ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="wa-popup"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            style={{
              position: "fixed",
              bottom: "5.5rem",
              right: "clamp(1.25rem, 4vw, 2.5rem)",
              width: "min(360px, calc(100vw - 2.5rem))",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)",
              zIndex: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ── Header ── */}
            <div style={{
              background: "#075E54",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}>
              {/* Avatar */}
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#128C7E",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <WhatsAppIcon size={20} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-grotesk)",
                  fontWeight: 600, fontSize: "0.88rem",
                  color: "#fff", lineHeight: 1.2,
                }}>Everwood</div>
                <div style={{
                  fontFamily: "var(--font-grotesk)",
                  fontSize: "0.68rem", color: "rgba(255,255,255,0.7)",
                  marginTop: 1,
                }}>
                  Typically replies instantly
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close chat"
                style={{
                  background: "transparent", border: "none",
                  color: "rgba(255,255,255,0.92)", cursor: "pointer",
                  minWidth: 48,
                  minHeight: 48,
                  padding: "0.25rem",
                  lineHeight: 0,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                }}
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {/* ── Chat body ── */}
            <div style={{
              background: "#ECE5DD",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              padding: "1rem 0.85rem",
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}>
              {/* Date chip */}
              <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
                <span style={{
                  background: "rgba(0,0,0,0.12)",
                  padding: "0.2rem 0.7rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.6rem",
                  fontFamily: "var(--font-grotesk)",
                  color: "rgba(0,0,0,0.5)",
                  letterSpacing: "0.04em",
                }}>TODAY</span>
              </div>

              {/* Greeting bubble (from Everwood) */}
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "#fff",
                  borderRadius: "0 0.75rem 0.75rem 0.75rem",
                  padding: "0.55rem 0.75rem 0.4rem",
                  maxWidth: "85%",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                  position: "relative",
                }}>
                  <p style={{
                    fontFamily: "var(--font-grotesk)",
                    fontSize: "0.82rem", color: "#111",
                    lineHeight: 1.55, margin: 0,
                  }}>
                    👋 Hello! Welcome to Everwood.<br />
                    How can we help you today?
                  </p>
                  <div style={{
                    textAlign: "right", marginTop: "0.2rem",
                    fontSize: "0.58rem", color: "rgba(0,0,0,0.38)",
                    fontFamily: "var(--font-grotesk)",
                  }}>
                    {formatTime(new Date())}
                  </div>
                </div>
              </div>

              {/* Sent message bubble (user) */}
              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <div style={{
                      background: "#DCF8C6",
                      borderRadius: "0.75rem 0 0.75rem 0.75rem",
                      padding: "0.55rem 0.75rem 0.4rem",
                      maxWidth: "85%",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-grotesk)",
                        fontSize: "0.82rem", color: "#111",
                        lineHeight: 1.55, margin: 0,
                        whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>
                        {message.trim() || greeting}
                      </p>
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "flex-end",
                        gap: "0.25rem", marginTop: "0.2rem",
                      }}>
                        <span style={{
                          fontSize: "0.58rem", color: "rgba(0,0,0,0.38)",
                          fontFamily: "var(--font-grotesk)",
                        }}>{sentTime}</span>
                        <DoubleCheckIcon />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Input bar ── */}
            <div style={{
              background: "#F0F0F0",
              padding: "0.6rem 0.75rem",
              display: "flex",
              alignItems: "flex-end",
              gap: "0.5rem",
            }}>
              <div style={{
                flex: 1,
                background: "#fff",
                borderRadius: "1.5rem",
                padding: "0.5rem 0.85rem",
                display: "flex", alignItems: "flex-end",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
              }}>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={greeting}
                  rows={1}
                  disabled={sent}
                  style={{
                    width: "100%", border: "none", outline: "none",
                    resize: "none", background: "transparent",
                    fontFamily: "var(--font-grotesk)", fontSize: "0.82rem",
                    color: "#111", lineHeight: 1.5,
                    overflow: "hidden", minHeight: 22,
                  }}
                />
              </div>

              {/* Send button */}
              <motion.button
                type="button"
                onClick={handleSend}
                disabled={sent}
                aria-label="Send message on WhatsApp"
                whileHover={sent ? {} : { scale: 1.08 }}
                whileTap={sent ? {} : { scale: 0.92 }}
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: sent ? "#8BC34A" : "#25D366",
                  border: "none", cursor: sent ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", flexShrink: 0,
                  transition: "background 0.3s",
                }}
              >
                <Send size={17} style={{ transform: "translateX(1px)" }} />
              </motion.button>
            </div>

            {/* ── Open in WhatsApp link ── */}
            <div style={{
              background: "#F0F0F0",
              borderTop: "1px solid rgba(0,0,0,0.07)",
              padding: "0.45rem 0.75rem",
              textAlign: "center",
            }}>
              <a
                href={`https://wa.me/${PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-grotesk)",
                  fontSize: "0.6rem", letterSpacing: "0.04em",
                  color: "#075E54", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                }}
              >
                <WhatsAppIcon size={11} />
                Open in WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB button ──────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed",
        bottom: "5.5rem",
        right: "clamp(1.25rem, 4vw, 2.5rem)",
        zIndex: 400,
        pointerEvents: open ? "none" : "all",
      }}>
        <AnimatePresence>
          {!open && (
            <motion.button
              type="button"
              key="wa-fab"
              onClick={handleOpen}
              aria-label="Chat with us on WhatsApp"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 22, delay: open ? 0 : 1.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#25D366", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                position: "relative",
              }}
            >
              {/* pulse ring */}
              <motion.span
                aria-hidden="true"
                animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "rgba(37,211,102,0.45)",
                  pointerEvents: "none",
                }}
              />
              <WhatsAppIcon size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
