import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isBookingRoute = pathname.startsWith("/booking");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  // Not logged in trying to access booking → send to login
  if (isBookingRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Not admin trying to access admin → send to home
  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Already logged in trying to access login page → redirect by role
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    // Customer → send to home page for now until booking page is built
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/booking/:path*", "/admin/:path*", "/login"],
};