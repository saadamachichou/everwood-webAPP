"use client"

import { useContext, useRef, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import { testimonials } from '@/lib/taha/data'
import { fadeInUp, staggerContainer, ease } from '@/lib/taha/animations'

export default function TestimonialsCarousel() {
  const { lang, t } = useContext(I18nContext)
  const ref = useRef(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()
  const [paused, setPaused] = useState(false)

  // Duplicate cards for seamless infinite scroll
  const cards = [...testimonials, ...testimonials]

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 bg-[#06060f] overflow-hidden"
    >
      {/* Ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(0,245,212,0.05) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 mb-20 md:mb-28">
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-8 h-px bg-[#1A6FFF]" />
            <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-[#1A6FFF] font-[var(--font-mono)]">
              {t('Témoignages', 'Testimonials')}
            </span>
          </motion.div>

          <motion.h2
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="font-[var(--font-syne)] font-extrabold text-white leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {t(labels.sections.testimonials.fr, labels.sections.testimonials.en)}
          </motion.h2>
        </motion.div>
      </div>

      {/* Carousel track */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel"
        aria-label={t('Témoignages clients', 'Client testimonials')}
      >
        {/* Fade edges */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-24 md:w-48 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #06060f, transparent)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-24 md:w-48 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(-90deg, #06060f, transparent)' }}
        />

        <div
          ref={trackRef}
          className="flex gap-6 w-max"
          style={{
            animation: shouldReduceMotion || paused ? 'none' : 'taha-marquee 40s linear infinite',
          }}
        >
          {cards.map((t_item, i) => (
            <TestimonialCard key={`${t_item.id}-${i}`} item={t_item} lang={lang} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes taha-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({
  item,
  lang,
  t,
}: {
  item: (typeof testimonials)[0]
  lang: 'fr' | 'en'
  t: (fr: string, en: string) => string
}) {
  return (
    <article
      className="flex-shrink-0 w-[360px] md:w-[460px] rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] p-8 md:p-10 hover:border-[rgba(26,111,255,0.3)] hover:bg-[rgba(26,111,255,0.04)] transition-all duration-400 hover:-translate-y-1.5"
      aria-label={`${item.name}, ${item.role}`}
    >
      {/* Quote mark */}
      <div
        className="font-[var(--font-syne)] font-extrabold text-[5rem] leading-none text-[#1A6FFF] opacity-25 mb-4 -mt-2 select-none"
        aria-hidden="true"
      >
        "
      </div>

      {/* Quote text */}
      <blockquote className="text-[0.9rem] text-[#ccccdd] leading-[1.8] mb-7">
        {lang === 'fr' ? item.quoteFr : item.quoteEn}
      </blockquote>

      {/* Stars */}
      <div className="flex items-center gap-1.5 mb-6" aria-label={`${item.rating} étoiles sur 5`}>
        {Array.from({ length: item.rating }, (_, i) => (
          <Star key={i} size={13} className="fill-[#1A6FFF] text-[#1A6FFF]" />
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(255,255,255,0.07)] mb-6" />

      {/* Author */}
      <footer className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white font-[var(--font-syne)] flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A6FFF, #00F5D4)' }}
          aria-hidden="true"
        >
          {item.name.charAt(0)}
        </div>
        <div>
          <cite className="not-italic font-semibold text-white text-[0.88rem] block font-[var(--font-syne)]">
            {item.name}
          </cite>
          <span className="text-[0.75rem] text-[#8888AA]">
            {item.role} · {item.company}
          </span>
        </div>
      </footer>
    </article>
  )
}
