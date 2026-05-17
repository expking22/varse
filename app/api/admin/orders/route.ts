import { NextResponse } from "next/server";
import { getStoredOrders } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getStoredOrders());
}
