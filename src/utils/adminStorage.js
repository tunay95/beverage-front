const ADMIN_PRODUCTS_KEY = "admin_products";
const ADMIN_CATEGORIES_KEY = "admin_categories";
const ADMIN_FILTERS_KEY = "admin_filters";
const ADMIN_SUBSCRIBERS_KEY = "admin_subscribers";

export function getAdminProducts() {
  try {
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setAdminProducts(list) {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(list || []));
}

export function getAdminCategories() {
  try {
    const raw = localStorage.getItem(ADMIN_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setAdminCategories(list) {
  localStorage.setItem(ADMIN_CATEGORIES_KEY, JSON.stringify(list || []));
}

export function getAdminFilters() {
  try {
    const raw = localStorage.getItem(ADMIN_FILTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setAdminFilters(list) {
  localStorage.setItem(ADMIN_FILTERS_KEY, JSON.stringify(list || []));
}

export function getAdminSubscribers() {
  try {
    const raw = localStorage.getItem(ADMIN_SUBSCRIBERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addAdminSubscriber(email) {
  if (!email) return;

  const list = getAdminSubscribers();

  if (!list.includes(email)) {
    list.push(email);
    localStorage.setItem(ADMIN_SUBSCRIBERS_KEY, JSON.stringify(list));
  }
}

export {
  getCurrentUserId,
  getUserCart,
  setUserCart,
  getUserFavorites,
  setUserFavorites,
} from "./userStorage";
