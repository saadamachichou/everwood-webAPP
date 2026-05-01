"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TextSplit from "@/components/effects/TextSplit";
import CountUp from "@/components/effects/CountUp";
import Marquee from "@/components/effects/Marquee";
import RevealOnScroll from "@/components/effects/RevealOnScroll";

/** Full-page atmosphere — surreal wood interior (public/images/nav/about bacground.jpeg) */
const ABOUT_PAGE_BG = "/images/nav/about%20bacground.jpeg";

const storyPanels = [
  { year: "1923 — Origin", num: "01 / 05", title: "A Merchant's Archive", body: "In the medina's quietest alley, a Fassi merchant named Idris al-Wazzani built a riad not for living but for keeping. Every room became a repository — Andalusian tilework on one wall, Saharan lock-boxes stacked to the cedar ceiling on another. He called it his memory palace." },
  { year: "1960 — Silence", num: "02 / 05", title: "The Long Sleep", body: "After independence the riad passed through three families, each adding their own sediment — French lithographs, English clockwork, Berber saddle-bags. By 1960 it was full. The last heir sealed the doors and left for Montréal. The building breathed dust for four decades." },
  { year: "2001 — Excavation", num: "03 / 05", title: "The First Dig", body: "Two architects arrived with flashlights and notebooks, commissioned by a Casablanca family to assess the structure. What they found stopped the feasibility report cold — every corner held an artifact. They spent six months cataloguing before a single wall was touched." },
  { year: "2012 — Return", num: "04 / 05", title: "The Riad Awakens", body: "After a decade of quiet restoration — no demolition, only cleaning, stabilizing, and documenting — Everwood reopened. The Curiosity Cabinet went public. Within weeks, collectors from London and Marrakech were making the pilgrimage. The first concert sold out in four hours." },
  { year: "Now — Continuing", num: "05 / 05", title: "An Archive in Motion", body: "Today Everwood is simultaneously a concert hall, an antique dealer, a cultural laboratory, and a living museum. New objects arrive. Old ones find new owners. Music fills the courtyard every week. The only constant is the conviction that nothing beautiful should be forgotten." },
];

const stats = [
  { target: 1923, label: "Year the riad first opened its doors as a merchant's archive", suffix: "" },
  { target: 4000, label: "Antique objects catalogued across 12 provenance categories", suffix: "+" },
  { target: 38, label: "Countries represented in our permanent collection", suffix: "" },
  { target: 300, label: "Curated events hosted in the riad since our reopening", suffix: "+" },
];

const recognition = [
  { pub: "Wallpaper*", tag: "Culture" },
  { pub: "Monocle", tag: "Best of Casablanca" },
  { pub: "AD Middle East", tag: "Space of the Year" },
  { pub: "The Guardian", tag: "Travel" },
  { pub: "Numéro Art", tag: "Collectors Edition" },
  { pub: "Frieze", tag: "Emerging Spaces" },
  { pub: "Le Monde", tag: "Arts & Culture" },
  { pub: "Wallpaper*", tag: "Design" },
];

function StoryPanelAccent({ index, panelProgress }: { index: number; panelProgress: MotionValue<number> }) {
  const width = useTransform(panelProgress, [index - 0.5, index + 0.5], ["0px", "60px"]);
  return (
    <motion.div
      className="absolute bottom-16 left-10 h-[1px] bg-[var(--color-gold)]"
      style={{ width }}
    />
  );
}

function StoryPanelDot({ index, panelProgress }: { index: number; panelProgress: MotionValue<number> }) {
  const backgroundColor = useTransform(panelProgress, [index - 0.4, index, index + 0.4], [
    "var(--color-ash)",
    "var(--color-gold)",
    "var(--color-ash)",
  ]);
  return <motion.div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ash)]" style={{ backgroundColor }} />;
}

