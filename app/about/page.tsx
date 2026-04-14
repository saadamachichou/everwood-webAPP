"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TextSplit from "@/components/effects/TextSplit";
import CountUp from "@/components/effects/CountUp";
import Marquee from "@/components/effects/Marquee";
import RevealOnScroll from "@/components/effects/RevealOnScroll";

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

const bentoItems = [
  { label: "The Grand Riad", sub: "Casablanca medina · est. 1923", area: "hero", cols: "lg:col-span-6 lg:row-span-2", h: "h-[340px] lg:h-auto", grad: "radial-gradient(ellipse at 40% 60%, #1a1228, #0d0d1a)" },
  { label: "The Courtyard", sub: "", area: "m1", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 60% 40%, #12201a, #0a120d)" },
  { label: "Cabinet Room", sub: "", area: "s1", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 30% 70%, #20121a, #120810)" },
  { label: "The Music Stage", sub: "", area: "m2", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 50% 50%, #201a10, #120e08)" },
  { label: "The Archive", sub: "", area: "s2", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 40% 60%, #10181e, #080e12)" },
  { label: "Rooftop Terrace", sub: "", area: "", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 50% 40%, #1e1810, #120e06)" },
  { label: "The Library", sub: "", area: "", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 30% 70%, #14121e, #0a0814)" },
  { label: "The Atelier", sub: "", area: "", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 50% 50%, #12201a, #0a120d)" },
  { label: "The Salon", sub: "", area: "", cols: "lg:col-span-3", h: "h-[200px]", grad: "radial-gradient(ellipse at 60% 40%, #1a1228, #0d0d1a)" },
];

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
    }}>
      <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-10">Philosophy</p>
      <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.3)", margin: "0 auto 2.5rem" }} />
      <p ref={ref} className="font-[family-name:var(--font-cormorant)] italic text-[clamp(1.4rem,2.5vw,2.1rem)] leading-relaxed" style={{ maxWidth: "52ch" }} aria-label="Philosophy quote">
        {words.map((word, i) => (
          <ManifestoWord key={i} scrollYProgress={scrollYProgress} word={word} index={i} total={words.length} />
        ))}
      </p>
    </section>
  );
}

export default function AboutPage() {
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyScroll } = useScroll({ target: storyRef, offset: ["start start", "end end"] });
  const trackX = useTransform(storyScroll, [0, 1], ["0%", `-${(storyPanels.length - 1) * 100}%`]);
  const panelProgress = useTransform(storyScroll, [0, 1], [0, storyPanels.length - 1]);

  return (
    <div className="min-h-screen bg-[var(--color-void)]">
      <Navigation />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 pt-32 overflow-hidden" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 50% 110%, rgba(201,169,110,0.09), transparent 70%)" }} />
          <motion.div className="absolute inset-0" animate={{ opacity: [0.9, 1, 0.85, 0.95, 0.9] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "radial-gradient(ellipse 30% 50% at 50% 115%, rgba(232,93,38,0.05), transparent 60%)" }} />
        </div>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--color-gold)] mb-8">
          The Archaeology
        </motion.p>
        <TextSplit text="We excavate beauty from forgotten time." as="h1" delay={0.3} stagger={0.06}
          className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] text-[var(--color-ivory)] mb-8 max-w-5xl" />
        <RevealOnScroll delay={0.9}>
          <p className="font-[family-name:var(--font-garamond)] italic text-xl text-[var(--color-mist)] max-w-[42ch] leading-relaxed">
            Everwood is not a venue. It is a living archaeology — a space built from the conviction that beauty outlives the centuries that tried to bury it.
          </p>
        </RevealOnScroll>
        <motion.div className="absolute bottom-8 right-10 flex items-center gap-3 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-ash)]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <span>Scroll</span>
          <span className="w-10 h-[1px] bg-[var(--color-ash)]" />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────── */}
      <section className="bg-[var(--color-obsidian)] py-24" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
        <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-12 max-w-6xl mx-auto">By the numbers</p>
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5">
          {stats.map(({ target, label, suffix }, i) => (
            <RevealOnScroll key={i} delay={i * 0.1} className="bg-[var(--color-obsidian)] p-10 flex flex-col gap-3">
              <div className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,4vw,4rem)] text-[var(--color-ivory)] leading-none">
                <CountUp target={target} suffix={suffix} className="text-[var(--color-ivory)]" />
              </div>
              <p className="text-[0.8rem] text-[var(--color-mist)] leading-relaxed max-w-[18ch]">{label}</p>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* ── HORIZONTAL STORY SCROLL ──────────────────── */}
      <section ref={storyRef} style={{ height: `${storyPanels.length * 100}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div className="flex h-full" style={{ x: trackX }}>
            {storyPanels.map((panel, i) => (
              <div key={i} className="w-screen h-full flex-shrink-0 relative flex items-center justify-center"
                style={{ background: `hsl(${240 + i * 5}, 30%, ${5 + i * 1.5}%)` }}>
                <p className="absolute top-8 left-10 text-[0.65rem] tracking-[0.25em] uppercase text-[var(--color-ash)]">{panel.year}</p>
                <div className="max-w-lg px-10">
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--color-gold)] mb-6">{panel.num}</p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,3.5vw,3rem)] leading-tight mb-5 text-[var(--color-ivory)]">{panel.title}</h2>
                  <p className="font-[family-name:var(--font-garamond)] text-lg text-[var(--color-mist)] leading-relaxed">{panel.body}</p>
                </div>
                {/* Gold accent line */}
                <motion.div
                  className="absolute bottom-16 left-10 h-[1px] bg-[var(--color-gold)]"
                  style={{ width: useTransform(panelProgress, [i - 0.5, i + 0.5], ["0px", "60px"]) }}
                />
              </div>
            ))}
          </motion.div>
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {storyPanels.map((_, i) => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--color-ash)]"
                style={{ backgroundColor: useTransform(panelProgress, [i - 0.4, i, i + 0.4], ["var(--color-ash)", "var(--color-gold)", "var(--color-ash)"]) }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────────── */}
      <ManifestoSection />

      {/* ── BENTO GALLERY ────────────────────────────── */}
      <section className="bg-[var(--color-obsidian)] py-24" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-gold)]">The Space</p>
            <p className="font-[family-name:var(--font-playfair)] text-4xl text-[var(--color-ash)] leading-none">09</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-12 auto-rows-[200px] gap-1">
            {bentoItems.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 0.06}
                className={`relative overflow-hidden group ${item.cols} ${i === 0 ? "col-span-2 lg:col-span-6 lg:row-span-2" : ""}`}>
                <div className="absolute inset-0 grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.04]"
                  style={{ background: item.grad }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {i === 0 && (
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[var(--color-ivory)] mb-1">{item.label}</h3>
                    <p className="text-[0.75rem] text-[var(--color-mist)]">{item.sub}</p>
                  </div>
                )}
                {i > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-[0.65rem] tracking-widest uppercase text-[var(--color-mist)]">{item.label}</p>
                  </div>
                )}
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION MARQUEE ──────────────────────── */}
      <section className="py-20 border-t border-white/5">
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
      <section className="py-32 text-center" style={{ paddingLeft: "60px", paddingRight: "60px" }}>
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
  );
}
