export type Lang = 'fr' | 'en'

// ─── Services ────────────────────────────────────────────────────────────────

export interface ServiceItem {
  id: string
  fr: string
  en: string
  descFr: string
  descEn: string
}

export interface ServiceCategory {
  id: 'creative' | 'consulting' | 'technical'
  fr: string
  en: string
  icon: string
  accent: string
  glowColor: string
  services: ServiceItem[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'creative',
    fr: 'Services Créatifs',
    en: 'Creative Services',
    icon: 'Wand2',
    accent: '#1A6FFF',
    glowColor: 'rgba(26,111,255,0.18)',
    services: [
      {
        id: 'sound-design',
        fr: 'Design Sonore',
        en: 'Sound Design',
        descFr: "Création d'univers sonores uniques et immersifs pour vos projets créatifs et commerciaux.",
        descEn: 'Creating unique, immersive soundscapes for your creative and commercial projects.',
      },
      {
        id: 'music-comp',
        fr: 'Composition Musicale',
        en: 'Custom Music Composition',
        descFr: 'Composition sur mesure adaptée à votre identité et vos besoins narratifs.',
        descEn: 'Custom compositions tailored to your identity and narrative needs.',
      },
      {
        id: 'immersive',
        fr: 'Créations Immersives',
        en: 'Immersive Creations',
        descFr: 'Expériences sonores et visuelles multicanales pour installations et événements.',
        descEn: 'Multi-channel audio-visual experiences for installations and events.',
      },
      {
        id: 'sound-branding',
        fr: 'Sound Branding',
        en: 'Sound Branding',
        descFr: "Identité sonore de marque — logos audio, jingles, et chartes sonores complètes.",
        descEn: 'Brand sonic identity — audio logos, jingles, and complete sound guidelines.',
      },
    ],
  },
  {
    id: 'consulting',
    fr: 'Conseil & Support',
    en: 'Consulting & Support',
    icon: 'Lightbulb',
    accent: '#00F5D4',
    glowColor: 'rgba(0,245,212,0.14)',
    services: [
      {
        id: 'auditing',
        fr: 'Audit de Projet',
        en: 'Project Auditing',
        descFr: 'Analyse critique et recommandations stratégiques pour vos productions audiovisuelles.',
        descEn: 'Critical analysis and strategic recommendations for your audiovisual productions.',
      },
      {
        id: 'strategy',
        fr: 'Stratégie Sonore',
        en: 'Sound Strategy',
        descFr: "Développement d'une stratégie sonore cohérente alignée avec vos objectifs de marque.",
        descEn: 'Developing a coherent sound strategy aligned with your brand objectives.',
      },
      {
        id: 'training',
        fr: 'Formation Personnalisée',
        en: 'Personalized Training',
        descFr: 'Ateliers et formations sur mesure en production sonore et audiovisuelle.',
        descEn: 'Custom workshops and training in sound and audiovisual production.',
      },
    ],
  },
  {
    id: 'technical',
    fr: 'Services Techniques',
    en: 'Technical Services',
    icon: 'Cpu',
    accent: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.14)',
    services: [
      {
        id: 'av-install',
        fr: 'Installation Audiovisuelle',
        en: 'Audiovisual Installation',
        descFr: 'Conception et déploiement de systèmes audiovisuels pour événements et espaces.',
        descEn: 'Design and deployment of audiovisual systems for events and spaces.',
      },
      {
        id: 'sound-install',
        fr: 'Installation Sonore',
        en: 'Sound Installation',
        descFr: "Ingénierie et installation de systèmes de diffusion sonore professionnels.",
        descEn: 'Engineering and installation of professional sound diffusion systems.',
      },
      {
        id: 'video-edit',
        fr: 'Montage Vidéo',
        en: 'Video Editing',
        descFr: 'Montage professionnel orienté narration avec maîtrise du rythme et de la fluidité.',
        descEn: 'Professional narrative-driven editing with mastery of rhythm and flow.',
      },
      {
        id: 'post-prod',
        fr: 'Post-Production Musicale & Cinéma',
        en: 'Music & Cinematic Post-Production',
        descFr: 'Mixage, mastering, et finalisation pour productions musicales et cinématographiques.',
        descEn: 'Mixing, mastering, and finalisation for musical and cinematic productions.',
      },
      {
        id: 'recording',
        fr: 'Prise de Son',
        en: 'Sound Recording',
        descFr: "Enregistrement professionnel en studio ou sur le terrain avec équipement de pointe.",
        descEn: 'Professional recording in studio or on location with state-of-the-art equipment.',
      },
      {
        id: 'live-sound',
        fr: 'Opération Son Live',
        en: 'Sound System Operation',
        descFr: 'Régie son pour concerts, conférences, et événements en direct.',
        descEn: 'Sound engineering for concerts, conferences, and live events.',
      },
      {
        id: 'acoustic',
        fr: 'Traitement Acoustique',
        en: 'Acoustic Treatment',
        descFr: "Étude et mise en œuvre de traitements acoustiques pour espaces professionnels.",
        descEn: 'Study and implementation of acoustic treatments for professional spaces.',
      },
      {
        id: 'clip-edit',
        fr: 'Montage Clip & Film',
        en: 'Clip & Film Editing',
        descFr: 'Montage créatif de clips musicaux et courts-métrages avec synchronisation musicale.',
        descEn: 'Creative editing of music videos and short films with musical synchronization.',
      },
      {
        id: 'color',
        fr: 'Étalonnage Colorimétrique',
        en: 'Color Grading',
        descFr: "Traitement colorimétrique précis pour une identité visuelle cohérente et impactante.",
        descEn: 'Precise color treatment for a consistent and impactful visual identity.',
      },
      {
        id: 'retouching',
        fr: "Retouche d'Image",
        en: 'Image Retouching',
        descFr: 'Retouche et traitement photographique pour médias de campagne et édition.',
        descEn: 'Photo retouching and processing for campaign media and editorial.',
      },
      {
        id: 'vfx',
        fr: 'Effets Visuels (VFX)',
        en: 'Visual Effects (VFX)',
        descFr: "Intégration d'effets visuels et de compositing pour productions vidéo.",
        descEn: 'VFX integration and compositing for video productions.',
      },
      {
        id: 'sync',
        fr: 'Synchronisation Son/Image',
        en: 'Sound/Image Synchronization',
        descFr: "Synchronisation précise du son et de l'image pour une expérience narrative optimale.",
        descEn: 'Precise sound-to-image synchronization for optimal narrative experience.',
      },
    ],
  },
]

