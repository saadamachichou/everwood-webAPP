"use client"

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function TahaCursor() {
  // Dot tracks cursor exactly
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)

  // Ring springs follow dot with lag
  const ringX = useSpring(dotX, { stiffness: 110, damping: 18, mass: 0.6 })
  const ringY = useSpring(dotY, { stiffness: 110, damping: 18, mass: 0.6 })

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Hide the root Everwood cursor while on taha page
    const eDot = document.getElementById('everwood-cursor')
    const eRing = document.getElementById('everwood-cursor-ring')
    if (eDot) eDot.style.display = 'none'
    if (eRing) eRing.style.display = 'none'

    const onMove = (e: MouseEvent) => {
      dotX.set(e.clientX)
      dotY.set(e.clientY)
    }

    const onEnterInteractive = () => {
      dotRef.current?.classList.add('taha-cursor-hover')
      ringRef.current?.classList.add('taha-ring-hover')
    }

    const onLeaveInteractive = () => {
      dotRef.current?.classList.remove('taha-cursor-hover')
      ringRef.current?.classList.remove('taha-ring-hover')
    }

    const bindInteractives = () => {
      document.querySelectorAll('a, button, [role="button"], input, select, textarea').forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive)
        el.addEventListener('mouseleave', onLeaveInteractive)
      })
    }

    const obs = new MutationObserver(bindInteractives)
    obs.observe(document.body, { childList: true, subtree: true })
    bindInteractives()

    document.addEventListener('mousemove', onMove)

    return () => {
      document.removeEventListener('mousemove', onMove)
      obs.disconnect()
      // Restore Everwood cursor when navigating away
      if (eDot) eDot.style.display = ''
      if (eRing) eRing.style.display = ''
    }
  }, [dotX, dotY])

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          .taha-portfolio * { cursor: none !important; }
        }
        @media (pointer: coarse) {
          .taha-cursor-dot, .taha-cursor-ring { display: none !important; }
        }
        .taha-cursor-hover {
          transform: scale(2.5) translate(-50%, -50%) !important;
          background-color: #00F5D4 !important;
        }
        .taha-ring-hover {
          width: 52px !important;
          height: 52px !important;
          border-color: rgba(0,245,212,0.6) !important;
        }
      `}</style>

      {/* Dot — sharp, instant */}
      <motion.div
        ref={dotRef}
        aria-hidden="true"
        className="taha-cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-[#1A6FFF] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[background-color,transform] duration-150"
        style={{ x: dotX, y: dotY, willChange: 'transform' }}
      />

      {/* Ring — spring-lagged */}
      <motion.div
        ref={ringRef}
        aria-hidden="true"
        className="taha-cursor-ring fixed top-0 left-0 w-9 h-9 rounded-full border border-[rgba(26,111,255,0.5)] pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[width,height,border-color] duration-200"
        style={{ x: ringX, y: ringY, willChange: 'transform' }}
      />
    </>
  )
}
