import { products, type Product } from "@/lib/products";

export type CustomerProfile = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  signedInAt: string;
};

export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type StoredOrder = {
  id: string;
  customer: CustomerProfile;
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  deliveryNote?: string;
  status: OrderStatus;
  courier?: string;
  trackingNumber?: string;
  createdAt: string;
};

export type SiteSettings = {
  heroTagline: string;
  announcement: string;
  homeSections: {
    heroTitle: string;
    heroDescription: string;
    productsEyebrow: string;
    productsTitle: string;
    productsDescription: string;
  };
  footerSocials: {
    facebook: string;
    messenger: string;
    instagram: string;
    whatsapp: string;
    gmail: string;
  };
};

const userKey = "splax-user";
const ordersKey = "splax-orders";
const adminProductsKey = "splax-admin-products";
const settingsKey = "splax-site-settings";

export const defaultSiteSettings: SiteSettings = {
  heroTagline: "Verified sellers. Real savings. Fast checkout.",
  announcement: "Secure checkout with bKash, Nagad, Rocket, and cash on delivery.",
  homeSections: {
    heroTitle: "Shop Everything You Need in One Place",
    heroDescription:
      "SPLAX brings premium marketplace discovery, sharp prices, protected payments, and fast delivery into one clean shopping experience.",
    productsEyebrow: "Search results",
    productsTitle: "Top marketplace deals",
    productsDescription:
      "Filter trusted offers by category, price, seller quality, and rating. Every product includes clear delivery and return signals."
  },
  footerSocials: {
    facebook: "https://facebook.com/splax",
    messenger: "https://m.me/splax",
    instagram: "https://instagram.com/splax",
    whatsapp: "https://wa.me/8801000000000",
    gmail: "mailto:splax.bd@gmail.com"
  }
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (canUseStorage()) {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("splax-storage"));
  }
}

export function getCustomer() {
  return readJson<CustomerProfile | null>(userKey, null);
}

export function saveCustomer(customer: CustomerProfile) {
  writeJson(userKey, customer);
}

export function clearCustomer() {
  if (canUseStorage()) {
    window.localStorage.removeItem(userKey);
    window.dispatchEvent(new Event("splax-storage"));
  }
}

export function getOrders() {
  return readJson<StoredOrder[]>(ordersKey, []);
}

export function saveOrders(orders: StoredOrder[]) {
  writeJson(ordersKey, orders);
}

export function addOrder(order: StoredOrder) {
  const nextOrders = [order, ...getOrders()];
  saveOrders(nextOrders);
  return nextOrders;
}

export function updateOrder(orderId: string, updates: Partial<StoredOrder>) {
  const nextOrders = getOrders().map((order) =>
    order.id === orderId ? { ...order, ...updates } : order
  );
  saveOrders(nextOrders);
  return nextOrders;
}

export function getAdminProducts() {
  return readJson<Product[]>(adminProductsKey, []);
}

export function saveAdminProducts(nextProducts: Product[]) {
  writeJson(adminProductsKey, nextProducts);
}

export function getAllProducts() {
  return [...getAdminProducts(), ...products];
}

export function getSiteSettings() {
  const stored = readJson<Partial<SiteSettings>>(settingsKey, {});
  return {
    ...defaultSiteSettings,
    ...stored,
    homeSections: {
      ...defaultSiteSettings.homeSections,
      ...stored.homeSections
    },
    footerSocials: {
      ...defaultSiteSettings.footerSocials,
      ...stored.footerSocials
    }
  };
}

export function saveSiteSettings(settings: SiteSettings) {
  writeJson(settingsKey, settings);
}
