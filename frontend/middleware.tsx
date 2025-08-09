import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is authenticated by looking for the user data in localStorage
  // Note: In a real application, you'd use proper session management
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === "/login") {
    return NextResponse.next()
  }

  // Redirect to login if accessing protected routes without authentication
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/inventory") || pathname.startsWith("/issues")) {
    // In a real app, check for valid session/token here
    // For demo purposes, we'll let the client-side auth handle this
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
