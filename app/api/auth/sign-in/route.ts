import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Get the backend URL from environment variable or use a default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL

    console.log(`Attempting to sign in with email: ${email}`)
    console.log(`Using backend URL: ${backendUrl}/api/auth/login/`)

    const response = await fetch(`${backendUrl}/api/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const contentType = response.headers.get("content-type")

      // If response is HTML (not JSON), handle it differently
      if (contentType && contentType.includes("text/html")) {
        console.error("Received HTML response instead of JSON")
        const text = await response.text()
        console.error("Response text (first 100 chars):", text.substring(0, 100))
        return NextResponse.json({ error: "Authentication server returned an HTML error" }, { status: 500 })
      }

      // Try to get error message from JSON response
      try {
        const errorData = await response.json()
        return NextResponse.json({ error: errorData.message || "Authentication failed" }, { status: response.status })
      } catch (e) {
        // If JSON parsing fails, return the status text
        return NextResponse.json(
          { error: `Authentication failed: ${response.statusText}` },
          { status: response.status },
        )
      }
    }

    // Parse successful response
    try {
      const data = await response.json()

      // Forward any cookies from the backend response
      const headers = new Headers()
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          headers.append(key, value)
        }
      })

      return NextResponse.json(
        { success: true, user: data.user || {} },
        {
          status: 200,
          headers,
        },
      )
    } catch (error) {
      console.error("Error parsing JSON response:", error)
      return NextResponse.json({ error: "Invalid response from authentication server" }, { status: 500 })
    }
  } catch (error) {
    console.error("Sign-in error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
