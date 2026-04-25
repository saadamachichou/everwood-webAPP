"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function HeroTitle({
  text,
  as: Tag = "h1",
  delay = 0,
  className = "",
  style,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll<HTMLElement>(".ht-char");
    if (!chars.length) return;

    // Start gold, rise from below the clip boundary, slight tilt → land ivory upright
    gsap.fromTo(
      chars,
      {
        yPercent: 115,
        opacity: 0,
        rotate: 5,
        color: "#C9A96E",
      },
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        color: "#F4F1E8",
        duration: 0.82,
        stagger: {
          each: 0.034,
          ease: "power1.in",
        },
        delay,
        ease: "power3.out",
        clearProps: "color",   // let CSS own color after animation
      }
    );
  }, { scope: ref });

  // Each word is an overflow-hidden wrapper (the mask) containing character spans
  const words = text.split(" ").map((word, wi) => (
    <span
      key={wi}
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "bottom",
        marginRight: "0.28em",
      }}
      aria-hidden="true"
    >
      {word.split("").map((char, ci) => (
        <span
          key={ci}
          className="ht-char"
          style={{ display: "inline-block", color: "#C9A96E" }}
        >
          {char}
        </span>
      ))}
    </span>
  ));

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      // Screen readers get the raw text; animated spans are aria-hidden
    >
      <span className="sr-only">{text}</span>
      {words}
    </Tag>
  );
}
