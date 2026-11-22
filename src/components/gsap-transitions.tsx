"use client";

import type { LenisRef } from "lenis/react";
import { cancelFrame, frame, useReducedMotion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type GsapModule = typeof import("gsap")["gsap"];
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];

interface TransitionContextValue {
  navigateToSection: (
    href: string,
    label: string,
    fallbackScroll: () => void
  ) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateToSection: (_href, _label, fallbackScroll) => fallbackScroll(),
});

export function useSectionTransition() {
  return useContext(TransitionContext);
}

/**
 * Purely additive editorial word wrapper for scroll-scrubbed opacity reading.
 * Renders identical typography/spacing when GSAP hasn't loaded or under reduced motion.
 */
export function TextScrub({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <p data-gsap="text-scrub" className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} data-gsap="scrub-word">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

export function GsapTransitionsProvider({
  children,
  lenisRef,
  ready,
}: {
  children: ReactNode;
  lenisRef: RefObject<LenisRef | null>;
  ready: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const gsapRef = useRef<GsapModule | null>(null);
  const stRef = useRef<ScrollTriggerModule | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const labelWrapRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const [wipeLabel, setWipeLabel] = useState("");

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;
    let mm: ReturnType<GsapModule["matchMedia"]> | null = null;
    let gsapTickerCallback: ((time: number) => void) | null = null;
    let lenisUnsubscribe: (() => void) | null = null;
    let motionUpdateActive = false;

    // 1. Before GSAP lazy-loads, drive Lenis via Motion's frame loop (single RAF).
    function motionUpdate({ timestamp }: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(timestamp);
    }

    if (!prefersReducedMotion) {
      frame.update(motionUpdate, true);
      motionUpdateActive = true;
    }

    // 2. Lazy-load GSAP + ScrollTrigger on the client so it stays out of the initial bundle.
    async function initGsap() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;
      stRef.current = ScrollTrigger;

      // Hand off Lenis RAF cleanly from Motion's frame loop to GSAP's ticker (single RAF loop).
      if (!prefersReducedMotion) {
        if (motionUpdateActive) {
          cancelFrame(motionUpdate);
          motionUpdateActive = false;
        }

        const lenisInstance = lenisRef.current?.lenis;
        if (lenisInstance) {
          lenisInstance.on("scroll", ScrollTrigger.update);
          lenisUnsubscribe = () => {
            lenisInstance.off("scroll", ScrollTrigger.update);
          };
        }

        gsapTickerCallback = (time: number) => {
          lenisRef.current?.lenis?.raf(time * 1000);
        };
        gsap.ticker.add(gsapTickerCallback);
        gsap.ticker.lagSmoothing(0);
      }

      // 3. Register responsive & reduced-motion-aware additive ScrollTrigger layers.
      mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          // Transition 1A: Hero -> About scrubbed aperture clip-path reveal
          const aboutCurtain = document.querySelector<HTMLElement>(
            '[data-gsap="about-curtain"]'
          );
          if (aboutCurtain && !reduceMotion) {
            gsap.fromTo(
              aboutCurtain,
              {
                clipPath: isDesktop
                  ? "inset(7% 2.5% 0% 2.5% round 20px)"
                  : "inset(4% 0% 0% 0% round 12px)",
              },
              {
                clipPath: "inset(0% 0% 0% 0% round 0px)",
                ease: "none",
                scrollTrigger: {
                  trigger: aboutCurtain,
                  start: "top 95%",
                  end: "top 28%",
                  scrub: 0.6,
                },
              }
            );
          }

          // Transition 1B: Editorial text-scrub statement in About (opacity only)
          const scrubContainer = document.querySelector<HTMLElement>(
            '[data-gsap="text-scrub"]'
          );
          const scrubWords = document.querySelectorAll<HTMLElement>(
            '[data-gsap="scrub-word"]'
          );
          if (scrubContainer && scrubWords.length > 0 && !reduceMotion) {
            gsap.fromTo(
              scrubWords,
              { opacity: 0.28 },
              {
                opacity: 1,
                stagger: 0.05,
                ease: "none",
                scrollTrigger: {
                  trigger: scrubContainer,
                  start: "top 86%",
                  end: "bottom 42%",
                  scrub: 0.5,
                },
              }
            );
          }

          // Transition 2A: Desktop-only dual-column subtle depth cadence on Projects
          // Placed on outer column wrapper (never directly on ProjectCardMotion <article>).
          if (isDesktop && !reduceMotion) {
            const shiftedCols = document.querySelectorAll<HTMLElement>(
              '[data-gsap="project-shift"]'
            );
            shiftedCols.forEach((col) => {
              gsap.fromTo(
                col,
                { y: 24 },
                {
                  y: -10,
                  ease: "none",
                  scrollTrigger: {
                    trigger: col,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.7,
                  },
                }
              );
            });
          }

          // Transition 2B: Contact finale aperture unveil
          // Under reduceMotion, parent <SectionReveal> already provides the clean opacity fade.
          const contactCurtain = document.querySelector<HTMLElement>(
            '[data-gsap="contact-curtain"]'
          );
          if (contactCurtain && !reduceMotion) {
            gsap.fromTo(
              contactCurtain,
              {
                clipPath: isDesktop
                  ? "inset(0% 3.5% 8% 3.5% round 20px)"
                  : "inset(0% 0% 5% 0% round 14px)",
              },
              {
                clipPath: "inset(0% 0% 0% 0% round 12px)",
                ease: "none",
                scrollTrigger: {
                  trigger: contactCurtain,
                  start: "top 96%",
                  end: "top 65%",
                  scrub: 0.55,
                },
              }
            );
          }
        }
      );

      // Safe refresh after layout/fonts settle
      ScrollTrigger.refresh(true);
    }

    void initGsap();

    return () => {
      cancelled = true;
      if (motionUpdateActive) {
        cancelFrame(motionUpdate);
      }
      if (lenisUnsubscribe) {
        lenisUnsubscribe();
      }
      if (gsapTickerCallback && gsapRef.current) {
        gsapRef.current.ticker.remove(gsapTickerCallback);
      }
      if (mm) {
        mm.revert();
      }
    };
  }, [lenisRef, prefersReducedMotion, ready]);

  // Transition 3: Directional architectural wipe for navbar section jumps
  const navigateToSection = useCallback(
    (href: string, label: string, fallbackScroll: () => void) => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) {
        fallbackScroll();
        return;
      }

      const gsap = gsapRef.current;
      const ScrollTrigger = stRef.current;
      const overlay = overlayRef.current;
      const hairline = hairlineRef.current;
      const labelWrap = labelWrapRef.current;

      // Fallback cleanly if GSAP hasn't lazy-loaded yet or mid-transition
      if (!gsap || !overlay || isTransitioningRef.current) {
        fallbackScroll();
        return;
      }

      const targetTop =
        href === "#top"
          ? 0
          : Math.max(0, target.getBoundingClientRect().top + window.scrollY - 72);
      const distance = Math.abs(targetTop - window.scrollY);

      // Skip curtain if already essentially at the target
      if (distance < 60) {
        fallbackScroll();
        return;
      }

      const scrollingDown = targetTop > window.scrollY;
      isTransitioningRef.current = true;
      setWipeLabel(label);

      const jumpNow = () => {
        const lenis = lenisRef.current?.lenis;
        if (lenis && !prefersReducedMotion) {
          lenis.scrollTo(target, { offset: href === "#top" ? 0 : -72, immediate: true });
        } else {
          window.scrollTo({ top: targetTop, behavior: "auto" });
        }
        if (window.location.hash !== href && href !== "#top") {
          window.history.replaceState(null, "", href);
        } else if (href === "#top" && window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
        ScrollTrigger?.update();
      };

      // Reduced motion: simple, calm opacity veil (no clip-path sweep, no transform)
      if (prefersReducedMotion) {
        gsap.set(overlay, {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 0,
        });
        if (labelWrap) gsap.set(labelWrap, { opacity: 0 });
        if (hairline) gsap.set(hairline, { opacity: 0 });

        gsap
          .timeline({
            onComplete: () => {
              isTransitioningRef.current = false;
            },
          })
          .to(overlay, { opacity: 0.72, duration: 0.14, ease: "power2.out" })
          .add(jumpNow)
          .to(overlay, { opacity: 0, duration: 0.2, ease: "power2.inOut" });
        return;
      }

      const startClip = scrollingDown
        ? "inset(100% 0% 0% 0%)"
        : "inset(0% 0% 100% 0%)";
      const exitClip = scrollingDown
        ? "inset(0% 0% 100% 0%)"
        : "inset(100% 0% 0% 0%)";

      const isMobile = window.innerWidth < 768;
      const inDuration = isMobile ? 0.2 : 0.25;
      const outDuration = isMobile ? 0.26 : 0.32;

      gsap.set(overlay, { opacity: 1, clipPath: startClip });
      if (hairline) {
        gsap.set(hairline, {
          opacity: 1,
          scaleX: 0,
          transformOrigin: "0% 50%",
        });
      }
      if (labelWrap) {
        gsap.set(labelWrap, { opacity: 0, y: scrollingDown ? 10 : -10 });
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" });
          isTransitioningRef.current = false;
        },
      });

      tl.to(overlay, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: inDuration,
        ease: "power3.inOut",
      });

      if (hairline) {
        tl.to(
          hairline,
          { scaleX: 1, duration: inDuration * 0.85, ease: "expo.out" },
          "<0.04"
        );
      }

      if (labelWrap) {
        tl.to(
          labelWrap,
          { opacity: 1, y: 0, duration: 0.16, ease: "power3.out" },
          "<0.06"
        );
      }

      tl.add(jumpNow);

      if (labelWrap) {
        tl.to(
          labelWrap,
          { opacity: 0, y: scrollingDown ? -8 : 8, duration: 0.12, ease: "power2.in" },
          "+=0.04"
        );
      }

      tl.to(
        overlay,
        {
          clipPath: exitClip,
          duration: outDuration,
          ease: "expo.inOut",
        },
        "-=0.04"
      );
    },
    [lenisRef, prefersReducedMotion]
  );

  return (
    <TransitionContext.Provider value={{ navigateToSection }}>
      {children}

      {/* Non-blocking directional wipe layer for navbar jumps */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)",
        }}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)] will-change-[clip-path,opacity]"
      >
        <div
          ref={hairlineRef}
          className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]"
        />
        <div
          ref={labelWrapRef}
          className="flex items-center gap-3 text-xs tracking-[0.18em] text-[var(--muted)] uppercase"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          <span>{wipeLabel}</span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
