import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isBookingRoute = pathname.startsWith("/booking");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  
  // Not logged in trying to access admin → send to login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

 
  if (isAdminRoute && isLoggedIn && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

 
  if (isBookingRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ── LOGIN PAGE ──
  // Already logged in trying to access login → redirect by role
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/booking/slot", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/booking/:path*", "/admin/:path*", "/login"],
};