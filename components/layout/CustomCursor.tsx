"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    };

    const animate = () => {
      const { mx, my } = pos.current;
      pos.current.rx += (mx - pos.current.rx) * 0.18;
      pos.current.ry += (my - pos.current.ry) * 0.18;
      dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
      ring.style.transform = `translate(${pos.current.rx - 18}px,${pos.current.ry - 18}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const setClass = (cls: string) => () => document.body.classList.add(cls);
    const rmClass = (cls: string) => () => document.body.classList.remove(cls);

    const addListeners = (sel: string, add: string) => {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener("mouseenter", setClass(add));
        el.addEventListener("mouseleave", rmClass(add));
      });
    };

    const obs = new MutationObserver(() => {
      addListeners("a, button", "cursor-link");
      addListeners("input, textarea, select", "cursor-field");
    });
    obs.observe(document.body, { childList: true, subtree: true });

    document.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div
        id="everwood-cursor"
        ref={dotRef}
        className="fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-[var(--color-gold)] pointer-events-none z-[9999]"
        style={{ willChange: "transform" }}
      />
      <div
        id="everwood-cursor-ring"
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[rgba(201,169,110,0.5)] pointer-events-none z-[9999] transition-[width,height,border-color] duration-300"
        style={{ willChange: "transform" }}
      />
      <style>{`
        body.cursor-link #everwood-cursor-ring { width: 56px; height: 56px; border-color: var(--color-gold); }
        body.cursor-field #everwood-cursor-ring { width: 2px; height: 28px; border-radius: 2px; border-color: var(--color-gold); }
      `}</style>
    </>
  );
}
