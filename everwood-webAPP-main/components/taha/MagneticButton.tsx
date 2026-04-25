"use client"

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'outline' | 'ghost'
  onClick?: () => void
  href?: string
  strength?: number
  as?: 'button' | 'a'
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-label'?: string
}

export default function MagneticButton({
  children,
  className,
  variant = 'primary',
  onClick,
  href,
  strength = 0.28,
  as: Tag = 'button',
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const aRef = useRef<HTMLAnchorElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 200, damping: 18 })
  const springY = useSpring(my, { stiffness: 200, damping: 18 })

  const onMouseMove = (e: MouseEvent) => {
    if (shouldReduceMotion) return
    const el = (ref.current ?? aRef.current) as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm tracking-wide select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6FFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:pointer-events-none disabled:opacity-50'

  const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    primary:
      'bg-[#1A6FFF] text-white px-7 py-3.5 hover:bg-[#2A7FFF] shadow-[0_0_24px_rgba(26,111,255,0.4)] hover:shadow-[0_0_36px_rgba(26,111,255,0.6)]',
    outline:
      'border border-[rgba(255,255,255,0.18)] text-white px-7 py-3.5 hover:border-[#1A6FFF] hover:text-[#1A6FFF] hover:shadow-[0_0_20px_rgba(26,111,255,0.15)]',
    ghost: 'text-[#8888AA] hover:text-white px-4 py-2',
  }

  const sharedMotionProps = {
    style: { x: springX, y: springY },
    onMouseMove,
    onMouseLeave,
    className: cn(baseClasses, variantClasses[variant], className),
  }

  if (Tag === 'a') {
    return (
      <motion.a
        ref={aRef}
        href={href}
        aria-label={ariaLabel}
        {...sharedMotionProps}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...sharedMotionProps}
    >
      {children}
    </motion.button>
  )
}
