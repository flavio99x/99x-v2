// src/lib/loader.ts
let done = false;
const subs = new Set<() => void>();

export function isLoaderDone() {
  return done;
}

export function markLoaderDone() {
  if (done) return;
  done = true;
  subs.forEach((cb) => cb());
  subs.clear();
  if (typeof window !== "undefined") window.dispatchEvent(new Event("loader:done"));
}

export function onLoaderDone(cb: () => void): () => void {
  if (done) {
    cb();
    return () => {};
  }
  subs.add(cb);
  return () => subs.delete(cb);
}
