import { NextResponse } from "next/server";
import { auth } from "@/auth";

function redirectToSignIn(req: { nextUrl: URL }, pathname: string) {
  const signInUrl = new URL("/signin", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(signInUrl);
}

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isAccountRoute = path.startsWith("/account");

  if (isAccountRoute) {
    if (!req.auth?.user) {
      return redirectToSignIn(req, path);
    }
    return NextResponse.next();
  }

  if (!isAdminRoute) return NextResponse.next();

  if (!req.auth?.user) {
    return redirectToSignIn(req, path);
  }

  if (req.auth.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
