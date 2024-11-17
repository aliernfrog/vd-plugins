import { storage } from "@vendetta/plugin";

const EXPIRE_AFTER_MS = 30*60*1000; // 30 minutes

export function set(stickerId, url) {
  storage.apngCache ??= [];
  remove(stickerId);
  const expiresAt = Date.now()+EXPIRE_AFTER_MS;
  storage.apngCache.push({ id: stickerId, url, expiresAt });
}

export function remove(stickerId) {
  storage.apngCache = storage.apngCache?.filter?.(c => c.id != stickerId);
}

export function get(stickerId) {
  const cached = storage.apngCache?.find?.(c => c.id == stickerId);
  if (cached.expiresAt < Date.now()) {
    remove(stickerId);
    return null;
  }
  return cached;
}