function ManifestoWord({ scrollYProgress, word, index, total }: {
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  word: string;
  index: number;
  total: number;
}) {
  const wordProgress = useTransform(scrollYProgress, [index / total, (index + 3) / total], [0, 1]);
  const color = useTransform(wordProgress, [0, 1], ["var(--color-mist)", "var(--color-ivory)"]);
  return <motion.span style={{ color }} className="inline">{word} </motion.span>;
}

function ManifestoSection() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 30%"] });
  const words = "We believe that every object carries the weight of its making — the hands that shaped it, the fire that hardened it, the centuries that weathered it. To acquire an antique is not to purchase a thing. It is to accept a custodianship. You become the next chapter in its story, responsible for keeping its memory alive until someone else is ready to carry it forward.".split(" ");

  return (
    <section style={{
      minHeight: "100svh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: "60px",
      paddingRight: "60px",
      paddingTop: "6rem",
      paddingBottom: "6rem",
      textAlign: "center",
      position: "relative",
    }}>
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-10">Philosophy</p>
      <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.3)", margin: "0 auto 2.5rem" }} />
      <p ref={ref} className="relative font-[family-name:var(--font-cormorant)] italic text-[clamp(1.4rem,2.5vw,2.1rem)] leading-relaxed" style={{ maxWidth: "52ch" }} aria-label="Philosophy quote">
        {words.map((word, i) => (
          <ManifestoWord key={i} scrollYProgress={scrollYProgress} word={word} index={i} total={words.length} />
        ))}
      </p>
    </section>
  );
}

