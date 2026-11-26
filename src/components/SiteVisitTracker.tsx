"use client";

import { useEffect } from "react";
import { apiBaseUrl } from "@/lib/api/utils/api";

const STORAGE_KEY = "paroquia_site_visit_date";

function getTodaySaoPaulo(): string {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;

    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  } catch {
    // Fallback to local ISO date
  }
  return new Date().toISOString().slice(0, 10);
}

export function SiteVisitTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!apiBaseUrl) return;

    // Ignore automated browser drivers (bots / headless)
    if (navigator.webdriver) return;

    const today = getTodaySaoPaulo();

    // Check localStorage cache first — 0 requests if already counted today
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === today) {
        return;
      }
    } catch {
      // Ignore storage access errors (e.g. private browsing restrictions)
    }

    let triggered = false;
    let timerId: number | undefined;

    const cleanup = () => {
      window.removeEventListener("scroll", onHumanSignal);
      window.removeEventListener("pointerdown", onHumanSignal);
      window.removeEventListener("keydown", onHumanSignal);
      window.removeEventListener("touchstart", onHumanSignal);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
        timerId = undefined;
      }
    };

    const sendVisit = () => {
      const dispatch = () => {
        const entryPath = window.location.pathname || "/";
        fetch(`${apiBaseUrl}/site-visits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryPath }),
          keepalive: true,
        })
          .then((res) => {
            if (res.ok || res.status === 204) {
              try {
                window.localStorage.setItem(STORAGE_KEY, today);
              } catch {
                // Silent fallback
              }
            }
          })
          .catch(() => {
            // Never disrupt user navigation
          });
      };

      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(dispatch, { timeout: 2000 });
      } else {
        globalThis.setTimeout(dispatch, 0);
      }
    };

    const triggerOnce = () => {
      if (triggered) return;
      if (document.visibilityState !== "visible") return;
      triggered = true;
      cleanup();
      sendVisit();
    };

    const onHumanSignal = () => {
      triggerOnce();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && timerId === undefined && !triggered) {
        timerId = window.setTimeout(triggerOnce, 3000);
      }
    };

    window.addEventListener("scroll", onHumanSignal, { once: true, passive: true });
    window.addEventListener("pointerdown", onHumanSignal, { once: true, passive: true });
    window.addEventListener("keydown", onHumanSignal, { once: true, passive: true });
    window.addEventListener("touchstart", onHumanSignal, { once: true, passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (document.visibilityState === "visible") {
      timerId = window.setTimeout(triggerOnce, 3000);
    }

    return cleanup;
  }, []);

  return null;
}
