import type { Metadata } from 'next'
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import TahaCursor from '@/components/taha/TahaCursor'
import NoiseOverlay from '@/components/taha/NoiseOverlay'
import TahaGlobals from '@/components/taha/TahaGlobals'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'TAHA — Créateur Audiovisuel',
  description:
    "Portfolio de création audiovisuelle — Design sonore, composition musicale, post-production et installations immersives.",
  openGraph: {
    title: 'TAHA — Créateur Audiovisuel',
    description: 'Design sonore · Composition · Post-production · Installations AV',
    type: 'website',
  },
}

export default function TahaLayout({ children }: { children: React.ReactNode }) {
  return (
    // Nested layouts wrap content — html/body are in root layout.
    // Font CSS variables are scoped to this wrapper div.
    <div
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} bg-[#0A0A0A] text-white antialiased min-h-screen`}
      style={{ fontFamily: 'var(--font-inter), sans-serif' }}
    >
      <TahaGlobals />
      <TahaCursor />
      <NoiseOverlay />

      {children}

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0D0D1A',
            color: '#ffffff',
            border: '1px solid rgba(123,47,255,0.3)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
          },
        }}
      />
    </div>
  )
}
