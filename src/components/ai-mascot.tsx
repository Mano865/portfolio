"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MOTION } from "@/components/motion-primitives";

type SectionKey =
  | "top"
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "education"
  | "contact";

interface SectionMood {
  label: string;
  caption: string;
  accent: string;
}

const SECTION_MOODS: Record<SectionKey, SectionMood> = {
  top: {
    label: "Home",
    caption: "AI & NLP Portfolio",
    accent: "#d4a373",
  },
  about: {
    label: "About",
    caption: "Background & mindset",
    accent: "#d4a373",
  },
  projects: {
    label: "Projects",
    caption: "6 AI, ML & NLP systems",
    accent: "#8fa8bf",
  },
  experience: {
    label: "Experience",
    caption: "Tracks & internships",
    accent: "#d4a373",
  },
  skills: {
    label: "Skills",
    caption: "Python, DL & NLP stack",
    accent: "#8fa8bf",
  },
  education: {
    label: "Education",
    caption: "B.Sc. AI Engineering",
    accent: "#9bb89e",
  },
  contact: {
    label: "Contact",
    caption: "Open to AI/ML roles",
    accent: "#d4a373",
  },
};

const OBSERVED_IDS: Exclude<SectionKey, "top">[] = [
  "about",
  "projects",
  "experience",
  "skills",
  "education",
  "contact",
];

/**
 * Persistent floating AI companion mascot.
 * Matches the obsidian-slate / warm sand-gold / neural steel-blue palette,
 * reacts subtly to section navigation without ever delaying or blocking UI,
 * and respects prefers-reduced-motion.
 */
