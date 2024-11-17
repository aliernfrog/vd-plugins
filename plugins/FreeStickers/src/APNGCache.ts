const EXPIRE_AFTER_MS = 30*60*1000; // 30 minutes

const cache = new Map();

export function set(key, url) {
  cache.set(key, url);
  setTimeout(() => cache.delete(key), EXPIRE_AFTER_MS);
}

export function get(key) {
  return cache.get(key);
}