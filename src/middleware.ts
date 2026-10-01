import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const authRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ];

  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);
  const isLoggedIn = !!req.cookies.get("myziya_access_token")?.value;

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn && !isAuthRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_to", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth|.*\\..*).*)"],
};
