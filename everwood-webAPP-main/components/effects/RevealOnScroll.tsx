"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}

export default function RevealOnScroll({ children, delay = 0, className = "", y = 30, ...rest }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : delay }}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
}
