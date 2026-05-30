const inflight = new Map();

/** Runs the same async request once while a call with the same key is in flight. */
export function dedupeRequest(key, fn) {
  if (inflight.has(key)) {
    return inflight.get(key);
  }
  const promise = Promise.resolve().then(fn).finally(() => {
    inflight.delete(key);
  });
  inflight.set(key, promise);
  return promise;
}

export function clearDedupe(key) {
  inflight.delete(key);
}
