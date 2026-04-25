"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export default function Marquee({ children, speed = 40, className = "" }: Props) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)" }}
    >
      <motion.div
        className="flex w-max gap-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{ animationPlayState: paused ? "paused" : "running" }}
        onHoverStart={() => setPaused(true)}
        onHoverEnd={() => setPaused(false)}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
