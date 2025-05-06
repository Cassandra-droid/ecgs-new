// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

async function verifyToken(token: string) {
  try {
    console.log("Verifying session token:", token)

    const response = await fetch("http://localhost:8000/api/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Session verification failed:", errorText)
      return null
    }

    const data = await response.json()
    console.log("Session verification successful:", data)
    return data.user
  } catch (err) {
    console.error("Error verifying session:", err)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware running on path:", pathname)

  const allCookies = request.cookies.getAll()
  console.log(
    "All cookies:",
    allCookies.map((c) => `${c.name}: ${c.value.substring(0, 10)}...`)
  )

  const token = request.cookies.get("auth_token")?.value
  console.log("Token present:", !!token)

  // Route classification
  const isAuthPage = ["/sign-in", "/sign-up"].includes(pathname)
  const protectedRoutes = ["/dashboard", "/admin", "/profile"]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAdminRoute = pathname.startsWith("/admin")
  const isUserDashboard = pathname.startsWith("/dashboard")

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // If token exists
  if (token) {
    const user = await verifyToken(token)
    console.log("User from token:", user ? "found" : "not found")

    if (user) {
      const role = user.role
      console.log("User role:", role)

      if (isAuthPage) {
        console.log("Redirecting from auth page to dashboard")
        return NextResponse.redirect(
          new URL(role === "Admin" ? "/admin" : "/dashboard", request.url)
        )
      }

      if (isAdminRoute && role !== "Admin") {
        console.log("Non-admin trying to access admin route")
        return NextResponse.redirect(new URL("/", request.url))
      }

      if (isUserDashboard && role === "Admin") {
        console.log("Admin trying to access user dashboard")
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      console.log("Auth check passed, proceeding to route")
      return NextResponse.next()
    } else {
      console.log("Invalid token, redirecting to sign-in")
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
  console.log("Allowing access to public page")
  return NextResponse.next()
}

// ✅ Middleware applies to all routes except static and internal ones
export const config = {
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
}
