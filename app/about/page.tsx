"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TextSplit from "@/components/effects/TextSplit";
import Marquee from "@/components/effects/Marquee";
import RevealOnScroll from "@/components/effects/RevealOnScroll";

/** Background asset — filename contains a space */
const ABOUT_BG = "/images/nav/about%20bacground.jpeg";

/** Editorial blocks — your wording preserved; kickers add hierarchy only */
const storyBlocks = [
  {
    n: "01",
    kicker: "Found, not filled",
    body: `Everwood is built around the things we love. Almost everything you see here has been found one piece at a time. The antiques, books, decor, fabrics, chairs, and small details were discovered in antique shops, thrift stores, or made by hand. We don't buy things in bulk, and we try to avoid anything that feels mass-produced. Each piece was chosen because it has character and because it felt right in the space.`,
    dropCap: true,
  },
  {
    n: "02",
    kicker: "Nature & rhythm",
    body: `We also care about keeping a connection to nature in simple ways, through plants, natural materials, and light. In the middle of Casablanca, where life can move quickly, Everwood is meant to feel like a small pause and a place where you can slow down, enjoy a coffee and look around.`,
  },
  {
    n: "03",
    kicker: "Make together",
    body: `Alongside the café, Everwood also includes a second space dedicated to various workshops, where people can come together and create.`,
  },
  {
    n: "04",
    kicker: "In one place",
    body: `Everwood brings together antiques, nature, music, and creativity in one place, a small reminder that beauty is often found in the details.`,
    epilogue: true,
  },
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

function AboutParallaxBackdrop() {
  const { scrollY } = useScroll();

  const imgY = useTransform(scrollY, [0, 2800], [0, -160]);
  const imgScale = useTransform(scrollY, [0, 2800], [1.06, 1.14]);

  const washY = useTransform(scrollY, [0, 2800], [0, 48]);
  const washOpacity = useTransform(scrollY, [0, 1600], [0.52, 0.68]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute left-1/2 top-1/2 h-[125vh] w-[125vw] min-h-[720px] min-w-[100%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          y: imgY,
          scale: imgScale,
          backgroundImage: `url(${ABOUT_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_32%,rgba(15,17,21,0.2)_0%,rgba(15,17,21,0.68)_62%,rgba(10,11,14,0.94)_100%)]"
        style={{ y: washY, opacity: washOpacity }}
      />

      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0f1115]/72 via-[#0f1115]/58 to-[#0f1115]/84]"
        style={{ mixBlendMode: "multiply" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(58,43,68,0.1)_0%,transparent_40%,rgba(15,17,21,0.5)_100%)]" />
    </div>
  );
}

/** Horizontal inset — 8px-scale max gutter (UI/UX Pro Max: systematic spacing; ≥16px mobile gutters) */
const PAGE_INLINE = "px-[clamp(1.25rem,5vw,4rem)]";

/** Small section label + hairline — internal rhythm on 8px grid */
function SectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-6 text-center ${className}`}>
      <p className="max-w-[18em] px-2 font-[family-name:var(--font-dm-mono)] text-[0.62rem] font-medium leading-relaxed tracking-[0.28em] text-[var(--color-gold)]/85 uppercase md:tracking-[0.32em]">
        {children}
      </p>
      <div
        className="h-px w-[min(12rem,56vw)] bg-gradient-to-r from-transparent via-[rgba(201,169,110,0.42)] to-transparent md:w-[min(13rem,48vw)]"
        aria-hidden
      />
    </div>
  );
}

export default function AboutPage() {
  const dropCapClass =
    "[&::first-letter]:float-left [&::first-letter]:mr-[0.35em] [&::first-letter]:mt-[0.06em] [&::first-letter]:font-[family-name:var(--font-playfair)] [&::first-letter]:text-[clamp(2.85rem,6.5vw,3.85rem)] [&::first-letter]:leading-[0.82] [&::first-letter]:text-[var(--color-gold)] [&::first-letter]:font-normal";

  return (
    <div className="relative min-h-screen bg-[#0f1115]">
      <Navigation />
      <AboutParallaxBackdrop />

      <div className="relative z-[1]">
        {/* ── HERO ───────────────────────────────────────────────── */}
        <section
          className={`relative flex min-h-[min(100dvh,940px)] flex-col items-center justify-center overflow-hidden text-center ${PAGE_INLINE}`}
          style={{
            paddingTop: "calc(2rem + 140px + 0.75rem + env(safe-area-inset-top, 0px))",
            paddingBottom: "clamp(2.5rem, 10vh, 5.5rem)",
          }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-x-0 top-[28%] mx-auto h-[min(52vh,420px)] max-w-[min(92vw,720px)] rounded-[50%] blur-[90px]"
              style={{ background: "radial-gradient(ellipse at center, rgba(201,169,110,0.06), transparent 68%)" }}
              aria-hidden
            />
          </div>

          <div className="relative z-[1] flex w-full max-w-[46rem] flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 flex flex-col items-center md:mb-16"
            >
              <SectionLabel>About Everwood</SectionLabel>
            </motion.div>

            <TextSplit
              text="Built around what we love."
              as="h1"
              delay={0.28}
              stagger={0.042}
              className="font-[family-name:var(--font-playfair)] max-w-[46rem] text-balance text-[clamp(2.15rem,6.2vw,4.35rem)] leading-[1.06] tracking-[-0.02em] text-[var(--color-ivory)] mb-0"
            />

            <div className="h-[clamp(2rem,5vw,3.5rem)] shrink-0 md:h-[clamp(2.5rem,5vw,4rem)]" aria-hidden />

            <RevealOnScroll delay={0.08} y={22}>
              <div className="mx-auto max-w-[min(46ch,100%)] border-y border-white/[0.07] py-10 md:max-w-[48ch] md:py-12 lg:py-14">
                <p className="font-[family-name:var(--font-garamond)] text-[1.125rem] leading-[1.72] text-[var(--color-ivory)]/92 md:text-[1.1875rem] md:leading-[1.74] lg:text-[1.22rem]">
                  <span className="block font-[family-name:var(--font-playfair)] text-[1.35rem] italic leading-snug tracking-[0.01em] text-[var(--color-gold)]/95 md:text-[1.5rem] md:leading-[1.35]">
                    One piece at a time.
                  </span>
                  <span className="mt-6 block text-[var(--color-mist)] md:mt-8">
                    Antiques, books, textiles, and the smallest corners of the room — chosen for character, never to bulk out a shelf.
                  </span>
                </p>
              </div>
            </RevealOnScroll>
          </div>

          <motion.div
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 pb-[env(safe-area-inset-bottom,0)] md:left-auto md:right-12 md:translate-x-0 md:gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
          >
            <span className="font-[family-name:var(--font-dm-mono)] text-[0.62rem] tracking-[0.28em] text-[var(--color-ash)] uppercase">
              Scroll
            </span>
            <motion.span
              className="block h-px w-11 bg-gradient-to-r from-transparent via-[var(--color-gold)]/55 to-transparent"
              animate={{ opacity: [0.45, 1, 0.45], scaleX: [0.85, 1, 0.85] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "center" }}
              aria-hidden
            />
          </motion.div>
        </section>

        {/* ── STORY ───────────────────────────────────────────────── */}
        <section
          aria-labelledby="about-story-heading"
          className={`w-full ${PAGE_INLINE}`}
          style={{
            paddingTop: "clamp(3rem, 9vh, 5rem)",
            paddingBottom: "clamp(5rem, 17vh, 11rem)",
          }}
        >
          <RevealOnScroll className="mx-auto mb-16 max-w-2xl md:mb-24" y={18}>
            <h2 id="about-story-heading" className="sr-only">
              Our story
            </h2>
            <SectionLabel>The story</SectionLabel>
            <p className="mx-auto mt-10 max-w-[36ch] text-center font-[family-name:var(--font-garamond)] text-[1.0625rem] italic leading-relaxed text-[var(--color-mist)] md:mt-12 md:max-w-[38ch] md:text-[1.125rem] md:leading-[1.65]">
              A café and workshop space in Casablanca — rooted in patience, texture, and things that carry a history.
            </p>
          </RevealOnScroll>

          <div className="mx-auto flex max-w-[40rem] flex-col gap-14 md:gap-16 lg:max-w-[42rem] lg:gap-[4.5rem]">
            {storyBlocks.map((block, i) => (
              <RevealOnScroll key={block.n} delay={i * 0.05} y={26}>
                <motion.article
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  whileHover={{ y: -3 }}
                  className={`group relative overflow-hidden rounded-[2px] border border-white/[0.085] bg-[rgba(14,15,19,0.48)] px-7 py-10 shadow-[0_4px_1px_rgba(255,255,255,0.03)_inset,0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-[18px] ring-1 ring-white/[0.03] sm:px-9 sm:py-11 md:px-12 md:py-14 ${i % 2 === 1 ? "md:translate-x-[3%]" : "md:-translate-x-[3%]"}`}
                >
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-70"
                    aria-hidden
                  />
                  <div
                    className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[var(--color-gold)]/75 via-[var(--color-gold)]/25 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />

                  <header className="relative mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.065] pb-6 md:mb-8 md:pb-7">
                    <div className="flex items-baseline gap-3 md:gap-4">
                      <span className="font-[family-name:var(--font-dm-mono)] text-[0.62rem] tabular-nums tracking-[0.18em] text-[var(--color-gold)]/75">
                        {block.n}
                      </span>
                      <h3 className="font-[family-name:var(--font-playfair)] text-[0.82rem] font-normal tracking-[0.14em] text-[var(--color-ivory)] uppercase md:text-[0.84rem]">
                        {block.kicker}
                      </h3>
                    </div>
                    <span className="hidden font-[family-name:var(--font-dm-mono)] text-[0.58rem] tracking-[0.2em] text-[var(--color-ash)] uppercase sm:block">
                      Casablanca
                    </span>
                  </header>

                  <p
                    className={`relative font-[family-name:var(--font-garamond)] text-[1.0625rem] leading-[1.82] tracking-[0.01em] text-[var(--color-ivory)]/93 md:text-[1.125rem] md:leading-[1.84] lg:text-[1.15625rem] lg:leading-[1.82] ${block.dropCap ? dropCapClass : ""} ${block.epilogue ? "font-[family-name:var(--font-cormorant)] text-[1.125rem] italic text-[var(--color-ivory)]/88 md:text-[1.1875rem] lg:text-[1.25rem]" : ""}`}
                  >
                    {block.body}
                  </p>
                </motion.article>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        {/* ── RECOGNITION ─────────────────────────────────────────── */}
        <section
          className="border-t border-white/[0.055] pt-[clamp(4rem,11vw,6rem)] pb-[clamp(4.5rem,12vw,7rem)] backdrop-blur-[3px]"
          style={{ background: "linear-gradient(180deg, rgba(15,17,21,0.22) 0%, rgba(12,13,18,0.38) 100%)" }}
        >
          <div className={`mx-auto mb-14 flex max-w-6xl flex-col items-center md:mb-16 ${PAGE_INLINE}`}>
            <SectionLabel>Press & recognition</SectionLabel>
          </div>
          <Marquee speed={46}>
            {recognition.map(({ pub, tag }, i) => (
              <div key={i} className="flex items-center gap-4 border-r border-white/[0.07] px-12 md:gap-5 md:px-14 lg:px-16">
                <div className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-gold)] shadow-[0_0_12px_rgba(201,169,110,0.35)]" />
                <h4 className="font-[family-name:var(--font-playfair)] text-[1.08rem] whitespace-nowrap text-[var(--color-ivory)]/85 md:text-[1.12rem]">
                  {pub}
                </h4>
                <span className="whitespace-nowrap font-[family-name:var(--font-dm-mono)] text-[0.62rem] tracking-[0.14em] text-[var(--color-mist)] uppercase">
                  {tag}
                </span>
              </div>
            ))}
          </Marquee>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section
          className={`border-t border-white/[0.05] pt-[clamp(5rem,14vw,8.5rem)] pb-[clamp(5.5rem,15vw,10rem)] text-center backdrop-blur-[4px] ${PAGE_INLINE}`}
          style={{
            background: "linear-gradient(180deg, rgba(11,12,16,0.45) 0%, rgba(15,17,21,0.72) 100%)",
          }}
        >
          <RevealOnScroll y={20}>
            <div className="mx-auto mb-14 flex flex-col items-center gap-8 md:mb-[4.5rem] md:gap-10">
              <div className="h-16 w-px bg-gradient-to-b from-[var(--color-gold)]/90 via-[var(--color-gold)]/35 to-transparent md:h-[4.5rem]" />
              <SectionLabel>Visit</SectionLabel>
            </div>

            <h2 className="font-[family-name:var(--font-playfair)] mx-auto mb-6 max-w-[16ch] text-[clamp(1.95rem,4.2vw,3.35rem)] leading-[1.12] tracking-[-0.02em] text-[var(--color-ivory)] md:mb-8 md:max-w-none">
              Café, antiques & workshops
            </h2>
            <p className="font-[family-name:var(--font-garamond)] mx-auto mb-14 max-w-[36ch] text-[1.0625rem] italic leading-relaxed text-[var(--color-mist)] md:mb-16 md:max-w-[38ch] md:text-[1.125rem] md:leading-[1.65]">
              Stay for coffee, wander the details, or book a seat at the table — however you arrive, take your time.
            </p>

            <nav aria-label="About page links" className="flex flex-wrap justify-center gap-4 md:gap-5">
              <motion.a
                href="/events"
                className="inline-flex min-h-[48px] min-w-[11rem] items-center justify-center border border-[var(--color-gold)] bg-[rgba(201,169,110,0.12)] px-10 py-4 font-[family-name:var(--font-grotesk)] text-[0.72rem] uppercase tracking-[0.17em] text-[var(--color-gold)] no-underline shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-colors duration-200 hover:bg-[rgba(201,169,110,0.2)] sm:min-w-[11.25rem]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                Events
              </motion.a>
              <motion.a
                href="/workshops"
                className="inline-flex min-h-[48px] min-w-[11rem] items-center justify-center border border-white/[0.14] bg-transparent px-10 py-4 font-[family-name:var(--font-grotesk)] text-[0.72rem] uppercase tracking-[0.17em] text-[var(--color-mist)] no-underline transition-all duration-200 hover:border-[var(--color-gold)]/45 hover:text-[var(--color-ivory)] sm:min-w-[11.25rem]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                Workshops
              </motion.a>
              <motion.a
                href="/contact"
                className="inline-flex min-h-[48px] min-w-[11rem] items-center justify-center border border-white/[0.14] bg-transparent px-10 py-4 font-[family-name:var(--font-grotesk)] text-[0.72rem] uppercase tracking-[0.17em] text-[var(--color-mist)] no-underline transition-all duration-200 hover:border-white/28 hover:text-[var(--color-ivory)] sm:min-w-[11.25rem]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
              >
                Find us
              </motion.a>
            </nav>
          </RevealOnScroll>
        </section>
      </div>

      <Footer />
    </div>
  );
}
