"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { apiBaseUrl } from "@/lib/api/utils/api";

const STORAGE_KEY = "paroquia_site_page_views_ts";
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes per page
const MIN_DWELL_MS = 5000; // 5 seconds minimum visible dwell time

function readCooldownMap(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeCooldownEntry(path: string, nowMs: number) {
  try {
    const map = readCooldownMap();
    const cleaned: Record<string, number> = {};
    for (const [k, ts] of Object.entries(map)) {
      if (typeof ts === "number" && nowMs - ts < COOLDOWN_MS) {
        cleaned[k] = ts;
      }
    }
    cleaned[path] = nowMs;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Ignore storage access errors (e.g. private browsing restrictions)
  }
}

export function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!apiBaseUrl) return;
    if (navigator.webdriver) return;

    const currentPath = pathname || "/";
    const nowMs = Date.now();
    const cooldownMap = readCooldownMap();
    const lastSentAt = cooldownMap[currentPath];

    // Already counted this page within the 30-minute window — 0 requests
    if (typeof lastSentAt === "number" && nowMs - lastSentAt < COOLDOWN_MS) {
      return;
    }

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const sendVisit = () => {
      if (cancelled || document.visibilityState !== "visible") return;

      const dispatch = () => {
        if (cancelled) return;
        fetch(`${apiBaseUrl}/site-visits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryPath: currentPath }),
          keepalive: true,
        })
          .then((res) => {
            if (res.ok || res.status === 204) {
              writeCooldownEntry(currentPath, Date.now());
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

    const scheduleTimer = () => {
      if (cancelled || timerId !== undefined) return;
      if (document.visibilityState === "visible") {
        timerId = globalThis.setTimeout(sendVisit, MIN_DWELL_MS);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        scheduleTimer();
      } else if (timerId !== undefined) {
        globalThis.clearTimeout(timerId);
        timerId = undefined;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    scheduleTimer();

    // If the user navigates to another page before 5s, cancel timer so corridor pages aren't counted
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timerId !== undefined) {
        globalThis.clearTimeout(timerId);
      }
    };
  }, [pathname]);

  return null;
}
