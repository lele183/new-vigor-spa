"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!element || motionPreference.matches || !("IntersectionObserver" in window)) {
      return;
    }

    // Keep server-rendered content and content already in view visible.
    if (element.getBoundingClientRect().top < window.innerHeight - 40) {
      return;
    }

    element.dataset.revealState = "pending";

    const reveal = () => {
      element.dataset.revealState = "visible";
      observer.disconnect();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    const onMotionChange = () => {
      if (motionPreference.matches) reveal();
    };
    const onFocus = () => reveal();

    observer.observe(element);
    motionPreference.addEventListener("change", onMotionChange);
    element.addEventListener("focusin", onFocus);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", onMotionChange);
      element.removeEventListener("focusin", onFocus);
      delete element.dataset.revealState;
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
