import { NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/settings"];

async function checkToken(token) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log("Response JSON:", data);
    if (data.error) {
      return false;
    }
    return data.valid; // true if valid, false otherwise
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Special handling for login page (/admin)
  if (path === "/admin") {
    if (token) {
      const isValid = await checkToken(token);
      if (isValid) {
        // Already logged in → redirect to dashboard
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
    return NextResponse.next(); // No token or invalid → allow login page
  }

  // All other protected routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    const isValid = await checkToken(token);
    if (!isValid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*", // Protect only /admin routes
};
