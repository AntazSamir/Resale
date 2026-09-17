import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";

/**
 * NavigationProgressBar
 *
 * A sleek, high-precision top progress bar (Linear / Vercel style)
 * that provides immediate visual feedback during route transitions.
 */
export function NavigationProgressBar() {
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [progress, setProgress] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const prevPathRef = useRef<string>(pathname);
  const trickleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers helper
  const clearAllTimers = useCallback(() => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // Start progress sequence
  const startProgress = useCallback(() => {
    clearAllTimers();
    setIsVisible(true);
    setProgress(20);

    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        const diff = 90 - prev;
        return prev + Math.max(1, Math.round(diff * 0.15));
      });
    }, 150);
  }, [clearAllTimers]);

  // Complete progress sequence
  const completeProgress = useCallback(() => {
    clearAllTimers();
    setProgress(100);

    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      hideTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 180);
  }, [clearAllTimers]);

  // Listen to router isLoading state
  useEffect(() => {
    if (isLoading) {
      startProgress();
    } else {
      completeProgress();
    }
    return () => clearAllTimers();
  }, [isLoading, startProgress, completeProgress, clearAllTimers]);

  // Handle instant client-side route changes as well
  useEffect(() => {
    let t1: NodeJS.Timeout | null = null;
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsVisible(true);
      setProgress(40);

      t1 = setTimeout(() => {
        setProgress(100);
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
          const t2 = setTimeout(() => setProgress(0), 180);
          return () => clearTimeout(t2);
        }, 150);
      }, 80);
    }

    return () => {
      if (t1) clearTimeout(t1);
      clearAllTimers();
    };
  }, [pathname, clearAllTimers]);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-9999 pointer-events-none transition-opacity duration-200"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="h-[2.5px] bg-primary transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "140ms" : "280ms",
          boxShadow: "0 0 10px oklch(0.65 0.22 42 / 0.7), 0 0 4px oklch(0.65 0.22 42 / 0.5)",
        }}
      />
    </div>
  );
}
