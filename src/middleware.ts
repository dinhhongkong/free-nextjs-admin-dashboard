import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  // Define which routes are protected
  const protectedRoutes = ['/info'];

  // Check if the route is protected
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      // Redirect to sign-in if no token is found
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Decode and validate token expiration
    try {
      const decodedToken: any = jwtDecode(token);
      const isExpired = decodedToken.exp < Date.now() / 1000;

      if (isExpired) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
    } catch (error: any) {
      // If decoding fails, redirect to sign-in
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next(); // Proceed if authenticated
}

export const config = {
  matcher: ['/info', '/other-protected-route'], // List protected routes here
};
