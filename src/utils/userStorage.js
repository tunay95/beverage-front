export function getCurrentUserId() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;

    const user = JSON.parse(raw);
    return user.email || user.username || user.id || null;
  } catch {
    return null;
  }
}

function cartKey() {
  const id = getCurrentUserId();
  if (!id) return null;
  return `cart_${id}`;
}

export function getUserCart() {
  const key = cartKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setUserCart(cart) {
  const key = cartKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(cart || []));
  window.dispatchEvent(new Event("cartUpdated"));
}

function favKey() {
  const id = getCurrentUserId();
  if (!id) return null;
  return `favorites_${id}`;
}

export function getUserFavorites() {
  const key = favKey();
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setUserFavorites(favs) {
  const key = favKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(favs || []));
}
