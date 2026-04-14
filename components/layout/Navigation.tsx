"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import VaultDoor from "./VaultDoor";

const NAV_ITEMS = [
  { href: "/events",    label: "Events"    },
  { href: "/antiques",  label: "Antiques"  },
  { href: "/gallery",   label: "Gallery"   },
  { href: "/workshops", label: "Workshops" },
  { href: "/menu",      label: "Menu"      },
  { href: "/about",     label: "About"     },
  { href: "/contact",   label: "Contact"   },
] as const;

export default function Navigation() {
  const [scrolled,  setScrolled]  = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-10 py-4 transition-all duration-300 ${
          scrolled ? "bg-[rgba(3,3,10,0.88)] backdrop-blur-xl" : ""
        }`}
      >
        {/* Logo */}
        <Link href="/" aria-label="Everwood — home" className="no-underline block">
          <img
            src="/images/nav/logo.png"
            alt="Everwood"
            style={{ height: 140, width: "auto", display: "block" }}
            className="transition-opacity duration-300 opacity-90 hover:opacity-100"
          />
        </Link>

        {/* Page links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;
            const slug = href.slice(1);
            return (
              <Link
                key={href}
                href={href}
                className={`group flex flex-col items-center gap-[3px] no-underline transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-mist)] hover:text-[var(--color-ivory)]"
                }`}
              >
                <span className="relative flex items-center justify-center w-9 h-8 overflow-visible">
                  <img
                    src={`/images/nav/${slug}.png`}
                    alt=""
                    aria-hidden="true"
                    className={`transition-[opacity,filter] duration-200 group-hover:opacity-100 ${
                      isActive ? "opacity-100" : "opacity-[0.75]"
                    }`}
                    style={{
                      height: 36,
                      width: "auto",
                      maxWidth: 44,
                      objectFit: "contain",
                      filter: isActive
                        ? "invert(1) sepia(0.6) saturate(1.8) hue-rotate(5deg) contrast(1.1)"
                        : "invert(1) contrast(1.1)",
                      mixBlendMode: "screen",
                    }}
                  />
                </span>
                <span className="font-[family-name:var(--font-grotesk)] text-[0.62rem] tracking-[0.15em] uppercase leading-none">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setVaultOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={vaultOpen}
          className="flex flex-col gap-[5px] p-1 bg-transparent border-none group"
        >
          {[28, 20, 24].map((w, i) => (
            <span
              key={i}
              className="block h-[1px] bg-[var(--color-ivory)] transition-all duration-300 group-hover:!w-7 group-hover:bg-[var(--color-gold)]"
              style={{ width: w }}
            />
          ))}
        </button>
      </motion.nav>

      <AnimatePresence>
        {vaultOpen && <VaultDoor onClose={() => setVaultOpen(false)} pathname={pathname} />}
      </AnimatePresence>
    </>
  );
}
