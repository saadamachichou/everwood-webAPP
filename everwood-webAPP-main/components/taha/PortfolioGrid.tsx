"use client"

import { useContext, useState, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import { portfolioItems, type PortfolioFilter } from '@/lib/taha/data'
import { fadeInUp, staggerContainer, scaleIn, ease } from '@/lib/taha/animations'
import { cn } from '@/lib/utils'

const FILTERS: PortfolioFilter[] = ['all', 'audio', 'video', 'immersive', 'branding']

export default function PortfolioGrid() {
  const { lang, t } = useContext(I18nContext)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const [activeFilter, setActiveFilter] = useState<PortfolioFilter>('all')
  const [selected, setSelected] = useState<(typeof portfolioItems)[0] | null>(null)

  const filtered =
    activeFilter === 'all' ? portfolioItems : portfolioItems.filter((p) => p.category === activeFilter)

  const filterLabel: Record<PortfolioFilter, { fr: string; en: string }> = {
    all: labels.filters.all,
    audio: labels.filters.audio,
    video: labels.filters.video,
    immersive: labels.filters.immersive,
    branding: labels.filters.branding,
  }

  return (
    <section id="portfolio" ref={ref} className="relative py-32 md:py-48 bg-[#06060f] overflow-hidden">
      {/* Ambient gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(26,111,255,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-18 md:mb-24"
        >
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-8 h-px bg-[#1A6FFF]" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-[#1A6FFF] font-[var(--font-mono)]">
              {t('Réalisations', 'Work')}
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.h2
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="font-[var(--font-syne)] font-extrabold text-white leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              {t(labels.sections.portfolio.fr, labels.sections.portfolio.en)}
            </motion.h2>

            {/* Filter tabs */}
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label={t('Filtrer par catégorie', 'Filter by category')}
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={activeFilter === f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    'relative rounded-full text-[0.72rem] font-medium tracking-wider px-4 py-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A6FFF]',
                    activeFilter === f
                      ? 'bg-[#1A6FFF] text-white shadow-[0_0_16px_rgba(26,111,255,0.4)]'
                      : 'border border-[rgba(255,255,255,0.1)] text-[#8888AA] hover:text-white hover:border-[rgba(255,255,255,0.22)]',
                  )}
                >
                  {t(filterLabel[f].fr, filterLabel[f].en)}
                </button>
              ))}
            </motion.div>
          </div>

          <motion.p
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="text-[#8888AA] leading-relaxed text-base mt-6 max-w-2xl"
          >
            {t(labels.sections.portfolioSubtitle.fr, labels.sections.portfolioSubtitle.en)}
          </motion.p>
        </motion.div>

        {/* Bento grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[260px] gap-5"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                variants={shouldReduceMotion ? {} : scaleIn}
                custom={i}
                className={cn(
                  'relative rounded-2xl overflow-hidden cursor-pointer group',
                  item.span === 'wide' && 'col-span-2',
                  item.span === 'tall' && 'row-span-2',
                )}
                onClick={() => setSelected(item)}
                tabIndex={0}
                role="button"
                aria-label={lang === 'fr' ? item.titleFr : item.titleEn}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(item)}
                style={{ background: item.gradient }}
              >
                {/* Shimmer overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 60%)',
                  }}
                />

                {/* Info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.85)] via-[rgba(0,0,0,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-6 md:p-7">
                  <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#8888AA] mb-2 font-[var(--font-mono)]">
                    {item.category} · {item.year}
                  </span>
                  <h3 className="font-[var(--font-syne)] font-bold text-white leading-snug text-sm md:text-base">
                    {lang === 'fr' ? item.titleFr : item.titleEn}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[0.72rem] text-[#1A6FFF] mt-2 font-medium">
                    {t('Voir le projet', 'View project')} <ArrowUpRight size={13} />
                  </span>
                </div>

                {/* Category pill — always visible */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border border-[rgba(255,255,255,0.12)] px-2.5 py-0.5 text-[0.62rem] font-medium text-white tracking-wide uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Arrow icon — top right */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0">
                  <span className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.12)] backdrop-blur-sm flex items-center justify-center">
                    <ArrowUpRight size={14} className="text-white" />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.35, ease }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-lg mx-auto rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.1)]"
              role="dialog"
              aria-modal="true"
              aria-label={lang === 'fr' ? selected.titleFr : selected.titleEn}
            >
              {/* Modal image */}
              <div
                className="h-52 md:h-72"
                style={{ background: selected.gradient }}
              />

              {/* Modal content */}
              <div className="bg-[#0D0D1A] p-8 md:p-10">
                <div className="flex items-start justify-between gap-4 mb-7">
                  <div>
                    <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#1A6FFF] font-[var(--font-mono)] block mb-2">
                      {selected.category} · {selected.year}
                    </span>
                    <h3 className="font-[var(--font-syne)] font-bold text-white text-xl leading-tight">
                      {lang === 'fr' ? selected.titleFr : selected.titleEn}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-shrink-0 w-9 h-9 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#8888AA] hover:text-white hover:border-[rgba(255,255,255,0.25)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A6FFF]"
                    aria-label={t('Fermer', 'Close')}
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-[rgba(255,255,255,0.07)]">
                  <span className="text-[0.72rem] text-[#8888AA]">
                    {t('Client :', 'Client:')}
                  </span>
                  <span className="text-[0.72rem] text-white font-medium">{selected.client}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
