"use client"

import { useEffect } from 'react'

/**
 * Hides root-layout Everwood chrome (gold scroll bar, scroll-to-top)
 * while the taha portfolio page is mounted. Restores on unmount.
 */
export default function TahaGlobals() {
  useEffect(() => {
    // Inject overrides for fixed elements rendered by the root layout
    const style = document.createElement('style')
    style.id = 'taha-global-overrides'
    style.textContent = `
      /* Hide Everwood scroll progress bar */
      [style*="scaleX"] { opacity: 0 !important; pointer-events: none !important; }
      /* Force body background */
      body { background-color: #0A0A0A !important; }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return null
}