export function AiMascot() {
  const prefersReducedMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [section, setSection] = useState<SectionKey>("top");
  const [captionVisible, setCaptionVisible] = useState(false);
  const [customCaption, setCustomCaption] = useState<string | null>(null);
  const [reacting, setReacting] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });

  // Defer reduced-motion prop branching until after hydration so SSR HTML and
  // initial client render match identically (avoids motion.button tabIndex mismatch).
  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const reduceMotion = hydrated && Boolean(prefersReducedMotion);

  const sectionRef = useRef<SectionKey>("top");
  const hasVisitedLowerRef = useRef(false);
  const captionTimerRef = useRef<number | null>(null);
  const reactTimerRef = useRef<number | null>(null);
  const mascotBtnRef = useRef<HTMLButtonElement>(null);

  const triggerReaction = useCallback(
    (nextSection: SectionKey, overrideCaption?: string, durationMs = 2300) => {
      sectionRef.current = nextSection;
      setSection(nextSection);
      setCustomCaption(overrideCaption ?? null);
      setCaptionVisible(true);
      setReacting(true);

      if (reactTimerRef.current !== null) {
        window.clearTimeout(reactTimerRef.current);
      }
      reactTimerRef.current = window.setTimeout(() => {
        setReacting(false);
      }, 950);

      if (captionTimerRef.current !== null) {
        window.clearTimeout(captionTimerRef.current);
      }
      captionTimerRef.current = window.setTimeout(() => {
        setCaptionVisible(false);
      }, durationMs);
    },
    []
  );

  // Initial subtle greeting after Hero settles
  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      triggerReaction("top", "AI & NLP Portfolio", 2600);
    }, 850);

    return () => {
      window.clearTimeout(introTimer);
      if (captionTimerRef.current !== null) {
        window.clearTimeout(captionTimerRef.current);
      }
      if (reactTimerRef.current !== null) {
        window.clearTimeout(reactTimerRef.current);
      }
    };
  }, [triggerReaction]);

  // Subtle periodic natural eye blink (skipped under reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;

    let blinkTimeout: number | null = null;
    let closeTimeout: number | null = null;

    const scheduleBlink = () => {
      const delay = 3200 + Math.random() * 2600;
      blinkTimeout = window.setTimeout(() => {
        setBlinking(true);
        closeTimeout = window.setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 145);
      }, delay);
    };

    scheduleBlink();
    return () => {
      if (blinkTimeout !== null) window.clearTimeout(blinkTimeout);
      if (closeTimeout !== null) window.clearTimeout(closeTimeout);
    };
  }, [prefersReducedMotion]);

  // Gentle desktop eye-gaze tracking toward pointer (passive, zero layout thrash)
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafPending = false;
    let lastX = 0;
    let lastY = 0;

    const updateGaze = () => {
      rafPending = false;
      const el = mascotBtnRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const dx = lastX - cx;
      const dy = lastY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const maxShift = 2.1;
      setGaze({
        x: (dx / dist) * Math.min(maxShift, dist * 0.012),
        y: (dy / dist) * Math.min(maxShift, dist * 0.012),
      });
    };

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(updateGaze);
      }
    };

    const onLeave = () => setGaze({ x: 0, y: 0 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [prefersReducedMotion]);

  // React to navbar jumps and organic scrolling across sections
  useEffect(() => {
    let navTimer: number | null = null;

    const onNavigate = (event: Event) => {
      const custom = event as CustomEvent<{ href?: string; id?: string }>;
      const rawId =
        custom.detail?.id ??
        (custom.detail?.href === "#top"
          ? "top"
          : custom.detail?.href?.replace(/^#/, ""));
      if (!rawId || !(rawId in SECTION_MOODS)) return;

      const key = rawId as SectionKey;
      if (key !== "top") hasVisitedLowerRef.current = true;

      // Sync subtly with the navbar wipe reveal without blocking navigation
      if (navTimer !== null) window.clearTimeout(navTimer);
      navTimer = window.setTimeout(() => {
        const homeReturnText =
          key === "top" && hasVisitedLowerRef.current
            ? "Back at the top"
            : undefined;
        triggerReaction(key, homeReturnText, 2400);
      }, 280);
    };

    const sections = OBSERVED_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const visibleMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleMap.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }

        if (window.scrollY < 200) {
          if (sectionRef.current !== "top") {
            triggerReaction(
              "top",
              hasVisitedLowerRef.current ? "Back at the top" : undefined,
              2100
            );
          }
          return;
        }

        let bestKey: SectionKey | null = null;
        let bestRatio = 0;
        for (const id of OBSERVED_IDS) {
          const ratio = visibleMap.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestKey = id;
          }
        }

        if (bestKey && bestKey !== sectionRef.current) {
          hasVisitedLowerRef.current = true;
          triggerReaction(bestKey, undefined, 2100);
        }
      },
      {
        rootMargin: "-22% 0px -52% 0px",
        threshold: [0, 0.2, 0.45],
      }
    );

    for (const s of sections) observer.observe(s);

    const onScrollTop = () => {
      if (window.scrollY < 180 && sectionRef.current !== "top") {
        triggerReaction(
          "top",
          hasVisitedLowerRef.current ? "Back at the top" : undefined,
          2100
        );
      }
    };

    window.addEventListener("portfolio:navigate", onNavigate);
    window.addEventListener("scroll", onScrollTop, { passive: true });

    return () => {
      if (navTimer !== null) window.clearTimeout(navTimer);
      observer.disconnect();
      window.removeEventListener("portfolio:navigate", onNavigate);
      window.removeEventListener("scroll", onScrollTop);
    };
  }, [triggerReaction]);

  const mood = SECTION_MOODS[section];
  const captionText = customCaption ?? mood.caption;

  return (
    <div
      data-ai-mascot="companion"
      data-section={section}
      className="pointer-events-none fixed right-4 bottom-4 z-30 flex items-center gap-2.5 sm:right-6 sm:bottom-6"
    >
      {/* Subtle non-blocking section whisper pill */}
      <AnimatePresence mode="wait">
        {captionVisible ? (
          <motion.div
            key={`${section}-${captionText}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, x: 10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 6, scale: 0.97 }}
            transition={{
              duration: MOTION.duration.quick,
              ease: MOTION.ease,
            }}
            className="pointer-events-none flex max-w-[220px] items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/92 px-3 py-1.5 text-xs shadow-lg shadow-black/35 backdrop-blur-md sm:max-w-[280px]"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: mood.accent }}
            />
            <span className="shrink-0 font-medium text-[var(--text)]">
              {mood.label}
            </span>
            <span className="hidden text-[var(--border)] sm:inline">·</span>
            <span className="hidden truncate text-[var(--muted)] sm:inline">
              {captionText}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Interactive AI Companion Avatar */}
      <motion.button
        ref={mascotBtnRef}
        type="button"
        aria-label={`AI companion — currently viewing ${mood.label}. Click for a wave.`}
        onClick={() => triggerReaction(section, mood.caption, 2400)}
        initial={{ opacity: 0, scale: 0.88, y: 10 }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
            : reacting
              ? {
                  opacity: 1,
                  scale: [1, 1.07, 0.98, 1],
                  y: [0, -7, 1, 0],
                  rotate: [0, -5, 4, 0],
                }
              : {
                  opacity: 1,
                  scale: 1,
                  y: [0, -3.5, 0],
                  rotate: 0,
                }
        }
        transition={
          reduceMotion
            ? { duration: 0.2 }
            : reacting
              ? { duration: 0.72, ease: MOTION.ease }
              : {
                  opacity: { duration: 0.5, ease: MOTION.ease },
                  scale: { duration: 0.5, ease: MOTION.ease },
                  y: {
                    duration: 3.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
        }
        whileHover={
          reduceMotion
            ? undefined
            : {
                scale: 1.06,
                transition: {
                  duration: MOTION.duration.micro,
                  ease: MOTION.easeSnappy,
                },
              }
        }
        whileTap={
          reduceMotion
            ? undefined
            : {
                scale: 0.94,
                transition: {
                  duration: MOTION.duration.micro,
                  ease: MOTION.easeSnappy,
                },
              }
        }
        className="pointer-events-auto group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)]/92 shadow-xl shadow-black/45 backdrop-blur-md transition-colors duration-200 hover:border-[var(--accent)]/60 sm:h-[54px] sm:w-[54px]"
      >
        {/* Subtle companion glow halo synced to section accent */}
        <span
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle, ${mood.accent}33 0%, transparent 72%)`,
          }}
          className="pointer-events-none absolute -inset-2 -z-10 rounded-full blur-md transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Custom AI Bot SVG */}
        <svg
          viewBox="0 0 56 56"
          fill="none"
          aria-hidden="true"
          className="h-10 w-10 sm:h-11 sm:w-11"
        >
          {/* Antenna stem */}
          <line
            x1="28"
            y1="14"
            x2="28"
            y2="7.5"
            stroke="#3a4756"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Antenna beacon */}
          <circle
            cx="28"
            cy="6.5"
            r={reacting ? 3.2 : 2.5}
            fill={mood.accent}
            className="transition-all duration-300"
          />
          <circle
            cx="28"
            cy="6.5"
            r={reacting ? 6 : 4.2}
            fill={mood.accent}
            opacity={reacting ? 0.35 : 0.16}
            className="transition-all duration-300"
          />

          {/* Side ear pods */}
          <rect x="6.5" y="24" width="3.5" height="10" rx="1.75" fill="#26303b" />
          <rect x="46" y="24" width="3.5" height="10" rx="1.75" fill="#26303b" />

          {/* Rounded futuristic head chassis */}
          <rect
            x="10"
            y="14"
            width="36"
            height="30"
            rx="12"
            fill="#161d24"
            stroke="#32404f"
            strokeWidth="1.5"
          />
          {/* Top metallic specular rim */}
          <path
            d="M19 16.2H37"
            stroke="#edf1f5"
            strokeOpacity="0.16"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Dark glass visor */}
          <rect
            x="14.5"
            y="20"
            width="27"
            height="17.5"
            rx="7.5"
            fill="#0b1015"
            stroke="#222c37"
            strokeWidth="1"
          />

          {/* Expressive AI eyes */}
          <g
            style={{
              transform: `translate(${gaze.x.toFixed(2)}px, ${gaze.y.toFixed(2)}px)`,
            }}
          >
            {reacting && !reduceMotion ? (
              /* Friendly happy crescent eyes on section arrival */
              <>
                <path
                  d="M19.5 29.2C20.5 26.8 23.5 26.8 24.5 29.2"
                  stroke={mood.accent}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M31.5 29.2C32.5 26.8 35.5 26.8 36.5 29.2"
                  stroke={mood.accent}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              /* Calm glowing pill eyes with natural blink */
              <>
                <rect
                  x="20"
                  y={blinking ? "28.3" : "25.4"}
                  width="4.2"
                  height={blinking ? "1.4" : "6.8"}
                  rx="2.1"
                  fill={mood.accent}
                />
                <rect
                  x="31.8"
                  y={blinking ? "28.3" : "25.4"}
                  width="4.2"
                  height={blinking ? "1.4" : "6.8"}
                  rx="2.1"
                  fill={mood.accent}
                />
                {!blinking ? (
                  <>
                    <circle cx="21.4" cy="27.2" r="0.9" fill="#edf1f5" opacity="0.85" />
                    <circle cx="33.2" cy="27.2" r="0.9" fill="#edf1f5" opacity="0.85" />
                  </>
                ) : null}
              </>
            )}
          </g>

          {/* Subtle neural smile / status arc below visor */}
          <path
            d="M24.5 40.4C26.2 41.6 29.8 41.6 31.5 40.4"
            stroke={mood.accent}
            strokeOpacity={reacting ? "0.9" : "0.45"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Tiny floating hover ring underneath */}
          <ellipse
            cx="28"
            cy="49.5"
            rx="10"
            ry="2"
            fill={mood.accent}
            opacity={reacting ? "0.35" : "0.18"}
          />
        </svg>
      </motion.button>
    </div>
  );
}
