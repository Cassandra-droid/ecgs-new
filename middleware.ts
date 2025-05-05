// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

async function verifyToken(token: string) {
  try {
    console.log("Verifying session token:", token)
    
    // Call your backend API to verify the token
    const response = await fetch("http://localhost:8000/api/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
      cache: "no-store", // Important: Don't cache this request
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
  console.log("Middleware running on path:", request.nextUrl.pathname)
  
  // Debug all cookies
  const allCookies = request.cookies.getAll()
  console.log(
    "All cookies:",
    allCookies.map((c) => `${c.name}: ${c.value.substring(0, 10)}...`),
  )
  
  const token = request.cookies.get("auth_token")?.value
  console.log("Token present:", !!token)

  const { pathname } = request.nextUrl

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up"
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
  const isUserDashboard = pathname.startsWith("/dashboard")
  const isAdminRoute = pathname.startsWith("/admin")

  // Allow public assets and API requests
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  // If user has token
  if (token) {
    const user = await verifyToken(token)
    console.log("User from token:", user ? "found" : "not found")

    if (user) {
      const role = user.role
      console.log("User role:", role)

      // Prevent logged-in users from accessing sign-in/up pages
      if (isAuthPage) {
        console.log("Redirecting from auth page to dashboard")
        return NextResponse.redirect(new URL(role === "Admin" ? "/admin" : "/dashboard", request.url))
      }

      // Restrict admin pages to only Admins
      if (isAdminRoute && role !== "Admin") {
        console.log("Non-admin trying to access admin route")
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Prevent Admins from accessing user dashboard
      if (isUserDashboard && role === "Admin") {
        console.log("Admin trying to access user dashboard")
        return NextResponse.redirect(new URL("/admin", request.url))
      }

      console.log("Auth check passed, proceeding to route")
      return NextResponse.next()
    } else {
      // Invalid token: clear cookie and redirect to sign-in
      console.log("Invalid token, redirecting to sign-in")
      const response = NextResponse.redirect(new URL("/sign-in", request.url))
      response.cookies.delete("auth_token")
      return response
    }
  }

  // If user does not have a token and tries to access protected route
  if (isProtectedRoute) {
    console.log("Unauthenticated user trying to access protected route")
    const url = new URL("/sign-in", request.url)
    url.searchParams.set("callbackUrl", pathname) // redirect back after login
    return NextResponse.redirect(url)
  }

  // Allow access to public pages
  console.log("Allowing access to public page")
  return NextResponse.next()
}

// ✅ Always enable middleware in all environments (dev + prod)
export const config = {
  matcher: ["/((?!.*\\..*|_next|dashboard).*)"],
}