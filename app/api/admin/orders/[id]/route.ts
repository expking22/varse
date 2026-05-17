import { NextResponse } from "next/server";
import { updateStoredOrder } from "@/lib/server-store";
import type { StoredOrder } from "@/lib/local-store";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;
  const updates = (await request.json()) as Partial<StoredOrder>;
  const order = await updateStoredOrder(id, updates);

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
