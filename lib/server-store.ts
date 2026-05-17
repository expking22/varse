import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { products, type Product } from "@/lib/products";
import { defaultSiteSettings, type SiteSettings, type StoredOrder } from "@/lib/local-store";

const dataDir = path.join("/tmp", "splax-data");
const ordersFile = path.join(dataDir, "orders.json");
const productsFile = path.join(dataDir, "products.json");
const settingsFile = path.join(dataDir, "settings.json");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson<T>(filePath: string, value: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export async function getStoredOrders() {
  return readJson<StoredOrder[]>(ordersFile, []);
}

export async function saveStoredOrders(orders: StoredOrder[]) {
  await writeJson(ordersFile, orders);
}

export async function addStoredOrder(order: StoredOrder) {
  const orders = await getStoredOrders();
  const nextOrders = [order, ...orders];
  await saveStoredOrders(nextOrders);
  return order;
}

export async function updateStoredOrder(orderId: string, updates: Partial<StoredOrder>) {
  const orders = await getStoredOrders();
  const nextOrders = orders.map((order) =>
    order.id === orderId ? { ...order, ...updates } : order
  );
  await saveStoredOrders(nextOrders);
  return nextOrders.find((order) => order.id === orderId) ?? null;
}

export async function getStoredProducts() {
  return readJson<Product[]>(productsFile, []);
}

export async function saveStoredProducts(nextProducts: Product[]) {
  await writeJson(productsFile, nextProducts);
}

export async function getAllServerProducts() {
  return [...(await getStoredProducts()), ...products];
}

export async function getServerProduct(productId: string) {
  const allProducts = await getAllServerProducts();
  return allProducts.find((product) => product.id === productId) ?? null;
}

export async function getServerSettings() {
  const stored = await readJson<Partial<SiteSettings>>(settingsFile, {});
  return {
    ...defaultSiteSettings,
    ...stored,
    footerSocials: {
      ...defaultSiteSettings.footerSocials,
      ...stored.footerSocials
    },
    homeSections: {
      ...defaultSiteSettings.homeSections,
      ...stored.homeSections
    }
  } satisfies SiteSettings;
}

export async function saveServerSettings(settings: SiteSettings) {
  await writeJson(settingsFile, settings);
}
