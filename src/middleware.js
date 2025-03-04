import axios from "axios";
import { NextResponse } from "next/server";

const checkLogin = async () => {
  try {
    const response = null;
    return response.data.token !== null;
  } catch (error) {
    console.error("Error checking login:", error);
    return false;
  }
};
const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/settings"];

export function middleware(req) {
  const token = req.cookies.get("token")?.value; // Get JWT from cookies  
  // If the user is not logged in and trying to access protected routes, redirect to login
  if (
    !token &&
    protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  ) {
    if (req.nextUrl.pathname != "/admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next(); // Allow the request to continue
}

export const config = {
  matcher: "/admin/:path*", // Protect only /admin routes
};
