"use client"

import { useContext, useState, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Wand2, Lightbulb, Cpu, ChevronDown } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import { serviceCategories } from '@/lib/taha/data'
import { fadeInUp, staggerContainer, ease } from '@/lib/taha/animations'
import { cn } from '@/lib/utils'

const icons = { Wand2, Lightbulb, Cpu } as const

export default function ServicesSection() {
  const { lang, t } = useContext(I18nContext)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section id="services" ref={ref} className="relative py-32 md:py-48 bg-[#0A0A0A] overflow-hidden">
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 80% 30%, rgba(0,245,212,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Section header */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-24 md:mb-36 max-w-3xl"
        >
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-8 h-px bg-[#1A6FFF]" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-[#1A6FFF] font-[var(--font-mono)]">
              {t('Expertise', 'Expertise')}
            </span>
          </motion.div>

          <motion.h2
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="font-[var(--font-syne)] font-extrabold text-white leading-tight mb-7"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {t(labels.sections.services.fr, labels.sections.services.en)}
          </motion.h2>

          <motion.p
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="text-[#8888AA] leading-relaxed text-base md:text-lg max-w-2xl"
          >
            {t(labels.sections.servicesSubtitle.fr, labels.sections.servicesSubtitle.en)}
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start"
        >
          {serviceCategories.map((cat, i) => (
            <ServiceCard key={cat.id} cat={cat} lang={lang} t={t} index={i} shouldReduceMotion={shouldReduceMotion ?? false} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Service Card ─────────────────────────────────────────────────────────────

interface ServiceCardProps {
  cat: (typeof serviceCategories)[number]
  lang: 'fr' | 'en'
  t: (fr: string, en: string) => string
  index: number
  shouldReduceMotion: boolean
}

function ServiceCard({ cat, lang, t, index, shouldReduceMotion }: ServiceCardProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const Icon = icons[cat.icon as keyof typeof icons]

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <motion.div
      variants={
        shouldReduceMotion
          ? {}
          : {
              hidden: { opacity: 0, y: 48 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease, delay: index * 0.1 },
              },
            }
      }
      className="group relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] overflow-hidden hover:border-[rgba(255,255,255,0.14)] transition-all duration-500 hover:-translate-y-2"
      style={{
        boxShadow: 'none',
        transition: 'border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 24px 60px -16px ${cat.glowColor}, 0 0 0 1px ${cat.accent}22`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      {/* Top glow accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cat.accent}, transparent)` }}
      />

      {/* Card spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at 50% 0%, ${cat.glowColor}, transparent 70%)` }}
      />

      <div className="relative p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-9">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${cat.accent}18`, border: `1px solid ${cat.accent}30` }}
          >
            <Icon size={20} color={cat.accent} />
          </div>

          <span
            className="inline-flex items-center justify-center rounded-full text-[0.65rem] font-bold tracking-wide px-2.5 py-1 font-[var(--font-mono)]"
            style={{ background: `${cat.accent}15`, color: cat.accent, border: `1px solid ${cat.accent}30` }}
          >
            {cat.services.length} {t('services', 'services')}
          </span>
        </div>

        <h3
          className="font-[var(--font-syne)] font-bold text-white mb-3 leading-snug"
          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}
        >
          {lang === 'fr' ? cat.fr : cat.en}
        </h3>

        {/* Divider */}
        <div
          className="h-px w-full mb-7 mt-5"
          style={{ background: `linear-gradient(90deg, ${cat.accent}40, transparent)` }}
        />

        {/* Accordion services */}
        <ul className="flex flex-col gap-1.5" role="list">
          {cat.services.map((svc) => (
            <li key={svc.id}>
              <button
                onClick={() => toggle(svc.id)}
                aria-expanded={openId === svc.id}
                aria-controls={`svc-desc-${svc.id}`}
                className="w-full flex items-center justify-between gap-3 py-3 px-4 rounded-lg text-left transition-colors duration-200 hover:bg-[rgba(255,255,255,0.04)] focus-visible:outline-none focus-visible:ring-1"
                style={{ ['--tw-ring-color' as string]: cat.accent }}
              >
                <span className="flex items-center gap-2.5 text-[0.83rem] text-[#8888AA] hover:text-white transition-colors">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: cat.accent }} />
                  {lang === 'fr' ? svc.fr : svc.en}
                </span>
                <ChevronDown
                  size={13}
                  className={cn(
                    'flex-shrink-0 text-[#8888AA] transition-transform duration-300',
                    openId === svc.id && 'rotate-180',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {openId === svc.id && (
                  <motion.div
                    id={`svc-desc-${svc.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="overflow-hidden"
                  >
                    <p className="text-[0.78rem] text-[#8888AA] leading-relaxed pt-2 pb-3 px-4 pl-9">
                      {lang === 'fr' ? svc.descFr : svc.descEn}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