// ─── Portfolio ────────────────────────────────────────────────────────────────

export type PortfolioFilter = 'all' | 'audio' | 'video' | 'immersive' | 'branding'

export interface PortfolioItem {
  id: string
  titleFr: string
  titleEn: string
  category: Exclude<PortfolioFilter, 'all'>
  year: string
  client: string
  gradient: string
  span: 'normal' | 'wide' | 'tall'
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'p1',
    titleFr: 'Identité Sonore — Maison Lumière',
    titleEn: 'Sonic Identity — Maison Lumière',
    category: 'branding',
    year: '2025',
    client: 'Maison Lumière',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #1A6FFF 60%, #2d0066 100%)',
    span: 'wide',
  },
  {
    id: 'p2',
    titleFr: 'Installation Immersive — Festival du Son',
    titleEn: 'Immersive Installation — Festival du Son',
    category: 'immersive',
    year: '2025',
    client: 'Festival du Son',
    gradient: 'linear-gradient(135deg, #001a16 0%, #00F5D4 60%, #004d42 100%)',
    span: 'tall',
  },
  {
    id: 'p3',
    titleFr: 'Clip Officiel — Luna Rouge',
    titleEn: 'Official Music Video — Luna Rouge',
    category: 'video',
    year: '2024',
    client: 'Luna Rouge',
    gradient: 'linear-gradient(135deg, #1a0a00 0%, #F59E0B 60%, #7c4400 100%)',
    span: 'normal',
  },
  {
    id: 'p4',
    titleFr: 'Design Sonore — Jeu Indépendant',
    titleEn: 'Sound Design — Indie Game',
    category: 'audio',
    year: '2024',
    client: 'Pixel Forge Studios',
    gradient: 'linear-gradient(135deg, #00061a 0%, #1a6fff 60%, #003399 100%)',
    span: 'normal',
  },
  {
    id: 'p5',
    titleFr: 'Post-Production — Documentaire',
    titleEn: 'Post-Production — Documentary',
    category: 'video',
    year: '2024',
    client: 'Canal+ Africa',
    gradient: 'linear-gradient(135deg, #001019 0%, #0EA5E9 60%, #003d5c 100%)',
    span: 'wide',
  },
  {
    id: 'p6',
    titleFr: 'Composition — Pub TV Nationale',
    titleEn: 'Composition — National TV Ad',
    category: 'audio',
    year: '2023',
    client: 'Agence Créa',
    gradient: 'linear-gradient(135deg, #190000 0%, #EF4444 60%, #5c0000 100%)',
    span: 'normal',
  },
  {
    id: 'p7',
    titleFr: 'Sound Branding — Startup Fintech',
    titleEn: 'Sound Branding — Fintech Startup',
    category: 'branding',
    year: '2023',
    client: 'Volta Pay',
    gradient: 'linear-gradient(135deg, #001a0d 0%, #10B981 60%, #004d2b 100%)',
    span: 'normal',
  },
  {
    id: 'p8',
    titleFr: 'Performance Live — Musée National',
    titleEn: 'Live Performance — National Museum',
    category: 'immersive',
    year: '2023',
    client: 'Musée National',
    gradient: 'linear-gradient(135deg, #19000d 0%, #EC4899 60%, #660033 100%)',
    span: 'normal',
  },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  quoteFr: string
  quoteEn: string
  name: string
  role: string
  company: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quoteFr: "Taha a transformé notre vision en une expérience sonore qui dépasse toutes nos attentes. Sa capacité à saisir l'essence d'une marque en musique est exceptionnelle.",
    quoteEn: "Taha transformed our vision into a sonic experience that exceeded all our expectations. His ability to capture a brand's essence in music is exceptional.",
    name: 'Sofia Benali',
    role: 'Directrice Créative',
    company: 'Maison Lumière',
    rating: 5,
  },
  {
    id: 't2',
    quoteFr: "Un partenaire de confiance pour nos productions audiovisuelles. La qualité du travail et la rigueur du processus sont sans égal dans notre secteur.",
    quoteEn: "A trusted partner for our audiovisual productions. The quality of work and rigor of process are unmatched in our sector.",
    name: 'Marcus Dubois',
    role: 'Producteur',
    company: 'Canal+ Africa',
    rating: 5,
  },
  {
    id: 't3',
    quoteFr: "L'installation immersive créée pour notre festival a marqué les esprits. Un professionnel d'exception avec une sensibilité artistique rare.",
    quoteEn: "The immersive installation created for our festival made a lasting impression. An exceptional professional with rare artistic sensitivity.",
    name: 'Amina Chaoui',
    role: 'Directrice',
    company: 'Festival du Son',
    rating: 5,
  },
  {
    id: 't4',
    quoteFr: "Notre identité sonore a radicalement changé la perception de notre marque. Un investissement qui a porté ses fruits bien au-delà de nos espérances.",
    quoteEn: "Our sonic identity radically changed brand perception. An investment that paid off far beyond our expectations.",
    name: 'Jean-Philippe Martin',
    role: 'CEO',
    company: 'Volta Pay',
    rating: 5,
  },
  {
    id: 't5',
    quoteFr: "La formation reçue a transformé notre équipe de production. Des méthodes concrètes, une pédagogie claire, et des résultats immédiats.",
    quoteEn: "The training transformed our production team. Concrete methods, clear pedagogy, and immediate results.",
    name: 'Léa Fontaine',
    role: 'Responsable Production',
    company: 'Agence Créa',
    rating: 5,
  },
]

