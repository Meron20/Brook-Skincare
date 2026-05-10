import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isBookingRoute = pathname.startsWith("/booking");
  const isClientJournalRoute = pathname.startsWith("/client-journal");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login";

  const redirectPath = searchParams.get("redirect") || "/client-journal";

  if ((isBookingRoute || isClientJournalRoute) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAuthRoute && isLoggedIn) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/booking/:path*", "/client-journal/:path*", "/admin/:path*", "/login"],
};