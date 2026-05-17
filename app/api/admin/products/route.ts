import { NextResponse } from "next/server";
import { getStoredProducts, saveStoredProducts } from "@/lib/server-store";
import type { Product } from "@/lib/products";

export async function GET() {
  return NextResponse.json(await getStoredProducts());
}

export async function PUT(request: Request) {
  const products = (await request.json()) as Product[];
  await saveStoredProducts(products);
  return NextResponse.json(products);
}
