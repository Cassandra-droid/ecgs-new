import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware running on path:", pathname)

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Route classification
  const isAuthPage = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"].includes(pathname)
  const protectedRoutes = ["/dashboard", "/admin", "/profile", "/ai-advisor", "/skill-assessment"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = pathname.startsWith("/admin")
  const isUserDashboard = pathname.startsWith("/dashboard")

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value
  console.log("Auth token in middleware:", token ? "Present" : "Not present")

  // If token exists, verify it
  if (token) {
    try {
      // Verify token directly with your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      // Check if token is valid
      if (response.ok) {
        const data = await response.json()
        const user = data.user
        const role = user?.role

        // Redirect authenticated users from auth pages to dashboard
        if (isAuthPage) {
          console.log("User already logged in, redirecting to dashboard")
          return NextResponse.redirect(new URL(role === "Admin" ? "/admin" : "/dashboard", request.url))
        }

        // Check role-based access
        if (isAdminRoute && role !== "Admin") {
          return NextResponse.redirect(new URL("/", request.url))
        }

        // Route is allowed for user
        return NextResponse.next()
      } else {
        // Token invalid, redirect to login and clear cookie
        console.log("Invalid token, redirecting to sign-in")
        const response = NextResponse.redirect(new URL("/sign-in", request.url))
        // Clear the invalid cookie
        response.cookies.delete("auth_token")
        return response
      }
    } catch (err) {
      console.error("Error verifying token:", err)
      // On error, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/sign-in", request.url))
      response.cookies.delete("auth_token")
      return response
    }
  }

  // No token and trying to access protected route
  if (isProtectedRoute) {
    console.log("Unauthenticated user trying to access protected route")
    const url = new URL("/sign-in", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Allow public routes
  return NextResponse.next()
}

// Middleware applies to all routes except static and internal ones
export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
}

