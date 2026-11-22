"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Motion System — "Measured Precision"
 * One unified easing, duration, and spring language across the portfolio.
 * Strictly animates GPU-composited properties (transform & opacity) only.
 */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  easeSnappy: [0.2, 0.8, 0.2, 1] as const,
  duration: {
    micro: 0.18,
    quick: 0.32,
    standard: 0.58,
    hero: 0.72,
  },
  stagger: {
    hero: 0.075,
    list: 0.055,
    badge: 0.024,
  },
  scrollSpring: {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  },
} as const;

const VIEWPORT_ONCE = { once: true, amount: 0.14 } as const;

/* -------------------------------------------------------------------------- */
/*  Hero Choreography (Signature Moment #1)                                   */
/* -------------------------------------------------------------------------- */

export function HeroStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: MOTION.stagger.hero,
            delayChildren: 0.04,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION.duration.hero,
            ease: MOTION.ease,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HeroAccentRule({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      variants={{
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
          scaleX: 1,
          opacity: 1,
          transition: {
            duration: MOTION.duration.standard,
            ease: MOTION.ease,
          },
        },
      }}
      style={{ transformOrigin: "0% 50%" }}
      className={`inline-block h-px w-5 shrink-0 bg-[var(--accent)] ${className}`}
    />
  );
}

/**
 * Masked baseline reveal for the editorial display headline.
 * Animates word-by-word inside overflow-hidden clips so line wrapping stays
 * 100% natural across every viewport width.
 */
export function MaskedHeadline({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <motion.h1
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.034,
          },
        },
      }}
      className={className}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "105%", opacity: 0 },
              visible: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: MOTION.duration.hero,
                  ease: MOTION.ease,
                },
              },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}

/**
 * Signature Moment #1 Portrait:
 * Aperture scale-settle on mount (inner image 1.06 -> 1.0) + subtle clamped
 * scroll-linked parallax drift. Always renders <motion.div> (SSR/hydration-safe)
 * and zeroes parallax automatically when prefers-reduced-motion is active.
 */
export function HeroPortraitMotion({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const smoothY = useSpring(rawY, MOTION.scrollSpring);

  return (
    <div ref={containerRef} className={className}>
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : smoothY }}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: MOTION.duration.hero,
          delay: 0.14,
          ease: MOTION.ease,
        }}
        className="will-change-transform"
      >
        <div className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_70%)] blur-2xl"
          />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/40 ring-1 ring-[var(--accent)]/15">
            <motion.div
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.95,
                delay: 0.14,
                ease: MOTION.ease,
              }}
              className="h-full w-full will-change-transform"
            >
              {children}
            </motion.div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)]/45 via-transparent to-transparent"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section Architecture & Portrait Reveal                                    */
/* -------------------------------------------------------------------------- */

export function SectionDivider() {
  return (
    <div aria-hidden="true" className="relative h-px w-full bg-[var(--border)]/45">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease: MOTION.ease }}
        style={{ transformOrigin: "0% 50%" }}
        className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/55 via-[var(--border)] to-transparent"
      />
    </div>
  );
}

export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        duration: MOTION.duration.standard,
        delay,
        ease: MOTION.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PortraitReveal({
  children,
  className = "",
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: MOTION.duration.standard,
        delay,
        ease: MOTION.ease,
      }}
      className={className}
    >
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl bg-[radial-gradient(circle_at_50%_45%,color-mix(in_srgb,var(--accent)_14%,transparent),transparent_70%)] blur-xl"
        />
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl shadow-black/30 ring-1 ring-[var(--accent)]/12">
          <motion.div
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.85,
              delay,
              ease: MOTION.ease,
            }}
            className="h-full w-full will-change-transform"
          >
            {children}
          </motion.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)]/35 via-transparent to-transparent"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Projects (Signature Moment #2)                                            */
/* -------------------------------------------------------------------------- */

export function ProjectCardMotion({
  children,
  accentTone,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  accentTone: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        duration: MOTION.duration.standard,
        delay,
        ease: MOTION.ease,
      }}
      whileHover={{
        y: -4,
        transition: { duration: MOTION.duration.quick, ease: MOTION.easeSnappy },
      }}
      whileTap={{
        scale: 0.992,
        transition: { duration: MOTION.duration.micro, ease: MOTION.easeSnappy },
      }}
      className={`relative overflow-hidden will-change-transform ${className}`}
    >
      <span
        aria-hidden="true"
        style={{ backgroundColor: accentTone }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 opacity-90 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:transition-none"
      />
      {children}
    </motion.article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Staggered Lists, Skill Badges, & Tactile Controls                         */
/* -------------------------------------------------------------------------- */

export function StaggerGroup({
  children,
  className = "",
  stagger = MOTION.stagger.list,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: MOTION.duration.standard,
            ease: MOTION.ease,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SkillBadgeList({
  items,
}: {
  items: readonly string[];
}) {
  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: MOTION.stagger.badge,
            delayChildren: 0.04,
          },
        },
      }}
      className="mt-3 flex flex-wrap gap-2"
    >
      {items.map((item) => (
        <motion.li
          key={item}
          variants={{
            hidden: { opacity: 0, y: 6 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: MOTION.duration.quick,
                ease: MOTION.ease,
              },
            },
          }}
          whileHover={{
            y: -1.5,
            transition: { duration: MOTION.duration.micro, ease: MOTION.easeSnappy },
          }}
          whileTap={{
            scale: 0.96,
            transition: { duration: MOTION.duration.micro, ease: MOTION.easeSnappy },
          }}
          className="cursor-default rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)] transition-colors duration-200 hover:border-[var(--accent)]/50 hover:text-[var(--text)]"
        >
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function MotionLinkButton({
  href,
  children,
  className = "",
  target,
  rel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}) {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      whileHover={{
        y: -1.5,
        transition: { duration: MOTION.duration.micro, ease: MOTION.easeSnappy },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: MOTION.duration.micro, ease: MOTION.easeSnappy },
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.a>
  );
}
