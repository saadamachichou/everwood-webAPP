"use client"

import { useContext, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Search, Lightbulb, Wand2, RefreshCw, PackageCheck, HeartHandshake } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import { processSteps } from '@/lib/taha/data'
import { fadeInUp, staggerContainer, ease } from '@/lib/taha/animations'

const iconMap = { Search, Lightbulb, Wand2, RefreshCw, PackageCheck, HeartHandshake } as const

export default function ProcessSection() {
  const { lang, t } = useContext(I18nContext)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="processus"
      ref={ref}
      className="relative py-32 md:py-48 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Ambient gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 10% 60%, rgba(26,111,255,0.07) 0%, transparent 65%)',
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
              {t('Méthode', 'Method')}
            </span>
          </motion.div>

          <motion.h2
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="font-[var(--font-syne)] font-extrabold text-white leading-tight mb-7"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {t(labels.sections.process.fr, labels.sections.process.en)}
          </motion.h2>

          <motion.p
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="text-[#8888AA] leading-relaxed text-base md:text-lg"
          >
            {t(labels.sections.processSubtitle.fr, labels.sections.processSubtitle.en)}
          </motion.p>
        </motion.div>

        {/* Steps — desktop: 3×2 grid, mobile: vertical list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative">
          {/* Connecting line (desktop only) */}
          <svg
            aria-hidden="true"
            className="absolute top-10 left-0 w-full hidden md:block pointer-events-none"
            height="2"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="rgba(26,111,255,0.25)"
              strokeWidth="1"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.6, ease }}
            />
          </svg>

          {processSteps.map((step, i) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap]
            return (
              <motion.div
                key={step.id}
                variants={
                  shouldReduceMotion
                    ? {}
                    : {
                        hidden: { opacity: 0, y: 40 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.6, ease, delay: 0.15 + i * 0.1 },
                        },
                      }
                }
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="relative group"
              >
                {/* Vertical connector (mobile) */}
                {i < processSteps.length - 1 && (
                  <div className="md:hidden absolute left-6 top-14 bottom-0 w-px bg-gradient-to-b from-[rgba(26,111,255,0.4)] to-transparent" />
                )}

                <div className="relative p-8 md:p-10 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.018)] hover:border-[rgba(26,111,255,0.25)] transition-all duration-400 hover:bg-[rgba(26,111,255,0.04)] h-full">
                  {/* Number */}
                  <div className="flex items-center justify-between mb-8">
                    <span
                      className="font-[var(--font-mono)] font-bold text-[0.7rem] tracking-[0.2em] text-[#1A6FFF]"
                    >
                      {step.number}
                    </span>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border border-[rgba(26,111,255,0.2)] group-hover:border-[rgba(26,111,255,0.5)] transition-colors duration-300"
                      style={{ background: 'rgba(26,111,255,0.08)' }}
                    >
                      <Icon size={16} className="text-[#1A6FFF]" />
                    </div>
                  </div>

                  {/* Big number accent */}
                  <div
                    className="absolute top-4 right-6 font-[var(--font-syne)] font-extrabold text-[4rem] leading-none pointer-events-none select-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-400"
                    aria-hidden="true"
                  >
                    {step.number}
                  </div>

                  <h3 className="font-[var(--font-syne)] font-bold text-white text-lg mb-4 leading-snug">
                    {lang === 'fr' ? step.fr : step.en}
                  </h3>

                  <p className="text-[0.85rem] text-[#8888AA] leading-[1.75]">
                    {lang === 'fr' ? step.descFr : step.descEn}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
