"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "resumescope_intro_seen";

/*
  Timeline (ms), about 1.8s in total:
    0    - title fades in, accent rule draws under it
    1200 - cover starts fading out; hero animations on the page start
    1800 - cover removed
*/
const LEAVE_AT = 1200;
const REMOVE_AT = 1800;

/*
  The cover is rendered on the server and styled in globals.css, so it is
  painted from the very first frame. An inline script in layout.tsx adds
  `intro-skip` or `intro-active` to <html> before paint:
    intro-skip   - seen this session, reduced motion, or not the home page
    intro-active - the intro will play; hero animations wait for it
*/
export default function IntroGate() {
  const [state, setState] = useState<"playing" | "leaving" | "gone">("playing");
  const finishedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    timersRef.current.forEach(clearTimeout);

    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}

    // Hero animations resume while the cover fades away
    document.documentElement.classList.remove("intro-active");
    setState("leaving");

    timersRef.current = [setTimeout(() => setState("gone"), REMOVE_AT - LEAVE_AT)];
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (root.classList.contains("intro-skip")) {
      finishedRef.current = true;
      setState("gone");
      return;
    }

    timersRef.current = [setTimeout(finish, LEAVE_AT)];

    const onKey = () => finish();
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      timersRef.current.forEach(clearTimeout);
      root.classList.remove("intro-active");
    };
  }, [finish]);

  if (state === "gone") return null;

  return (
    <div
      className="intro-cover"
      data-leaving={state === "leaving"}
      role="dialog"
      aria-modal="true"
      aria-label="Resume Scope"
      onClick={finish}
    >
      <h1 className="intro-title text-5xl md:text-7xl font-semibold text-ink">Resume Scope</h1>

      <div className="intro-rule" aria-hidden="true" />

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-8 right-6 md:right-10 text-sm text-ink-muted hover:text-ink transition-colors rounded-full border border-line-soft px-4 py-2"
      >
        Skip <span className="text-ink-muted/80">· Esc</span>
      </button>
    </div>
  );
}
