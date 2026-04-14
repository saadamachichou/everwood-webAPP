"use client";
import { useRef } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderColor?: string;
  duration?: number;
}

export function MovingBorder({ children, className, containerClassName, borderColor = "var(--color-gold)", duration = 3000 }: Props) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const len = pathRef.current?.getTotalLength?.() ?? 400;
    if (len) {
      const pct = (time % duration) / duration;
      progress.set(pct * len);
    }
  });

  const x = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v)?.x ?? 0);
  const y = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v)?.y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div className={cn("relative p-[1px] overflow-hidden", containerClassName)}>
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <rect ref={pathRef} fill="none" width="100%" height="100%" rx="0" />
        </svg>
        <motion.div
          className="absolute h-12 w-12 opacity-80"
          style={{
            background: `radial-gradient(circle at center, ${borderColor}, transparent 70%)`,
            transform,
          }}
        />
      </div>
      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}
