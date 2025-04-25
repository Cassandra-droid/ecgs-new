import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "oGqOHOxYPRP28PEsygbtQ3OLYljcrHh3MxwqpFiStt8k");

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isUserDashboard = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (token) {
    const payload = await verifyToken(token);

    if (payload) {
      const role = payload.role;

      if (isAuthPage) {
        return NextResponse.redirect(new URL(role === "Admin" ? "/admin" : "/dashboard", request.url));
      }

      if (isAdminRoute && role !== "Admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isUserDashboard && role === "Admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.next();
    } else {
      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
  } else {
    if (isProtectedRoute) {
      const url = new URL("/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

