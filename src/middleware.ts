import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up");
    const isUpgradePage = req.nextUrl.pathname.startsWith("/upgrade");
    const isApiRoute = req.nextUrl.pathname.startsWith("/api/");

    // Allow all API routes to pass through without middleware checks
    if (isApiRoute) {
      return null;
    }

    // Allow access to the upgrade page without authentication
    if (isUpgradePage) {
      return null;
    }

    if (isAuthPage) {
      if (isAuth) {
        // If user is authenticated and tries to access auth pages, redirect to home
        return NextResponse.redirect(new URL("/", req.url));
      }
      // Allow unauthenticated users to access auth pages
      return null;
    }

    // For protected routes
    if (!isAuth) {
      // Store the original URL as the callback URL
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/sign-in?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Allow authenticated users to access protected routes
    return null;
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
