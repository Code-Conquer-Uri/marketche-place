import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const routeConfig: Array<{
  route: Parameters<typeof redirect>[0];
  allow: "Authenticated-Only" | "Unauthenticated-Only" | "Both";
  redirectTo: Parameters<typeof redirect>[0];
}> = [
  {
    allow: "Authenticated-Only",
    route: "/dashboard",
    redirectTo: "/auth",
  },
  {
    allow: "Authenticated-Only",
    route: "/auth/sign-out",
    redirectTo: "/auth",
  },
  {
    allow: "Both",
    route: "/auth",
    redirectTo: "/dashboard",
  },
  {
    allow: "Both",
    route: "/",
    redirectTo: "/",
  },
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthenticated = request.cookies.has("better-auth.session_token");

  const route = routeConfig.find((route) => pathname.startsWith(route.route));

  if (route) {
    if (route.allow === "Both") {
      return NextResponse.next();
    }

    if (route.allow === "Authenticated-Only" && !isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = route.redirectTo;
      return NextResponse.redirect(url);
    }

    if (route.allow === "Unauthenticated-Only" && isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = route.redirectTo;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  runtime: "nodejs",
};
