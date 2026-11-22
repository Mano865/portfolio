"use client";

import { useEffect, useRef, useState } from "react";

interface CopyButtonProps {
  value: string;
  label: string;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy execCommand copy fallback
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const ok = await copyTextToClipboard(value);
    if (!ok) return;

    setCopied(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? `Copied ${label}` : `Copy ${label}`}
      title={copied ? "Copied!" : `Copy ${label}`}
      data-copy-target={label}
      data-copied={copied ? "true" : "false"}
      className={`inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors duration-200 ${
        copied
          ? "border-[var(--accent)]/60 bg-[var(--accent)]/12 text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--bg)]/70 text-[var(--muted)] hover:border-[var(--muted)]/60 hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
      }`}
    >
      {copied ? (
        <>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            className="h-3.5 w-3.5 shrink-0"
          >
            <path
              d="M3.25 8.5L6.5 11.75L12.75 4.75"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span role="status" aria-live="polite">
            Copied!
          </span>
        </>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="h-3.5 w-3.5 shrink-0"
        >
          <rect
            x="5.5"
            y="5.5"
            width="8"
            height="8"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M10.5 5.5V3.75C10.5 3.06 9.94 2.5 9.25 2.5H3.75C3.06 2.5 2.5 3.06 2.5 3.75V9.25C2.5 9.94 3.06 10.5 3.75 10.5H5.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