export default function AboutPage() {
  const storyRef = useRef<HTMLDivElement>(null);

  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Reliable dimensions (cached images sometimes skip onLoad on <img>)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0) {
        setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      }
    };
    img.src = ABOUT_PAGE_BG;
  }, []);

  const renderedImgHeight = useMemo(() => {
    if (!imgNatural?.w) return 0;
    return (imgNatural.h / imgNatural.w) * viewport.w;
  }, [imgNatural, viewport.w]);

  /** Vertical pan range: full photo when taller than viewport; small drift for wide/short images */
  const parallaxShift = useMemo(() => {
    if (renderedImgHeight <= 0) return 0;
    const travel = renderedImgHeight - viewport.h;
    if (travel > 0) return travel;
    return Math.min(160, viewport.h * 0.1);
  }, [renderedImgHeight, viewport.h]);

  // Same pattern as ScrollProgress — document scroll, not a ref target
  const { scrollYProgress } = useScroll();
  const bgTranslateY = useTransform(scrollYProgress, [0, 1], [0, -parallaxShift]);

  const { scrollYProgress: storyScroll } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const trackX = useTransform(storyScroll, [0, 1], ["0%", `-${(storyPanels.length - 1) * 100}%`]);
  const panelProgress = useTransform(storyScroll, [0, 1], [0, storyPanels.length - 1]);

  return (
    <div className="min-h-screen relative">
      {/* Optional: still fires if preload above succeeded first */}
      <img
        src={ABOUT_PAGE_BG}
        alt=""
        width={1}
        height={1}
        className="pointer-events-none fixed left-0 top-0 h-px w-px opacity-0 overflow-hidden"
        aria-hidden
        loading="eager"
        fetchPriority="low"
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth > 0) setImgNatural({ w: naturalWidth, h: naturalHeight });
        }}
      />

      {/* Clipped viewport: background pans vertically with document scroll */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0908]" />
        <motion.div
          key={`about-bg-${renderedImgHeight}-${viewport.w}`}
          aria-hidden
          className="absolute left-0 right-0 top-0 w-full will-change-transform"
          style={{
            height: renderedImgHeight > 0 ? renderedImgHeight : "100vh",
            backgroundImage: `url(${ABOUT_PAGE_BG})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            y: bgTranslateY,
          }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: [
            "linear-gradient(180deg, rgba(12, 10, 8, 0.72) 0%, rgba(15, 12, 10, 0.55) 35%, rgba(10, 9, 12, 0.68) 70%, rgba(8, 8, 10, 0.78) 100%)",
            "radial-gradient(ellipse 85% 60% at 50% 20%, rgba(201, 169, 110, 0.06), transparent 55%)",
          ].join(", "),
        }}
      />
      <div className="relative z-[1]">
      <Navigation />

      {/* ── HERO — centered in viewport, below fixed nav ─────────────────── */}
      <section
        className="relative min-h-[100dvh] min-h-screen flex flex-col justify-center items-center text-center overflow-hidden"
        style={{
          paddingLeft: "clamp(1.25rem, 5vw, 60px)",
          paddingRight: "clamp(1.25rem, 5vw, 60px)",
          paddingTop: "calc(2rem + 140px + 0.75rem + env(safe-area-inset-top, 0px))",
          paddingBottom: "clamp(2rem, 6vh, 4rem)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,169,110,0.07), transparent 70%)" }} />
          <motion.div className="absolute inset-0" animate={{ opacity: [0.85, 1, 0.8, 0.95, 0.85] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "radial-gradient(ellipse 30% 50% at 50% 55%, rgba(232,93,38,0.04), transparent 60%)" }} />
        </div>
        <div className="relative z-[1] flex w-full max-w-5xl flex-col items-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-8">
            The Archaeology
          </motion.p>
          <TextSplit text="We excavate beauty from forgotten time." as="h1" delay={0.3} stagger={0.06}
            className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] text-[var(--color-ivory)] mb-0 max-w-5xl text-center" />
          <div className="h-[clamp(2.75rem,7vw,4.25rem)] shrink-0" aria-hidden="true" />
          <RevealOnScroll delay={0.9}>
            <p className="font-[family-name:var(--font-garamond)] italic text-xl text-[var(--color-mist)] max-w-[42ch] mx-auto leading-relaxed text-center">
              Everwood is not a venue. It is a living archaeology — a space built from the conviction that beauty outlives the centuries that tried to bury it.
            </p>
          </RevealOnScroll>
        </div>
        <motion.div className="absolute bottom-8 right-10 flex items-center gap-3 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-ash)]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <span>Scroll</span>
          <span className="w-10 h-[1px] bg-[var(--color-ash)]" />
        </motion.div>
      </section>

      {/* ── In figures + By the numbers: single block, dead-center in viewport ── */}
      <section
        className="grid min-h-[100dvh] min-h-screen w-full place-content-center"
        style={{
          paddingLeft: "clamp(1.25rem, 5vw, 60px)",
          paddingRight: "clamp(1.25rem, 5vw, 60px)",
          paddingTop: "clamp(1.5rem, 4vh, 2.5rem)",
          paddingBottom: "clamp(1.5rem, 4vh, 2.5rem)",
          background: "linear-gradient(180deg, transparent 0%, rgba(8, 8, 12, 0.35) 50%, transparent 100%)",
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 md:gap-14 lg:gap-16">
          <div className="flex w-full max-w-3xl items-center justify-center gap-4 sm:gap-6 md:gap-8" aria-hidden="true">
            <div className="h-px min-w-0 flex-1 max-w-[min(220px,28vw)] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.45)] to-[rgba(201,169,110,0.12)]" />
            <span
              className="shrink-0 text-center text-[0.5rem] font-medium tracking-[0.38em] uppercase text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-dm-mono)", opacity: 0.72 }}
            >
              In figures
            </span>
            <div className="h-px min-w-0 flex-1 max-w-[min(220px,28vw)] bg-gradient-to-l from-transparent via-[rgba(201,169,110,0.45)] to-[rgba(201,169,110,0.12)]" />
          </div>

          <div className="w-full">
            <p className="mb-8 text-center text-[0.7rem] tracking-[0.2em] text-[var(--color-gold)] md:mb-10">
              By the numbers
            </p>
            <div className="mx-auto grid max-w-6xl grid-cols-2 gap-[1px] bg-white/10 lg:grid-cols-4 backdrop-blur-[2px]">
              {stats.map(({ target, label, suffix }, i) => (
                <RevealOnScroll
                  key={i}
                  delay={i * 0.1}
                  className="flex min-h-[140px] flex-col items-center justify-center gap-3 bg-[rgba(12,10,14,0.62)] p-6 text-center sm:min-h-[160px] sm:p-8 md:p-10"
                >
                  <div className="font-[family-name:var(--font-playfair)] text-[clamp(2.25rem,3.8vw,3.75rem)] leading-none text-[var(--color-ivory)]">
                    <CountUp target={target} suffix={suffix} className="text-[var(--color-ivory)]" />
                  </div>
                  <p className="max-w-[22ch] text-[0.8rem] leading-relaxed text-[var(--color-mist)]">
                    {label}
                  </p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL STORY SCROLL ──────────────────── */}
      <section ref={storyRef} style={{ height: `${storyPanels.length * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div className="flex h-full" style={{ x: trackX }}>
            {storyPanels.map((panel, i) => (
              <div key={i} className="w-screen h-full flex-shrink-0 relative flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, rgba(10,9,14,0.72) 0%, rgba(18,14,20,0.58) 50%, rgba(12,10,8,0.68) 100%)` }}>
                <p className="absolute top-8 left-10 text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-ash)]">{panel.year}</p>
                <div className="max-w-lg px-10">
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-6">{panel.num}</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,3.5vw,3rem)] leading-tight mb-5 text-[var(--color-ivory)]">{panel.title}</h2>
                  <p className="font-[family-name:var(--font-garamond)] text-lg text-[var(--color-mist)] leading-relaxed">{panel.body}</p>
                </div>
                {/* Gold accent line */}
                <StoryPanelAccent index={i} panelProgress={panelProgress} />
              </div>
            ))}
          </motion.div>
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {storyPanels.map((_, i) => (
              <StoryPanelDot key={i} index={i} panelProgress={panelProgress} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────── */}
      <ManifestoSection />

      {/* ── RECOGNITION MARQUEE ──────────────────────── */}
      <section className="py-20 border-t border-white/10" style={{ background: "linear-gradient(180deg, transparent, rgba(8,8,10,0.25))" }}>
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-10" style={{ paddingLeft: "60px", paddingRight: "60px" }}>As featured in</p>
        <Marquee speed={50}>
          {recognition.map(({ pub, tag }, i) => (
            <div key={i} className="flex items-center gap-3 px-10 border-r border-white/8">
              <div className="w-1 h-1 rounded-full bg-[var(--color-gold)]" />
              <h4 className="font-[family-name:var(--font-playfair)] text-[1.1rem] text-[var(--color-mist)] whitespace-nowrap">{pub}</h4>
              <span className="text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-ash)] whitespace-nowrap">{tag}</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────── */}
      <section className="py-32 text-center relative" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
        <RevealOnScroll>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-12" />
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,4vw,3.5rem)] text-[var(--color-ivory)] mb-4">Come and see for yourself.</h2>
          <p className="font-[family-name:var(--font-garamond)] italic text-[var(--color-mist)] text-lg mb-10">The riad is open. The cabinet is waiting.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.a href="/" className="border border-[var(--color-gold)] text-[var(--color-gold)] px-8 py-3.5 text-[0.75rem] tracking-[0.15em] uppercase no-underline hover:bg-[rgba(201,169,110,0.1)] transition-all duration-200"
              whileHover={{ scale: 1.02 }}>
              View Events
            </motion.a>
            <motion.a href="/contact" className="border border-white/12 text-[var(--color-mist)] px-8 py-3.5 text-[0.75rem] tracking-[0.15em] uppercase no-underline hover:border-white/30 hover:text-[var(--color-ivory)] transition-all duration-200"
              whileHover={{ scale: 1.02 }}>
              Find Us
            </motion.a>
          </div>
        </RevealOnScroll>
      </section>

      <Footer />
      </div>
    </div>
  );
}
