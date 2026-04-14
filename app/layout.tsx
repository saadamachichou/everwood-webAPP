import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Space_Grotesk, Cormorant_Garamond, Lora, DM_Mono, Caveat, Fraunces } from "next/font/google";
import { Toaster } from "sonner";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ScrollToTop from "@/components/layout/ScrollToTop";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300"],
  style: ["normal", "italic"],
});
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});
const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
});
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: { default: "Everwood — Casablanca", template: "%s — Everwood" },
  description: "A living archaeology of music, art, and rare objects in the heart of Casablanca's medina.",
  openGraph: {
    siteName: "Everwood",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${garamond.variable} ${grotesk.variable} ${cormorant.variable} ${lora.variable} ${dmMono.variable} ${caveat.variable} ${fraunces.variable}`}>
      <body className="min-h-screen" style={{ position: "relative" }}>
        <ScrollToTop />
        <CustomCursor />
        <ScrollProgress />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--color-iron)",
              color: "var(--color-ivory)",
              border: "1px solid rgba(201,169,110,0.15)",
              fontFamily: "var(--font-grotesk)",
              fontSize: "0.8rem",
              letterSpacing: "0.05em",
            },
          }}
        />
      </body>
    </html>
  );
}
