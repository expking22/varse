import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Admin authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SPLAX Admin", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

function unavailable() {
  return new NextResponse("Admin credentials are not configured on the server.", {
    status: 503,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export function proxy(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const adminUser = process.env.ADMIN_USERNAME || (isDevelopment ? "admin" : "");
  const adminPassword = process.env.ADMIN_PASSWORD || (isDevelopment ? "splax-admin-2026" : "");

  if (!adminUser || !adminPassword) {
    return unavailable();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(authHeader.replace("Basic ", ""));
  const separatorIndex = decoded.indexOf(":");
  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== adminUser || password !== adminPassword) {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
