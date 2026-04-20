import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isBookingRoute = pathname.startsWith("/booking");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  if (isBookingRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthRoute && isLoggedIn) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/booking", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/booking/:path*", "/admin/:path*", "/login"],
};