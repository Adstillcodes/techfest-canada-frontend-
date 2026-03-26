const KEY = "pendingPurchase";

export function setPendingPurchase(tier) {
  localStorage.setItem(KEY, tier);
}

export function getPendingPurchase() {
  return localStorage.getItem(KEY);
}

export function clearPendingPurchase() {
  localStorage.removeItem(KEY);
}