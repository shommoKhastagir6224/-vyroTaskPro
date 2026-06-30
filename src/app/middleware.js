import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token");

  if (
    !token &&
    (
      request.nextUrl.pathname.startsWith("/habits") ||
      request.nextUrl.pathname.startsWith("/routine")
    )
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/habits/:path*", "/routine/:path*"],
};