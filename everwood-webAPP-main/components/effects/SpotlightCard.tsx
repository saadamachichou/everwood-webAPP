"use client";
import { useRef, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({ children, className, spotlightColor = "rgba(201,169,110,0.06)", ...rest }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 70%), var(--card-bg, var(--color-iron))`;
  };

  const onMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.background = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("relative transition-all duration-300", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
