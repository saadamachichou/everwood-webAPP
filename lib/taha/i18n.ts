"use client"

import { createContext, useContext } from 'react'
import type { Lang } from './data'

export { type Lang }

interface I18nContextValue {
  lang: Lang
  t: (fr: string, en: string) => string
  toggle: () => void
}

export const I18nContext = createContext<I18nContextValue>({
  lang: 'fr',
  t: (fr) => fr,
  toggle: () => {},
})

export function useI18n() {
  return useContext(I18nContext)
}

export function createI18nValue(lang: Lang, setLang: (l: Lang) => void): I18nContextValue {
  return {
    lang,
    t: (fr: string, en: string) => (lang === 'fr' ? fr : en),
    toggle: () => setLang(lang === 'fr' ? 'en' : 'fr'),
  }
}

// Static labels used site-wide
export const labels = {
  nav: {
    services: { fr: 'Services', en: 'Services' },
    portfolio: { fr: 'Portfolio', en: 'Portfolio' },
    process: { fr: 'Processus', en: 'Process' },
    contact: { fr: 'Contact', en: 'Contact' },
    cta: { fr: 'Prendre contact', en: 'Get in touch' },
  },
  hero: {
    line1: { fr: 'CRÉATEUR', en: 'AUDIOVISUAL' },
    line2: { fr: 'AUDIOVISUEL', en: 'CREATOR' },
    tagline: { fr: 'Design sonore · Composition · Post-production', en: 'Sound design · Composition · Post-production' },
    cta1: { fr: 'Explorer mon travail', en: 'Explore my work' },
    cta2: { fr: 'Voir le showreel', en: 'Watch showreel' },
    scroll: { fr: 'Défiler', en: 'Scroll' },
  },
  sections: {
    services: { fr: 'Mes Services', en: 'My Services' },
    servicesSubtitle: { fr: '19 expertises réparties en 3 pôles pour couvrir l\'intégralité de vos besoins audiovisuels.', en: '19 expertises across 3 pillars to cover all your audiovisual needs.' },
    portfolio: { fr: 'Mon Portfolio', en: 'My Portfolio' },
    portfolioSubtitle: { fr: 'Une sélection de projets récents illustrant l\'étendue de mes expertises.', en: 'A selection of recent projects illustrating the breadth of my expertise.' },
    process: { fr: 'Mon Processus', en: 'My Process' },
    processSubtitle: { fr: 'Une méthode rigoureuse et collaborative, de la première rencontre à la livraison finale.', en: 'A rigorous, collaborative method, from first meeting to final delivery.' },
    testimonials: { fr: 'Ils me font confiance', en: 'Trusted by clients' },
    contact: { fr: 'Parlons de votre projet', en: "Let's talk about your project" },
    contactSubtitle: { fr: 'Prêt à créer quelque chose d\'extraordinaire ensemble ?', en: 'Ready to create something extraordinary together?' },
  },
  filters: {
    all: { fr: 'Tout', en: 'All' },
    audio: { fr: 'Audio', en: 'Audio' },
    video: { fr: 'Vidéo', en: 'Video' },
    immersive: { fr: 'Immersif', en: 'Immersive' },
    branding: { fr: 'Branding', en: 'Branding' },
  },
  form: {
    name: { fr: 'Nom complet', en: 'Full name' },
    email: { fr: 'Adresse email', en: 'Email address' },
    projectType: { fr: 'Type de projet', en: 'Project type' },
    message: { fr: 'Décrivez votre projet', en: 'Describe your project' },
    submit: { fr: 'Envoyer le message', en: 'Send message' },
    success: { fr: 'Message envoyé avec succès !', en: 'Message sent successfully!' },
    projectTypes: {
      soundDesign: { fr: 'Design Sonore', en: 'Sound Design' },
      musicComp: { fr: 'Composition Musicale', en: 'Music Composition' },
      postProd: { fr: 'Post-Production', en: 'Post-Production' },
      installation: { fr: 'Installation AV', en: 'AV Installation' },
      branding: { fr: 'Sound Branding', en: 'Sound Branding' },
      other: { fr: 'Autre', en: 'Other' },
    },
  },
  footer: {
    tagline: { fr: 'Façonnons l\'expérience sensorielle de demain.', en: "Shaping tomorrow's sensory experience." },
    rights: { fr: 'Tous droits réservés.', en: 'All rights reserved.' },
  },
} as const
