"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// ── All coordinates pre-computed at module scope (toFixed(3)) ────────────────
// Prevents SSR/client float-string mismatch (Math.cos/sin differ between Node+V8).
// Center: 300,300 — viewBox: 600,600

// 72 tick marks on outer ring (5° apart), 3 sizes for depth
const GC_TICKS = Array.from({ length: 72 }).map((_, i) => {
  const a     = (i * 5 - 90) * (Math.PI / 180);
  const major = i % 9 === 0;   // every 45°  → 8 long ticks
  const semi  = i % 3 === 0;   // every 15°  → 24 medium ticks
  const r1    = major ? 252 : semi ? 268 : 278;
  return {
    x1: (300 + r1  * Math.cos(a)).toFixed(3),
    y1: (300 + r1  * Math.sin(a)).toFixed(3),
    x2: (300 + 290 * Math.cos(a)).toFixed(3),
    y2: (300 + 290 * Math.sin(a)).toFixed(3),
    major, semi,
  };
});

// 12 diamond ornaments spaced 30° apart on ring A (r=235)
const GC_DIAMONDS = Array.from({ length: 12 }).map((_, i) => {
  const a  = (i * 30 - 90) * (Math.PI / 180);
  const cx = 300 + 235 * Math.cos(a);
  const cy = 300 + 235 * Math.sin(a);
  const s  = i % 3 === 0 ? 8 : 5;          // larger at cardinals
  return `M${cx.toFixed(3)},${(cy - s).toFixed(3)}` +
         `L${(cx + s).toFixed(3)},${cy.toFixed(3)}` +
         `L${cx.toFixed(3)},${(cy + s).toFixed(3)}` +
         `L${(cx - s).toFixed(3)},${cy.toFixed(3)}Z`;
});

// 6 nodes on ring B (r=195), every 60°
const GC_NODES_B = Array.from({ length: 6 }).map((_, i) => {
  const a = (i * 60 - 90) * (Math.PI / 180);
  return {
    cx: (300 + 195 * Math.cos(a)).toFixed(3),
    cy: (300 + 195 * Math.sin(a)).toFixed(3),
  };
});

// 8 nodes on ring C (r=150), every 45°
const GC_NODES_C = Array.from({ length: 8 }).map((_, i) => {
  const a = (i * 45 - 90) * (Math.PI / 180);
  return {
    cx: (300 + 150 * Math.cos(a)).toFixed(3),
    cy: (300 + 150 * Math.sin(a)).toFixed(3),
  };
});

// 8 golden ray endpoints at 22.5° offset from axes (between the axis lines)
const GC_RAYS = Array.from({ length: 8 }).map((_, i) => {
  const a = (i * 45 + 22.5 - 90) * (Math.PI / 180);
  return {
    x: (300 + 284 * Math.cos(a)).toFixed(3),
    y: (300 + 284 * Math.sin(a)).toFixed(3),
  };
});

interface Props {
  className?: string;
  style?: React.CSSProperties;
  /** Default museum gold is #C9A96E; pass e.g. #A47F4A for antique gilt */
  accent?: string;
  /** Speed multiplier for continuous rotation (>1 = faster, easier to read as motion) */
  motionBoost?: number;
}

