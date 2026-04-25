"use client";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Props extends React.HTMLAttributes<HTMLElement> {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  stagger?: number;
}

export default function TextSplit({ text, className = "", as: Tag = "h1", delay = 0, stagger = 0.03, ...rest }: Props) {
  const words = text.split(" ");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();

  return (
    <Tag ref={ref} className={className} aria-label={text} {...(rest as any)}>
      {words.map((word, wi) => (
        <span key={wi}>
          {wi > 0 ? " " : null}
          <span className="inline-block overflow-hidden" style={{ verticalAlign: "bottom" }}>
            <motion.span
              className="inline-block"
              aria-hidden="true"
              initial={{ y: reduced ? 0 : "110%", rotate: reduced ? 0 : 4, opacity: reduced ? 1 : 0 }}
              animate={inView || reduced ? { y: 0, rotate: 0, opacity: 1 } : {}}
              transition={{
                duration: reduced ? 0 : 0.7,
                ease: [0.34, 1.56, 0.64, 1],
                delay: reduced ? 0 : delay + wi * stagger,
              }}
            >
              {word}
            </motion.span>
          </span>
        </span>
      ))}
    </Tag>
  );
}
