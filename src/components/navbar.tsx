"use client";

import { useLenis } from "lenis/react";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { useSectionTransition } from "@/components/gsap-transitions";
import { MOTION } from "@/components/motion-primitives";
import { PORTFOLIO } from "@/data/portfolio";

const NAV_ITEMS = [
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Education", href: "#education", id: "education" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;

export function Navbar() {
  const lenis = useLenis();
  const { navigateToSection } = useSectionTransition();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, MOTION.scrollSpring);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const visibleRatios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRatios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }

        if (window.scrollY < 180) {
          setActiveId(null);
          return;
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        for (const item of NAV_ITEMS) {
          const ratio = visibleRatios.get(item.id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = item.id;
          }
        }
        if (bestId) {
          setActiveId(bestId);
        }
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.6],
      }
    );

    for (const section of sections) {
      observer.observe(section);
    }

    const handleScrollTop = () => {
      if (window.scrollY < 180) {
        setActiveId(null);
      }
    };
    window.addEventListener("scroll", handleScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollTop);
    };
  }, []);

  function handleAnchorClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
    id?: string
  ) {
    if (id) {
      setActiveId(id);
    } else if (href === "#top") {
      setActiveId(null);
    }
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    navigateToSection(href, label, () => {
      if (lenis) {
        lenis.scrollTo(target, { offset: href === "#top" ? 0 : -72 });
      } else {
        target.scrollIntoView({ behavior: "auto" });
      }
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <motion.a
          href="#top"
          onClick={(e) => handleAnchorClick(e, "#top", PORTFOLIO.shortName)}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: MOTION.duration.micro, ease: MOTION.easeSnappy }}
          className="text-sm font-medium tracking-tight text-[var(--text)] transition-colors hover:text-[var(--accent)]"
        >
          {PORTFOLIO.shortName}
        </motion.a>

        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-4 sm:gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <motion.a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) =>
                  handleAnchorClick(e, item.href, item.label, item.id)
                }
                whileTap={{ scale: 0.96 }}
                transition={{
                  duration: MOTION.duration.micro,
                  ease: MOTION.easeSnappy,
                }}
                className={`relative py-0.5 text-sm transition-colors duration-200 ${isActive
                  ? "text-[var(--text)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
              >
                {item.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-indicator"
                    transition={{
                      duration: MOTION.duration.quick,
                      ease: MOTION.ease,
                    }}
                    className="pointer-events-none absolute inset-x-0 -bottom-1 h-[1.5px] rounded-full bg-[var(--accent)]"
                  />
                ) : null}
              </motion.a>
            );
          })}
          <motion.a
            href={PORTFOLIO.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: MOTION.duration.micro, ease: MOTION.easeSnappy }}
            className="group inline-flex items-center gap-1 text-sm text-[var(--accent)] transition-opacity hover:opacity-85"
          >
            <span>LinkedIn</span>
            <span
              aria-hidden="true"
              className="inline-block text-xs transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transition-none"
            >
              ↗
            </span>
          </motion.a>
        </nav>
      </div>

      {/* Scroll progress indicator (GPU scaleX only) */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[var(--accent)]/80"
      />
    </header>
  );
}
