"use client"

import { useReducedMotion } from 'framer-motion'

interface Props {
  className?: string
  opacity?: number
  color?: string
  lineCount?: number
  speed?: 'slow' | 'normal' | 'fast'
}

const speeds = { slow: '18s', normal: '12s', fast: '7s' }

export default function SoundWave({
  className = '',
  opacity = 0.18,
  color = '#1A6FFF',
  lineCount = 4,
  speed = 'normal',
}: Props) {
  const shouldReduceMotion = useReducedMotion()

  // Build multiple sine-wave paths with varying phases/amplitudes
  const buildWavePath = (amplitude: number, frequency: number, yBase: number, phaseShift: number) => {
    const width = 2400
    const points: string[] = []
    const step = 8

    for (let x = 0; x <= width; x += step) {
      const y = yBase + amplitude * Math.sin((x / width) * Math.PI * 2 * frequency + phaseShift)
      points.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(2)}`)
    }
    return points.join(' ')
  }

  const waves = Array.from({ length: lineCount }, (_, i) => ({
    amplitude: 12 + i * 6,
    frequency: 3 + i * 0.7,
    yBase: 50 + i * 18,
    phaseShift: (i * Math.PI) / 2.5,
    opacity: 1 - i * 0.18,
    strokeWidth: 1.2 - i * 0.15,
    duration: parseFloat(speeds[speed]) + i * 2.5,
    delay: i * 0.8,
  }))

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1200 130"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="taha-wave-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="20%" stopColor={color} stopOpacity="1" />
            <stop offset="80%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {waves.map((w, i) => (
          <g key={i}>
            <path
              d={buildWavePath(w.amplitude, w.frequency, w.yBase, w.phaseShift)}
              fill="none"
              stroke={`url(#taha-wave-grad)`}
              strokeWidth={w.strokeWidth}
              strokeOpacity={w.opacity}
              style={
                shouldReduceMotion
                  ? {}
                  : {
                      animation: `taha-wave-scroll ${w.duration}s linear ${w.delay}s infinite`,
                    }
              }
            />
          </g>
        ))}
      </svg>
      <style>{`
        @keyframes taha-wave-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// Deterministic pseudo-random — same output on server and client
function seeded(i: number, salt: number): number {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return Math.abs(x - Math.floor(x))
}

// ─── Frequency Bars variant (for contact section) ────────────────────────────

export function FrequencyBars({
  className = '',
  barCount = 40,
  color = '#1A6FFF',
  opacity = 0.12,
}: {
  className?: string
  barCount?: number
  color?: string
  opacity?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none flex items-end justify-center gap-[3px] px-8 pb-0 ${className}`}
      style={{ opacity }}
    >
      {Array.from({ length: barCount }, (_, i) => {
        const height   = 20 + seeded(i, 0) * 60
        const delay    = seeded(i, 1) * 1.5
        const duration = 0.8 + seeded(i, 2) * 0.8
        return (
          <div
            key={i}
            suppressHydrationWarning
            className="flex-1 rounded-t-sm"
            style={{
              height: `${height}%`,
              background: color,
              transformOrigin: 'bottom',
              animation: shouldReduceMotion
                ? undefined
                : `taha-bar-pulse ${duration}s ease-in-out ${delay}s infinite alternate`,
            }}
          />
        )
      })}
      <style>{`
        @keyframes taha-bar-pulse {
          0%   { transform: scaleY(0.2); opacity: 0.5; }
          100% { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
