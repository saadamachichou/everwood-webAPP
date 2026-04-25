"use client";
import { useRef } from "react";
import { useInView, useMotionValue, useSpring, motion, useTransform } from "framer-motion";
import { useEffect } from "react";

interface Props {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export default function CountUp({ target, suffix = "", prefix = "", duration = 2, className = "", decimals = 0 }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const val = useMotionValue(0);
  const spring = useSpring(val, { stiffness: 40, damping: 8 });

  useEffect(() => {
    if (inView) val.set(target);
  }, [inView, val, target]);

  const display = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString()
  );

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
