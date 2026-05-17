import { NextRequest, NextResponse } from "next/server";
import { addStoredOrder, getStoredOrders } from "@/lib/server-store";
import type { StoredOrder } from "@/lib/local-store";

export async function GET(request: NextRequest) {
  const orders = await getStoredOrders();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const phone = searchParams.get("phone")?.replace(/\s+/g, "");

  if (!email && !phone) {
    return NextResponse.json([]);
  }

  const visibleOrders = orders.filter((order) => {
    const orderEmail = order.customer.email?.trim().toLowerCase();
    const orderPhone = order.customer.phone?.replace(/\s+/g, "");
    return (email && orderEmail === email) || (phone && orderPhone === phone);
  });

  return NextResponse.json(visibleOrders);
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as StoredOrder;
  const order: StoredOrder = {
    ...payload,
    id: payload.id || `SPLAX-${Date.now().toString().slice(-8)}`,
    status: payload.status || "Pending",
    createdAt: payload.createdAt || new Date().toISOString()
  };

  await addStoredOrder(order);
  return NextResponse.json(order, { status: 201 });
}
