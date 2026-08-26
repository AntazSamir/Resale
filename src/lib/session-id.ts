/**
 * Session ID management for behavioral event tracking.
 *
 * Uses sessionStorage for anonymous session IDs (as approved).
 * Session IDs are stable within a browser session but cleared on close.
 * No PII, no fingerprinting, no third-party trackers.
 *
 * Authenticated users retain their session ID across login/logout;
 * the ID is simply bound to the authenticated user_id.
 */

const STORAGE_KEY = "resale.sessionId";

/**
 * Generate a stable session ID for the current browser session.
 * Persists to sessionStorage; cleared automatically when the tab/window closes.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "anon";

  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  if (sessionId) return sessionId;

  // Generate a new UUID v4 for this session
  sessionId = crypto.randomUUID();
  try {
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  } catch {
    // sessionStorage not available; fall back to in-memory only
  }
  return sessionId;
}

/**
 * Clear the session ID (e.g., on sign out or explicit reset).
 */
export function clearSessionId(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Get the current session ID without generating a new one if absent.
 * Returns 'anon' if sessionStorage is unavailable.
 */
export function getSessionIdSafe(): string {
  if (typeof window === "undefined") return "anon";
  const id = sessionStorage.getItem(STORAGE_KEY);
  return id || "anon";
}
