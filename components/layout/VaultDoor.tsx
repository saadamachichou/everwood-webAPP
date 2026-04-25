"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";

const IgIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none"/>
  </svg>
);

const FbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 8.5c-1-2.5-3.2-4-6-4-4.2 0-7 3-7 8 0 3.5 2 6 5.5 6 2.8 0 4.8-1.8 4.8-4.5 0-2.5-1.7-4-4-4-1.8 0-3 1-3 2.5"/>
    <path d="M13 4.5c2.3.3 4 1.3 5 3"/>
  </svg>
);

const SOCIAL = [
  { href: "https://instagram.com",    label: "Instagram", Icon: IgIcon },
  { href: "https://facebook.com",     label: "Facebook",  Icon: FbIcon },
  { href: "mailto:hello@everwood.ma", label: "Email",     Icon: () => <Mail size={18} aria-hidden="true" /> },
  { href: "https://threads.net",      label: "Threads",   Icon: ThreadsIcon },
];

const links = [
  { href: "/events",    label: "The Stage",        tag: "Events"    },
  { href: "/antiques",  label: "The Cabinet",      tag: "Antiques"  },
  { href: "/gallery",   label: "The Archive",      tag: "Gallery"   },
  { href: "/workshops", label: "The Atelier",      tag: "Workshops" },
  { href: "/menu",      label: "The Coffee Room",  tag: "Menu"      },
  { href: "/about",     label: "The Archaeology",  tag: "About"     },
  { href: "/contact",   label: "The Transmission", tag: "Contact"   },
];

interface Props {
  onClose: () => void;
  pathname: string;
}

export default function VaultDoor({ onClose, pathname }: Props) {
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const activeSlug = hoveredHref ? hoveredHref.slice(1) : null;

  return (
    <motion.div
      className="fixed inset-0 z-[800] bg-[var(--color-obsidian)] flex items-center justify-center overflow-hidden"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-10 flex items-center gap-2 text-[var(--color-mist)] text-[0.75rem] tracking-[0.15em] uppercase bg-transparent border-none transition-colors duration-200 hover:text-[var(--color-gold)]"
        aria-label="Close navigation"
      >
        <X size={16} />
        Close
      </button>

      {/* Illustration preview — right panel */}
      <AnimatePresence mode="wait">
        {activeSlug && (
          <motion.div
            key={activeSlug}
            className="absolute right-[8%] top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
            initial={{ opacity: 0, x: 32, rotate: 4, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  rotate: 0, scale: 1   }}
            exit={{    opacity: 0, x: -16, rotate: -2, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={`/images/nav/${activeSlug}.png`}
              alt=""
              aria-hidden="true"
              style={{
                width: 280,
                height: "auto",
                filter: "invert(1) contrast(1.15) sepia(0.25) saturate(1.4) hue-rotate(5deg)",
                mixBlendMode: "screen",
                opacity: 0.9,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav links */}
      <motion.nav
        className="flex flex-col gap-4 px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {links.map(({ href, label, tag }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
          >
            <Link
              href={href}
              onClick={onClose}
              onMouseEnter={() => setHoveredHref(href)}
              onMouseLeave={() => setHoveredHref(null)}
              className={`group relative inline-flex items-center gap-3 font-[family-name:var(--font-playfair)] text-[clamp(1.25rem,2.8vw,2.2rem)] leading-none no-underline transition-colors duration-200 ${
                pathname === href ? "text-[var(--color-gold)]" : "text-[var(--color-ivory)] hover:text-[var(--color-gold)]"
              }`}
            >
              {/* Small inline sketch */}
              <span
                className="hidden sm:block flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ width: 36, height: 36 }}
              >
                <img
                  src={`/images/nav/${href.slice(1)}.png`}
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: "contain",
                    filter: "invert(1) contrast(1.15) sepia(0.4) saturate(1.8) hue-rotate(5deg)",
                    mixBlendMode: "screen",
                  }}
                />
              </span>

              {label}

              <span className="font-[family-name:var(--font-grotesk)] text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-mist)] align-middle self-end mb-[0.5em]">
                {tag}
              </span>
              <span className="absolute -bottom-1 left-0 h-[1px] bg-[var(--color-gold)] w-0 transition-all duration-700 ease-[var(--ease-spring)] group-hover:w-full" />
            </Link>
          </motion.div>
        ))}

        {/* Social links */}
        <div className="flex items-center gap-3 mt-8 pt-8 border-t border-white/5">
          {SOCIAL.map(({ href, label, Icon }, i) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                width: 44, height: 44,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                color: "var(--color-mist)",
                textDecoration: "none",
              }}
              whileHover={{ borderColor: "rgba(201,169,110,0.55)", color: "var(--color-gold)", scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ delay: 0.55 + i * 0.06, duration: 0.35, type: "spring", stiffness: 380, damping: 22 }}
            >
              <Icon />
            </motion.a>
          ))}
        </div>
      </motion.nav>
    </motion.div>
  );
}