// ─── Process ──────────────────────────────────────────────────────────────────

export interface ProcessStep {
  id: string
  number: string
  fr: string
  en: string
  descFr: string
  descEn: string
  icon: string
}

export const processSteps: ProcessStep[] = [
  {
    id: 'step-1',
    number: '01',
    fr: 'Découverte',
    en: 'Discovery',
    descFr: 'Analyse approfondie de vos besoins, de votre univers et de vos objectifs créatifs.',
    descEn: 'In-depth analysis of your needs, creative universe, and objectives.',
    icon: 'Search',
  },
  {
    id: 'step-2',
    number: '02',
    fr: 'Concept',
    en: 'Concept',
    descFr: "Développement d'une direction artistique unique et d'un brief créatif détaillé.",
    descEn: 'Development of a unique artistic direction and detailed creative brief.',
    icon: 'Lightbulb',
  },
  {
    id: 'step-3',
    number: '03',
    fr: 'Production',
    en: 'Production',
    descFr: "Création et production du contenu selon les standards les plus exigeants de l'industrie.",
    descEn: 'Creation and production of content to the highest industry standards.',
    icon: 'Wand2',
  },
  {
    id: 'step-4',
    number: '04',
    fr: 'Révisions',
    en: 'Revisions',
    descFr: "Cycles d'itération collaboratifs jusqu'à l'atteinte de la vision partagée.",
    descEn: 'Collaborative iteration cycles until the shared vision is fully achieved.',
    icon: 'RefreshCw',
  },
  {
    id: 'step-5',
    number: '05',
    fr: 'Livraison',
    en: 'Delivery',
    descFr: 'Remise de tous les livrables dans les formats requis avec documentation complète.',
    descEn: 'Delivery of all assets in required formats with complete documentation.',
    icon: 'PackageCheck',
  },
  {
    id: 'step-6',
    number: '06',
    fr: 'Suivi',
    en: 'Follow-up',
    descFr: "Support post-livraison et accompagnement pour maximiser l'impact de votre projet.",
    descEn: 'Post-delivery support and guidance to maximize your project impact.',
    icon: 'HeartHandshake',
  },
]
