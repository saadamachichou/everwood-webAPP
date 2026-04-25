"use client"

import { useState, useEffect, useContext, useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import MagneticButton from './MagneticButton'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#services',  num: '01', fr: 'Services',  en: 'Services'  },
  { href: '#portfolio', num: '02', fr: 'Portfolio',  en: 'Portfolio' },
  { href: '#processus', num: '03', fr: 'Processus',  en: 'Process'   },
  { href: '#contact',   num: '04', fr: 'Contact',    en: 'Contact'   },
]

export default function Navigation() {
  const { lang, t, toggle } = useContext(I18nContext)
  const [hidden, setHidden]           = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activeId, setActiveId]       = useState('')
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  /* ── scroll state: hide on scroll down, show on scroll up ── */
  const scrollProgress = useMotionValue(0)
  const smoothProgress = useSpring(scrollProgress, { stiffness: 200, damping: 30 })

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y   = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      // hide when scrolling down past 80px, show when scrolling up
      if (y > 80 && y > lastY) setHidden(true)
      else setHidden(false)
      lastY = y
      scrollProgress.set(max > 0 ? y / max : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollProgress])

  /* ── active section via IntersectionObserver ── */
  useEffect(() => {
    const ids = ['hero', 'services', 'portfolio', 'processus', 'contact']
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 bg-transparent transition-transform duration-300',
          hidden ? '-translate-y-full' : 'translate-y-0',
        )}
        role="banner"
      >
        {/* ── inner nav ── */}
        <nav
          className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-16 md:h-[4.5rem]"
          aria-label="Navigation principale"
        >

          {/* Logo */}
          <button
            onClick={() => scrollTo('#hero')}
            aria-label="Retour en haut"
            className="group relative flex items-center gap-2.5 focus-visible:outline-none"
          >
            {/* Wordmark */}
            <span className="font-[var(--font-syne)] font-extrabold text-[1.25rem] leading-none tracking-tight text-white group-hover:text-[#1A6FFF] transition-colors duration-300">
              TAHA
            </span>

            {/* Animated glyph */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A6FFF] opacity-50 group-hover:opacity-80" />
              <span className="relative rounded-full h-2 w-2 bg-[#1A6FFF] group-hover:bg-[#00F5D4] transition-colors duration-300" />
            </span>

          </button>

          {/* Desktop links */}
          <ul
            className="hidden md:flex items-center gap-1"
            role="list"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => {
              const isActive = activeId === link.href.slice(1)
              return (
                <li key={link.href} className="relative">
                  {/* Hover background pill */}
                  {hoveredLink === link.href && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-full bg-[rgba(26,111,255,0.08)]"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <button
                    onClick={() => scrollTo(link.href)}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    className={cn(
                      'relative z-10 flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.75rem] font-medium tracking-[0.1em] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A6FFF]',
                      isActive ? 'text-white' : 'text-[#8888AA] hover:text-white',
                    )}
                  >
                    {/* Number accent */}
                    <span
                      className={cn(
                        'font-[var(--font-mono)] text-[0.6rem] transition-colors duration-300',
                        isActive ? 'text-[#1A6FFF]' : 'text-[#444458]',
                      )}
                    >
                      {link.num}
                    </span>
                    {t(link.fr, link.en)}

                    {/* Active dot */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="w-1 h-1 rounded-full bg-[#1A6FFF]"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Right cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Lang toggle — pill */}
            <button
              onClick={toggle}
              aria-label={lang === 'fr' ? 'Switch to English' : 'Passer en Français'}
              className="relative inline-flex items-center h-10 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-5 text-[0.72rem] font-medium tracking-[0.1em] text-[#8888AA] hover:text-white hover:border-[rgba(26,111,255,0.4)] hover:bg-[rgba(26,111,255,0.06)] transition-all duration-300 font-[var(--font-mono)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A6FFF]"
            >
              <span className={cn('transition-all duration-200', lang === 'fr' ? 'text-white' : '')}>
                FR
              </span>
              <span className="mx-1.5 opacity-30">/</span>
              <span className={cn('transition-all duration-200', lang === 'en' ? 'text-white' : '')}>
                EN
              </span>
            </button>

            {/* CTA */}
            <MagneticButton
              variant="primary"
              className="text-[0.72rem] tracking-[0.1em] h-10 py-0 px-5"
              onClick={() => scrollTo('#contact')}
            >
              {t(labels.nav.cta.fr, labels.nav.cta.en)}
            </MagneticButton>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg border border-[rgba(255,255,255,0.1)] text-white hover:border-[rgba(26,111,255,0.4)] hover:text-[#1A6FFF] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A6FFF]"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={17} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={17} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* ── scroll progress bar ── */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#1A6FFF] via-[#38bdf8] to-[#00F5D4] origin-left"
          style={{ scaleX: smoothProgress, width: '100%' }}
        />

      </motion.header>

      {/* ── Mobile full-screen drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 flex flex-col"
            aria-modal="true"
            role="dialog"
            aria-label="Menu principal"
          >
            {/* Blurred dark background */}
            <div className="absolute inset-0 bg-[#0A0A0A]/96 backdrop-blur-2xl" />

            {/* Radial glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(26,111,255,0.12), transparent 70%)' }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center flex-1 px-8 pt-24 pb-16 gap-2">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => scrollTo(link.href)}
                  tabIndex={mobileOpen ? 0 : -1}
                  className="group flex items-baseline gap-4 py-4 border-b border-[rgba(255,255,255,0.06)] last:border-0 focus-visible:outline-none text-left w-full"
                >
                  <span className="font-[var(--font-mono)] text-[0.65rem] text-[#1A6FFF] tracking-wider w-6 flex-shrink-0">
                    {link.num}
                  </span>
                  <span className="font-[var(--font-syne)] font-extrabold text-white group-hover:text-[#1A6FFF] transition-colors duration-300 leading-none"
                    style={{ fontSize: 'clamp(2rem, 8vw, 3rem)' }}>
                    {t(link.fr, link.en)}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="ml-auto opacity-0 group-hover:opacity-100 text-[#1A6FFF] transition-opacity duration-300 flex-shrink-0 -translate-y-0.5"
                  />
                </motion.button>
              ))}

              {/* Bottom row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.28 }}
                className="flex items-center justify-between pt-8"
              >
                <button
                  onClick={toggle}
                  tabIndex={mobileOpen ? 0 : -1}
                  className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.12)] px-4 py-2 text-[0.68rem] font-medium text-[#8888AA] hover:text-white transition-colors font-[var(--font-mono)] focus-visible:outline-none"
                >
                  <span className={lang === 'fr' ? 'text-white' : ''}>FR</span>
                  <span className="mx-1.5 opacity-30">/</span>
                  <span className={lang === 'en' ? 'text-white' : ''}>EN</span>
                </button>

                <MagneticButton
                  variant="primary"
                  onClick={() => scrollTo('#contact')}
                  className="text-sm"
                >
                  {t(labels.nav.cta.fr, labels.nav.cta.en)}
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
