"use client"

import { useState } from 'react'
import { I18nContext, createI18nValue, type Lang } from '@/lib/taha/i18n'

import Navigation from '@/components/taha/Navigation'
import HeroSection from '@/components/taha/HeroSection'
import ServicesSection from '@/components/taha/ServicesSection'
import PortfolioGrid from '@/components/taha/PortfolioGrid'
import ProcessSection from '@/components/taha/ProcessSection'
import TestimonialsCarousel from '@/components/taha/TestimonialsCarousel'
import ContactSection from '@/components/taha/ContactSection'
import Footer from '@/components/taha/Footer'

export default function TahaPortfolioPage() {
  const [lang, setLang] = useState<Lang>('fr')
  const i18nValue = createI18nValue(lang, setLang)

  return (
    <I18nContext.Provider value={i18nValue}>
      {/* Skip to main content — accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-[#7B2FFF] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
      >
        {lang === 'fr' ? 'Aller au contenu principal' : 'Skip to main content'}
      </a>

      <Navigation />

      <main id="main-content">
        <HeroSection />
        <ServicesSection />
        <PortfolioGrid />
        <ProcessSection />
        <TestimonialsCarousel />
        <ContactSection />
      </main>

      <Footer />
    </I18nContext.Provider>
  )
}
