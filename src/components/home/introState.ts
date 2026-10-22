import { useEffect, useSyncExternalStore } from "react";

/**
 * Has the loading screen finished?
 *
 * The loader lives in the layout and plays once per full page load. Heavy work
 * that would compete with it (the second hero video, the camera frame, the 3D
 * camera) waits for this flag. After client-side navigation the flag stays
 * true, so nothing waits again.
 */
let done = false;
const listeners = new Set<() => void>();

/** Called by the loader the moment it starts to dissolve. */
export function markIntroDone(): void {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => done;
/** The server (and the first hydration pass) always sees "not finished". */
const getServerSnapshot = () => false;

/** If the loader never reports in (it always should), carry on after this long. */
const FAILSAFE_MS = 9000;

export function useIntroDone(): boolean {
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (value) return;
    const timer = window.setTimeout(markIntroDone, FAILSAFE_MS);
    return () => window.clearTimeout(timer);
  }, [value]);

  return value;
}