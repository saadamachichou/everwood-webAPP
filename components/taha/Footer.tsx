"use client"

import { useContext, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Clock, ArrowUp } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import MagneticButton from './MagneticButton'
import { ease } from '@/lib/taha/animations'
import { cn } from '@/lib/utils'

const serviceLinks = [
  { fr: 'Design Sonore',       en: 'Sound Design'         },
  { fr: 'Composition',         en: 'Composition'          },
  { fr: 'Post-Production',     en: 'Post-Production'      },
  { fr: 'Sound Branding',      en: 'Sound Branding'       },
  { fr: 'Installation AV',     en: 'AV Installation'      },
  { fr: 'Étalonnage',          en: 'Color Grading'        },
]

const quickLinks = [
  { href: '#services',  fr: 'Services',  en: 'Services'  },
  { href: '#portfolio', fr: 'Portfolio', en: 'Portfolio' },
  { href: '#processus', fr: 'Processus', en: 'Process'   },
  { href: '#contact',   fr: 'Contact',   en: 'Contact'   },
]

const socialLinks = [
  { label: 'Instagram', handle: '@taha.studio', href: '#' },
  { label: 'LinkedIn',  handle: 'Taha Studio',  href: '#' },
  { label: 'SoundCloud',handle: 'taha-sound',   href: '#' },
  { label: 'GitHub',    handle: 'taha-dev',     href: '#' },
]