export default function GoldenCompass({ className, style, accent, motionBoost = 1 }: Props) {
  const mid   = accent ?? "#C9A96E";
  const light = accent ? "#D4B896" : "#E8C87A";
  const dark  = accent ? "#6B4A28" : "#A07840";
  const b     = motionBoost;
  const svgRef    = useRef<SVGSVGElement>(null);
  const ringA     = useRef<SVGGElement>(null);   // r=235  very slow CW   (120s)
  const ringB     = useRef<SVGGElement>(null);   // r=195  slow CCW        (78s)
  const ringC     = useRef<SVGGElement>(null);   // r=150  medium CW       (48s)
  const ringD     = useRef<SVGGElement>(null);   // r=100  fast CCW        (26s)
  const ringE     = useRef<SVGGElement>(null);   // r=55   fastest CW      (14s)
  const alidade   = useRef<SVGGElement>(null);   // full-diameter arm      (42s)
  const glowRef   = useRef<SVGCircleElement>(null);

  useGSAP(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // ── Phase 0: hide everything ──
    gsap.set(svg.querySelectorAll(".gc-tick, .gc-ray, .gc-axis"), { opacity: 0 });

    const tl = gsap.timeline();

    // ── Phase 1: Outer static ring draws in (0 – 2.8s) ──
    const outerRing = svg.querySelector<SVGCircleElement>(".gc-outer-ring");
    if (outerRing) {
      const len = 2 * Math.PI * 292;
      gsap.set(outerRing, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(outerRing, { strokeDashoffset: 0, duration: 2.8, ease: "power2.inOut" }, 0);
    }

    // ── Phase 2: Tick marks — stagger in by angle (0.6 – 1.6s) ──
    tl.to(svg.querySelectorAll(".gc-tick"), {
      opacity: 1, duration: 0.6,
      stagger: { each: 0.01, from: "start" },
      ease: "power1.out",
    }, 0.6);

    // ── Phase 3: Axis lines (1.0 – 1.6s) ──
    tl.to(svg.querySelectorAll(".gc-axis"), {
      opacity: 1, duration: 0.5, stagger: 0.08, ease: "power1.out",
    }, 1.0);

    // ── Phase 4: Golden rays burst in (1.2 – 1.8s) ──
    tl.from(svg.querySelectorAll(".gc-ray"), {
      opacity: 0, scaleY: 0, duration: 0.55,
      stagger: 0.05, transformOrigin: "300px 300px", ease: "back.out(2)",
    }, 1.2);
    tl.to(svg.querySelectorAll(".gc-ray"), { opacity: 1 }, 1.2);

    // ── Phase 5: Each ring draws in sequentially ──
    const ringCircles = svg.querySelectorAll<SVGCircleElement>(".gc-ring-draw");
    ringCircles.forEach((circle, i) => {
      const r   = parseFloat(circle.getAttribute("r") ?? "0");
      const len = 2 * Math.PI * r;
      gsap.set(circle, { strokeDasharray: len, strokeDashoffset: len });
      tl.to(circle, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 1.0 + i * 0.28);
    });

    // ── Phase 6: Decorative elements pop in ──
    tl.from(svg.querySelectorAll(".gc-deco"), {
      opacity: 0, scale: 0.5, duration: 0.45,
      stagger: 0.03, transformOrigin: "center center", ease: "back.out(2.5)",
    }, 1.6);

    // ── Phase 7: Alidade fades in ──
    tl.from(alidade.current, { opacity: 0, duration: 0.7, ease: "power2.out" }, 2.0);

    // ── Phase 8: Center ornament ──
    tl.from(svg.querySelectorAll(".gc-center"), {
      opacity: 0, scale: 0, duration: 0.6, stagger: 0.12,
      transformOrigin: "300px 300px", ease: "back.out(2)",
    }, 2.2);

    // ─── Continuous rotations (start immediately, run forever) ───────────────
    const origin = "300px 300px";
    gsap.to(ringA.current,   { rotation:  360, transformOrigin: origin, duration: 120 / b, repeat: -1, ease: "none" });
    gsap.to(ringB.current,   { rotation: -360, transformOrigin: origin, duration: 78 / b,  repeat: -1, ease: "none" });
    gsap.to(ringC.current,   { rotation:  360, transformOrigin: origin, duration: 48 / b,  repeat: -1, ease: "none" });
    gsap.to(ringD.current,   { rotation: -360, transformOrigin: origin, duration: 26 / b,  repeat: -1, ease: "none" });
    gsap.to(ringE.current,   { rotation:  360, transformOrigin: origin, duration: 14 / b,  repeat: -1, ease: "none" });
    gsap.to(alidade.current, { rotation:  360, transformOrigin: origin, duration: 42 / b,  repeat: -1, ease: "none" });

    // ─── Center glow pulse ────────────────────────────────────────────────────
    gsap.to(glowRef.current, {
      attr: { r: 32 }, opacity: 0.5,
      duration: 3.0, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
  }, { scope: svgRef, dependencies: [motionBoost] });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 600 600"
      fill="none"
      width="100%"
      height="100%"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <defs>
        {/* Warm gold gradient for key strokes */}
        <linearGradient id="gc-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={light} />
          <stop offset="50%"  stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        {/* Outer glow filter */}
        <filter id="gc-glow-lg" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Small detail glow */}
        <filter id="gc-glow-sm" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Radial ambient fill */}
        <radialGradient id="gc-ambient" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={mid} stopOpacity="0.08" />
          <stop offset="70%"  stopColor={mid} stopOpacity="0.02" />
          <stop offset="100%" stopColor={mid} stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* Ambient fill */}
      <circle cx="300" cy="300" r="295" fill="url(#gc-ambient)" />

      {/* ── OUTER STATIC RING — draws in ── */}
      <circle className="gc-outer-ring" cx="300" cy="300" r="292"
        stroke="url(#gc-gold)" strokeWidth="0.7" opacity="0.6" />

      {/* 72 tick marks */}
      {GC_TICKS.map((t, i) => (
        <line key={i} className="gc-tick"
          x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
          stroke={mid}
          strokeWidth={t.major ? "1.1" : t.semi ? "0.7" : "0.4"}
          opacity={t.major ? "0.7" : t.semi ? "0.45" : "0.22"}
        />
      ))}

      {/* Axis lines (H, V, diagonals) */}
      {[
        ["12", "300", "588", "300"],
        ["300", "12", "300", "588"],
        ["91", "91",  "509", "509"],
        ["509", "91", "91",  "509"],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} className="gc-axis"
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={mid} strokeWidth="0.35" opacity="0.18"
        />
      ))}

      {/* 8 golden rays at 22.5° offsets */}
      {GC_RAYS.map((r, i) => (
        <line key={i} className="gc-ray"
          x1="300" y1="300" x2={r.x} y2={r.y}
          stroke={mid} strokeWidth="0.5" opacity="0.14"
        />
      ))}

      {/* ── RING A — r=235, very slow CW (120s) ── */}
      <g ref={ringA}>
        <circle className="gc-ring-draw" cx="300" cy="300" r="235"
          stroke="url(#gc-gold)" strokeWidth="0.7" opacity="0.5" />
        <circle cx="300" cy="300" r="228"
          stroke={mid} strokeWidth="0.25" opacity="0.15" strokeDasharray="5 12" />
        {GC_DIAMONDS.map((d, i) => (
          <path key={i} className="gc-deco" d={d} fill={mid}
            opacity={i % 3 === 0 ? "0.55" : "0.35"}
            filter={i % 3 === 0 ? "url(#gc-glow-sm)" : undefined}
          />
        ))}
      </g>

      {/* ── RING B — r=195, slow CCW (78s) ── */}
      <g ref={ringB}>
        <circle className="gc-ring-draw" cx="300" cy="300" r="195"
          stroke={mid} strokeWidth="0.6" opacity="0.45" />
        <circle cx="300" cy="300" r="186"
          stroke={mid} strokeWidth="0.22" opacity="0.14" strokeDasharray="8 16" />
        {GC_NODES_B.map((n, i) => (
          <circle key={i} className="gc-deco"
            cx={n.cx} cy={n.cy} r="4.5"
            stroke={mid} strokeWidth="0.7" fill="none" opacity="0.6"
            filter="url(#gc-glow-sm)"
          />
        ))}
        {/* Radial spokes between nodes */}
        {GC_NODES_B.map((n, i) => (
          <line key={i}
            x1="300" y1="300" x2={n.cx} y2={n.cy}
            stroke={mid} strokeWidth="0.3" opacity="0.12"
          />
        ))}
      </g>

      {/* ── RING C — r=150, medium CW (48s) ── */}
      <g ref={ringC}>
        <circle className="gc-ring-draw" cx="300" cy="300" r="150"
          stroke={mid} strokeWidth="0.6" opacity="0.5" />
        <circle cx="300" cy="300" r="143"
          stroke={mid} strokeWidth="0.2" opacity="0.14" strokeDasharray="4 8" />
        {GC_NODES_C.map((n, i) => (
          <circle key={i} className="gc-deco"
            cx={n.cx} cy={n.cy} r="3.5"
            stroke={mid} strokeWidth="0.65" fill="none" opacity="0.55"
          />
        ))}
        {GC_NODES_C.map((n, i) => (
          <line key={i}
            x1="300" y1="300" x2={n.cx} y2={n.cy}
            stroke={mid} strokeWidth="0.25" opacity="0.15"
          />
        ))}
      </g>

      {/* ── RING D — r=100, fast CCW (26s) ── */}
      <g ref={ringD}>
        <circle className="gc-ring-draw" cx="300" cy="300" r="100"
          stroke={mid} strokeWidth="0.55" opacity="0.45" />
        <circle cx="300" cy="300" r="93"
          stroke={mid} strokeWidth="0.2" opacity="0.12" strokeDasharray="3 7" />
        {/* 4 cross-marks at cardinal positions inside ring D */}
        {[0, 90, 180, 270].map((deg, i) => {
          const a  = (deg - 90) * (Math.PI / 180);
          const cx = (300 + 100 * Math.cos(a)).toFixed(3);
          const cy = (300 + 100 * Math.sin(a)).toFixed(3);
          return (
            <circle key={i} cx={cx} cy={cy} r="2.5"
              fill={mid} opacity="0.55" filter="url(#gc-glow-sm)" />
          );
        })}
      </g>

      {/* ── RING E — r=55, fastest CW (14s) ── */}
      <g ref={ringE}>
        <circle className="gc-ring-draw" cx="300" cy="300" r="55"
          stroke="url(#gc-gold)" strokeWidth="0.65" opacity="0.6" />
        {/* North arm */}
        <line x1="300" y1="250" x2="300" y2="300"
          stroke={mid} strokeWidth="0.9" opacity="0.7" />
        {/* North arrowhead */}
        <path d="M300,248 L296,262 L300,257 L304,262 Z"
          fill={mid} opacity="0.85" filter="url(#gc-glow-sm)" />
        {/* South short arm */}
        <line x1="300" y1="300" x2="300" y2="338"
          stroke={mid} strokeWidth="0.55" opacity="0.4" />
        {/* East/West arms */}
        <line x1="255" y1="300" x2="345" y2="300"
          stroke={mid} strokeWidth="0.5" opacity="0.35" />
        {/* Inner dot ring */}
        <circle cx="300" cy="300" r="28"
          stroke={mid} strokeWidth="0.4" opacity="0.25" strokeDasharray="2 4" />
      </g>

      {/* ── ALIDADE — thin rotating arm through center (42s CW) ── */}
      <g ref={alidade}>
        <line x1="300" y1="16" x2="300" y2="360"
          stroke={mid} strokeWidth="0.7" opacity="0.35" />
        {/* Tip diamond */}
        <path d="M300,16 L296.5,30 L300,25 L303.5,30 Z"
          fill={mid} opacity="0.55" />
        {/* Pivot circle */}
        <circle cx="300" cy="300" r="5"
          stroke={mid} strokeWidth="0.6" fill="none" opacity="0.45" />
      </g>

      {/* ── CENTER ORNAMENT (static) ── */}
      <circle className="gc-center" cx="300" cy="300" r="24"
        stroke={mid} strokeWidth="0.6" opacity="0.4" />
      <circle className="gc-center" cx="300" cy="300" r="14"
        stroke="url(#gc-gold)" strokeWidth="0.8" fill="none" opacity="0.7" />
      <circle className="gc-center" cx="300" cy="300" r="6"
        fill={mid} opacity="0.9" filter="url(#gc-glow-sm)" />

      {/* Pulsing center glow */}
      <circle ref={glowRef} cx="300" cy="300" r="18"
        fill={mid} opacity="0.22" filter="url(#gc-glow-lg)" />
    </svg>
  );
}
