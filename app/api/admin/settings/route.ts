import { NextResponse } from "next/server";
import { getServerSettings, saveServerSettings } from "@/lib/server-store";
import type { SiteSettings } from "@/lib/local-store";

export async function GET() {
  return NextResponse.json(await getServerSettings());
}

export async function PUT(request: Request) {
  const settings = (await request.json()) as SiteSettings;
  await saveServerSettings(settings);
  return NextResponse.json(settings);
}
