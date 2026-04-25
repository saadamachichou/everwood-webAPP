"use client"

import { useContext } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Play } from 'lucide-react'
import { I18nContext, labels } from '@/lib/taha/i18n'
import { clipReveal, staggerContainer, fadeIn, fadeInUp, ease } from '@/lib/taha/animations'
import MagneticButton from './MagneticButton'
import SoundWave from './SoundWave'

const words1 = ['CRÉATEUR', 'AUDIOVISUAL']
const words2 = ['AUDIOVISUEL', 'CREATOR']

export default function HeroSection() {
  const { lang, t } = useContext(I18nContext)
  const shouldReduceMotion = useReducedMotion()

  const scrollToPortfolio = () => {
    const el = document.querySelector('#portfolio')
    if (el) el.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }

  const baseDelay = shouldReduceMotion ? 0 : 0.3

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col items-start justify-center overflow-hidden bg-[#0A0A0A]"
    >
      {/* Radial violet glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 20% 50%, rgba(26,111,255,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Sound-wave background */}
      <SoundWave
        className="bottom-0 h-2/3"
        opacity={0.22}
        color="#1A6FFF"
        lineCount={5}
        speed="slow"
      />

      {/* Decorative grid lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-44 pb-32">
        {/* Eyebrow */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: baseDelay }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="block w-8 h-px bg-[#1A6FFF]" />
          <span className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-[#1A6FFF] font-[var(--font-mono)]">
            {lang === 'fr' ? 'Créateur Audiovisuel' : 'Audiovisual Creator'}
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-[var(--font-syne)] font-extrabold leading-[0.9] tracking-tight mb-8 overflow-visible">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <motion.span
              className="block text-white"
              style={{ fontSize: 'clamp(4.5rem, 12vw, 10rem)' }}
              variants={shouldReduceMotion ? {} : clipReveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: baseDelay + 0.1, duration: 0.9, ease }}
            >
              {lang === 'fr' ? 'CRÉATEUR' : 'AUDIOVISUAL'}
            </motion.span>
          </div>

          {/* Line 2 — violet accent */}
          <div className="overflow-hidden">
            <motion.span
              className="block text-[#1A6FFF]"
              style={{ fontSize: 'clamp(4.5rem, 12vw, 10rem)' }}
              variants={shouldReduceMotion ? {} : clipReveal}
              initial="hidden"
              animate="visible"
              transition={{ delay: baseDelay + 0.22, duration: 0.9, ease }}
            >
              {lang === 'fr' ? 'AUDIOVISUEL' : 'CREATOR'}
            </motion.span>
          </div>
        </h1>

        {/* Sub-headline tags */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-2.5 mb-14"
        >
          {(lang === 'fr'
            ? ['Design Sonore', 'Composition', 'Post-production', 'Installations AV']
            : ['Sound Design', 'Composition', 'Post-production', 'AV Installations']
          ).map((tag, i) => (
            <motion.span
              key={tag}
              variants={
                shouldReduceMotion
                  ? {}
                  : {
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: baseDelay + 0.4 + i * 0.07 } },
                    }
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-[0.75rem] text-[#8888AA] tracking-wide"
            >
              <span className="w-1 h-1 rounded-full bg-[#1A6FFF] inline-block" />
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: baseDelay + 0.55, duration: 0.7, ease }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <MagneticButton
            variant="primary"
            className="text-[0.85rem] tracking-[0.06em] h-14 py-0 px-8"
            onClick={scrollToPortfolio}
            aria-label={t('Explorer mon travail', 'Explore my work')}
          >
            {t('Explorer mon travail', 'Explore my work')}
            <ArrowDown size={15} className="ml-1" />
          </MagneticButton>

          <MagneticButton
            variant="outline"
            className="text-[0.85rem] tracking-[0.06em] h-14 py-0 px-8 group"
            aria-label={t('Voir le showreel', 'Watch showreel')}
          >
            <span className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center group-hover:border-[#1A6FFF] transition-colors duration-300">
                <Play size={10} fill="currentColor" />
              </span>
              {t('Voir le showreel', 'Watch showreel')}
            </span>
          </MagneticButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: baseDelay + 0.7, duration: 0.7, ease }}
          className="flex flex-wrap gap-12 mt-20 pt-16 border-t border-[rgba(255,255,255,0.07)]"
        >
          {[
            { value: '19', label: t('Expertises', 'Expertises') },
            { value: '80+', label: t('Projets livrés', 'Projects delivered') },
            { value: '5+', label: t("Années d'exp.", 'Years of exp.') },
            { value: '3', label: t('Pôles créatifs', 'Creative pillars') },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2">
              <span
                className="font-[var(--font-syne)] font-extrabold text-white leading-none"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
              >
                {stat.value}
              </span>
              <span className="text-[0.72rem] text-[#8888AA] tracking-wide uppercase font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        variants={shouldReduceMotion ? {} : fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: baseDelay + 0.9, duration: 0.6, ease }}
        className="absolute bottom-8 right-8 md:right-10 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[0.6rem] tracking-[0.25em] text-[#8888AA] uppercase font-[var(--font-mono)] [writing-mode:vertical-rl]">
          {t('Défiler', 'Scroll')}
        </span>
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-[#1A6FFF] to-transparent"
        />
      </motion.div>
    </section>
  )
}
