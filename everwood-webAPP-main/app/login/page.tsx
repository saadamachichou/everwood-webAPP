"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, margin: 0, zIndex: 1, pointerEvents: "none",
        opacity: 0.055,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundSize: "200px",
      }}
    />
  );
}

function BotanicalSilhouette({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="360" height="540" viewBox="0 0 360 540" fill="none"
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 1 }}
    >
      <path d="M180 540 L180 60" stroke="#4A6741" strokeWidth="2.5" opacity="0.35" />
      {[80, 140, 200, 260, 320, 380, 440].map((y, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const w = 55 + (i % 3) * 12;
        return (
          <g key={i}>
            <path
              d={`M180 ${y} Q${180 + side * w} ${y - 28} ${180 + side * (w + 20)} ${y + 12} Q${180 + side * w * 0.6} ${y + 32} 180 ${y}`}
              fill="#3D5A35" opacity={0.18 + (i % 3) * 0.04}
            />
            <path
              d={`M180 ${y} Q${180 + side * (w + 22)} ${y + 14} ${180 + side * w} ${y + 14}`}
              stroke="#4A6741" strokeWidth="0.8" fill="none" opacity="0.25"
            />
          </g>
        );
      })}
    </svg>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(14,24,16,0.55)",
  border: "1px solid rgba(201,169,110,0.18)",
  borderRadius: 6,
  color: "#EDE8DA",
  fontFamily: "'var(--font-dm-mono)', monospace",
  fontSize: "0.82rem",
  padding: "0.85rem 1rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  letterSpacing: "0.02em",
  boxSizing: "border-box",
};

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        const message = json?.error?.message ?? "Login failed. Please try again.";
        setError(message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setDone(true);
      // Short delay to show success state before redirect
      setTimeout(() => router.push("/studio"), 600);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  const focusStyle = (name: string): React.CSSProperties => ({
    ...inputBase,
    borderColor: focused === name ? "rgba(201,169,110,0.55)" : "rgba(201,169,110,0.18)",
    boxShadow:   focused === name ? "0 0 0 3px rgba(201,169,110,0.07)" : "none",
  });

  return (
    <div style={{
      minHeight: "100dvh",
      background: "radial-gradient(ellipse 130% 90% at 50% 0%, #1E3028 0%, #142018 40%, #090F0A 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "2rem",
    }}>
      <GrainOverlay />

      {/* Lamp glow — top center */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: "radial-gradient(ellipse 60% 70% at 50% 0%, rgba(212,148,58,0.12) 0%, transparent 65%)", zIndex: 0, pointerEvents: "none" }} />

      {/* Side botanicals */}
      <div aria-hidden="true" style={{ position: "absolute", left: -60, top: "50%", transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
        <BotanicalSilhouette />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", right: -60, top: "50%", transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
        <BotanicalSilhouette flip />
      </div>

      {/* Vignette edges */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.55) 100%)", zIndex: 1, pointerEvents: "none" }} />

      {/* Back to site */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ position: "fixed", top: "1.6rem", left: "1.8rem", zIndex: 20 }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "rgba(201,169,110,0.55)", textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,110,0.55)")}
        >
          <ArrowLeft size={11} />
          Back to Everwood
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative", zIndex: 10,
          width: "100%", maxWidth: 400,
          background: "rgba(18,28,20,0.72)",
          border: "1px solid rgba(201,169,110,0.14)",
          borderRadius: 16,
          padding: "2.8rem 2.6rem 2.6rem",
          backdropFilter: "blur(28px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,169,110,0.06) inset",
        }}
      >
        {/* Inner glow top edge */}
        <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)", borderRadius: 1 }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}
          >
            {/* Monogram ring */}
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: "1px solid rgba(201,169,110,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(201,169,110,0.06)",
            }}>
              <span style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "1.6rem", fontWeight: 300,
                color: "#C9A96E",
                lineHeight: 1,
              }}>E</span>
            </div>

            <div>
              <p style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.55rem", letterSpacing: "0.45em",
                textTransform: "uppercase", color: "rgba(201,169,110,0.65)",
                marginBottom: 4,
              }}>Everwood Studio</p>
              {/* Thin rule */}
              <div style={{ width: "100%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent)" }} />
            </div>
          </motion.div>
        </div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ marginBottom: "2rem", textAlign: "center" }}
        >
          <h1 style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic", fontWeight: 300,
            fontSize: "1.9rem", color: "#EDE8DA",
            lineHeight: 1.1, margin: 0, marginBottom: 6,
          }}>
            Welcome back.
          </h1>
          <p style={{
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.6rem", letterSpacing: "0.08em",
            color: "rgba(237,232,218,0.35)",
          }}>
            Sign in to your Everwood account
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {/* Email */}
          <div>
            <label style={{
              display: "block", fontFamily: "var(--font-dm-mono)",
              fontSize: "0.58rem", letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(237,232,218,0.4)",
              marginBottom: 7,
            }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                ...focusStyle("email"),
                "::placeholder": { color: "rgba(237,232,218,0.2)" },
              } as React.CSSProperties}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <label style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.58rem", letterSpacing: "0.18em",
                textTransform: "uppercase", color: "rgba(237,232,218,0.4)",
              }}>
                Password
              </label>
              <Link href="#" style={{
                fontFamily: "var(--font-dm-mono)",
                fontSize: "0.52rem", letterSpacing: "0.1em",
                color: "rgba(201,169,110,0.45)", textDecoration: "none",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,110,0.45)")}
              >
                Forgot?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...focusStyle("password"), paddingRight: "2.8rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: "0.85rem", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(201,169,110,0.4)", padding: 0, margin: 0,
                  display: "flex", alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A96E")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,110,0.4)")}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.6rem", color: "#F04438", letterSpacing: "0.04em", margin: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading || done}
            whileHover={!loading && !done ? { backgroundColor: "rgba(201,169,110,0.12)" } : {}}
            whileTap={!loading && !done ? { scale: 0.98 } : {}}
            style={{
              marginTop: 4,
              width: "100%",
              padding: "0.9rem",
              background: done ? "rgba(61,214,140,0.1)" : "rgba(201,169,110,0.07)",
              border: `1px solid ${done ? "rgba(61,214,140,0.35)" : "rgba(201,169,110,0.35)"}`,
              borderRadius: 6, cursor: loading || done ? "default" : "pointer",
              color: done ? "#3DD68C" : "#C9A96E",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "0.62rem", letterSpacing: "0.22em",
              textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "background 0.2s, border-color 0.2s, color 0.3s",
              margin: 0,
            }}
          >
            {loading ? (
              <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Loader2 size={13} /></motion.span> Signing in…</>
            ) : done ? (
              "Signed in — redirecting"
            ) : (
              "Sign in to Studio"
            )}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.6rem 0 1.4rem" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.1)" }} />
          <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem", letterSpacing: "0.18em", color: "rgba(237,232,218,0.2)", textTransform: "uppercase" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.1)" }} />
        </div>

        {/* Browse as guest */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-dm-mono)", fontSize: "0.58rem",
              letterSpacing: "0.12em", color: "rgba(237,232,218,0.3)",
              textDecoration: "none", transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,232,218,0.65)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,232,218,0.3)")}
          >
            Continue browsing Everwood →
          </Link>
        </div>

        {/* Bottom inset glow */}
        <div style={{ position: "absolute", bottom: 0, left: "30%", right: "30%", height: 1, background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }} />
      </motion.div>

      {/* Footer text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: "fixed", bottom: "1.4rem", left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-dm-mono)", fontSize: "0.5rem",
          letterSpacing: "0.45em", textTransform: "uppercase",
          color: "#C9A96E", whiteSpace: "nowrap", zIndex: 10,
        }}
      >
        Everwood · Est. 2024
      </motion.p>
    </div>
  );
}
