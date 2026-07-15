import { NextResponse } from "next/server";
import { verifyAuthToken } from "./lib/auth";

function getAuthPayload(request) {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export function proxy(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/dashboard")) {
    const payload = getAuthPayload(request);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/user")) {
    const payload = getAuthPayload(request);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/user/:path*"],
};
