import { NextResponse } from "next/server";
import { getAllServerProducts } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getAllServerProducts());
}