export default function Footer() {
  const { lang, t, toggle } = useContext(I18nContext)
  const year = new Date().getFullYear()

  const ctaRef  = useRef(null)
  const mainRef = useRef(null)
  const ctaInView  = useInView(ctaRef,  { once: true, margin: '-80px' })
  const mainInView = useInView(mainRef, { once: true, margin: '-40px' })
  const shouldReduceMotion = useReducedMotion()

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <footer className="relative bg-[#0A0A0A] overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          PRE-FOOTER — Full-width CTA slab
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden border-t border-[rgba(255,255,255,0.06)]"
      >
        {/* Big ambient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(26,111,255,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 text-center flex flex-col items-center py-24">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="w-8 h-px bg-[#1A6FFF]" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-[#1A6FFF] font-[var(--font-mono)]">
              {t("Démarrer un projet", "Start a project")}
            </span>
            <span className="w-8 h-px bg-[#1A6FFF]" />
          </motion.div>

          {/* Giant headline */}
          <div className="overflow-hidden pb-[0.1em]">
            <motion.h2
              initial={{ y: '110%', opacity: 0 }}
              animate={ctaInView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
              className="font-[var(--font-syne)] font-extrabold text-white leading-[1] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)' }}
            >
              {t("Travaillons", "Let's create")}
            </motion.h2>
          </div>
          <div className="overflow-hidden pb-[0.25em] mb-10">
            <motion.h2
              initial={{ y: '110%', opacity: 0 }}
              animate={ctaInView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.9, ease, delay: 0.14 }}
              className="font-[var(--font-syne)] font-extrabold leading-[1] tracking-tight"
              style={{
                fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                background: 'linear-gradient(135deg, #1A6FFF 0%, #00F5D4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t("ensemble.", "something great.")}
            </motion.h2>
          </div>

          {/* Subtext + actions */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease, delay: 0.28 }}
            className="text-[#8888AA] text-base md:text-lg max-w-lg mx-auto mb-10 leading-[1.75]"
          >
            {t(
              "Vous avez un projet sonore ou audiovisuel en tête ? Parlons-en — je réponds sous 24h.",
              "Have a sound or audiovisual project in mind? Let's talk — I reply within 24h.",
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease, delay: 0.36 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticButton
              variant="primary"
              className="text-[0.85rem] tracking-[0.06em] py-4 px-9"
              onClick={() => scrollTo('#contact')}
            >
              {t("Démarrer un projet", "Start a project")}
              <ArrowUpRight size={15} className="ml-1" />
            </MagneticButton>

            <a
              href="mailto:hello@taha.studio"
              className="group inline-flex items-center gap-2 text-[#8888AA] hover:text-white transition-colors duration-300 text-sm font-medium"
            >
              <Mail size={15} />
              hello@taha.studio
              <ArrowUpRight
                size={13}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>
          </motion.div>

          {/* Availability chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-12"
          >
            {[
              { icon: Clock,  label: t("Réponse sous 24h", "Reply within 24h") },
              { icon: MapPin, label: t("Casablanca · Remote", "Casablanca · Remote") },
              {
                icon: null,
                label: (
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5D4] opacity-60" />
                      <span className="relative rounded-full h-1.5 w-1.5 bg-[#00F5D4]" />
                    </span>
                    {t("Disponible", "Available")}
                  </span>
                ),
              },
            ].map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-5 py-2 text-[0.72rem] text-[#8888AA] min-w-[10rem] h-9 whitespace-nowrap"
              >
                {chip.icon && <chip.icon size={12} className="text-[#555568] flex-shrink-0" />}
                {chip.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MAIN FOOTER GRID
      ═══════════════════════════════════════════════════════════ */}
      <section
        ref={mainRef}
        className="border-t border-[rgba(255,255,255,0.06)] relative"
      >
        {/* Giant ghost brand text */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-x-0 top-0 flex justify-center overflow-hidden"
        >
          <span
            className="font-[var(--font-syne)] font-extrabold text-white leading-none tracking-tight"
            style={{
              fontSize: 'clamp(6rem, 22vw, 18rem)',
              opacity: 0.025,
              marginTop: '-0.12em',
            }}
          >
            TAHA
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-10">
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-16">

            {/* ── Col 1: Brand ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={mainInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0 }}
              className="col-span-2 md:col-span-1"
            >
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-2.5 mb-5 focus-visible:outline-none"
                aria-label="Retour en haut"
              >
                <span className="font-[var(--font-syne)] font-extrabold text-xl text-white group-hover:text-[#1A6FFF] transition-colors duration-300 leading-none">
                  TAHA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A6FFF] group-hover:bg-[#00F5D4] transition-colors duration-300" />
              </button>

              <p className="text-[0.8rem] text-[#8888AA] leading-relaxed mb-6 max-w-[200px]">
                {t(labels.footer.tagline.fr, labels.footer.tagline.en)}
              </p>

              {/* Email link */}
              <a
                href="mailto:hello@taha.studio"
                className="group inline-flex items-center gap-1.5 text-[0.75rem] text-[#555568] hover:text-[#1A6FFF] transition-colors duration-300 font-[var(--font-mono)]"
              >
                hello@taha.studio
                <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>

            {/* ── Col 2: Services ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={mainInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.07 }}
            >
              <h3 className="text-[0.62rem] font-bold tracking-[0.25em] uppercase text-[#555568] font-[var(--font-mono)] mb-5">
                {t("Services", "Services")}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {serviceLinks.map((s) => (
                  <li key={s.fr}>
                    <button
                      onClick={() => scrollTo('#services')}
                      className="group flex items-center gap-1.5 text-[0.78rem] text-[#8888AA] hover:text-white transition-colors duration-300 focus-visible:outline-none"
                    >
                      <span className="w-1 h-px bg-[#444458] group-hover:bg-[#1A6FFF] group-hover:w-3 transition-all duration-300" />
                      {t(s.fr, s.en)}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 3: Navigation ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={mainInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.14 }}
            >
              <h3 className="text-[0.62rem] font-bold tracking-[0.25em] uppercase text-[#555568] font-[var(--font-mono)] mb-5">
                {t("Navigation", "Navigation")}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <button
                      onClick={() => scrollTo(l.href)}
                      className="group flex items-center gap-1.5 text-[0.78rem] text-[#8888AA] hover:text-white transition-colors duration-300 focus-visible:outline-none"
                    >
                      <span className="w-1 h-px bg-[#444458] group-hover:bg-[#1A6FFF] group-hover:w-3 transition-all duration-300" />
                      {t(l.fr, l.en)}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Col 4: Social ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={mainInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease, delay: 0.21 }}
            >
              <h3 className="text-[0.62rem] font-bold tracking-[0.25em] uppercase text-[#555568] font-[var(--font-mono)] mb-5">
                {t("Réseaux", "Social")}
              </h3>
              <ul className="flex flex-col gap-2.5" role="list">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 text-[0.78rem] text-[#8888AA] hover:text-white transition-colors duration-300 focus-visible:outline-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-px bg-[#444458] group-hover:bg-[#1A6FFF] group-hover:w-3 transition-all duration-300" />
                        {s.label}
                      </span>
                      <span className="text-[0.65rem] text-[#444458] group-hover:text-[#1A6FFF] transition-colors duration-300 font-[var(--font-mono)]">
                        {s.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ── Divider ── */}
          <div
            className="h-px w-full mb-8"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent)' }}
          />

          {/* ── Bottom bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Left: copyright */}
            <p className="text-[0.67rem] text-[#3a3a4a] font-[var(--font-mono)] tracking-wide">
              © {year} TAHA·STUDIO — {t(labels.footer.rights.fr, labels.footer.rights.en)}
            </p>

            {/* Centre: made with */}
            <p className="hidden md:block text-[0.67rem] text-[#3a3a4a] font-[var(--font-mono)] tracking-wide order-last sm:order-none">
              {t("Conçu & développé avec passion", "Designed & built with passion")}
            </p>

            {/* Right: lang + back to top */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggle}
                aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
                className="text-[0.67rem] font-medium text-[#3a3a4a] hover:text-[#8888AA] transition-colors duration-300 font-[var(--font-mono)] focus-visible:outline-none"
              >
                <span className={cn('transition-colors', lang === 'fr' && 'text-[#1A6FFF]')}>FR</span>
                <span className="mx-1 opacity-30">/</span>
                <span className={cn('transition-colors', lang === 'en' && 'text-[#1A6FFF]')}>EN</span>
              </button>

              <div className="w-px h-3 bg-[rgba(255,255,255,0.08)]" />

              {/* Back to top */}
              <button
                onClick={scrollToTop}
                aria-label={t("Retour en haut", "Back to top")}
                className="group inline-flex items-center gap-1.5 text-[0.67rem] text-[#3a3a4a] hover:text-white transition-colors duration-300 font-[var(--font-mono)] focus-visible:outline-none"
              >
                {t("Haut de page", "Top")}
                <span className="w-5 h-5 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:border-[rgba(26,111,255,0.5)] group-hover:bg-[rgba(26,111,255,0.08)] transition-all duration-300">
                  <ArrowUp size={9} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
