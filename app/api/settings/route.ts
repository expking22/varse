import { NextResponse } from "next/server";
import { getServerSettings } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(await getServerSettings());
}
