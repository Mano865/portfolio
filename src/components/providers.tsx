"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, type LenisRef } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AiMascot } from "@/components/ai-mascot";
import { AiNeuralBackground } from "@/components/ai-neural-background";
import { GsapTransitionsProvider } from "@/components/gsap-transitions";

export function Providers({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AiNeuralBackground />
      {mounted && !prefersReducedMotion ? (
        <ReactLenis
          ref={lenisRef}
          root
          options={{
            autoRaf: false,
            lerp: 0.085,
            duration: 1.1,
            smoothWheel: true,
          }}
        />
      ) : null}
      <GsapTransitionsProvider lenisRef={lenisRef} ready={mounted}>
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
      </GsapTransitionsProvider>
      <AiMascot />
    </MotionConfig>
  );
}
