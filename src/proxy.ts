import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isBookingRoute = pathname.startsWith("/booking");
  const isClientJournalRoute = pathname.startsWith("/client-journal");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  // Not logged in trying to access admin → send to login
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in but not admin trying to access admin → send to home
  if (isAdminRoute && isLoggedIn && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Not logged in trying to access booking → send to login
  if (isBookingRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Not logged in trying to access client journal → send to login
  if (isClientJournalRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

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
  matcher: ["/booking/:path*", "/client-journal/:path*", "/admin/:path*", "/login"],
};