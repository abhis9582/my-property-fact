import { NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/admin/dashboard", "/admin/settings", "/portal", "/portal/dashboard"];

async function checkToken(token, refreshToken) {
  try {
    // Verify access token
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.valid) {
      return { valid: true, token, refreshToken };
    }

    // Access token invalid → try refreshing
    if (refreshToken) {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        }
      );

      const refreshData = await refreshRes.json();

      if (refreshRes.ok && refreshData.token) {
        return {
          valid: true,
          token: refreshData.token,
          refreshToken: refreshData.refreshToken,
        };
      }
    }

    // Both expired
    return { valid: false };
  } catch (err) {
    console.error("checkToken error:", err);
    return { valid: false };
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const path = req.nextUrl.pathname;

  // Special case: login page
  if (path === "/admin") {
    if (token) {
      const result = await checkToken(token, refreshToken);

      if (result.valid) {
        const res = NextResponse.redirect(new URL("/admin/dashboard", req.url));

        // Refresh cookies if new tokens
        if (result.token !== token) {
          res.cookies.set("token", result.token, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
          res.cookies.set("refreshToken", result.refreshToken, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
        }
        return res;
      } else {
        // remove expired cookies
        const res = NextResponse.next();
        res.cookies.delete("token");
        res.cookies.delete("refreshToken");
        return res;
      }
    }
    return NextResponse.next();
  }

  // Special case: portal root (acts like a login/landing page for portal)
  if (path === "/portal") {
    if (token) {
      const result = await checkToken(token, refreshToken);

      if (result.valid) {
        const res = NextResponse.redirect(new URL("/portal/dashboard", req.url));

        // Refresh cookies if new tokens
        if (result.token !== token) {
          res.cookies.set("token", result.token, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
          res.cookies.set("refreshToken", result.refreshToken, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
        }
        return res;
      } else {
        // remove expired cookies
        const res = NextResponse.next();
        res.cookies.delete("token");
        res.cookies.delete("refreshToken");
        return res;
      }
    }
    // Not logged in → go home
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect admin routes
  if (protectedRoutes.some((route) => path.startsWith(route))) {
    if (!token) {
      // If accessing portal routes, send to home; admin stays to /admin
      const redirectTo = path.startsWith("/portal") ? "/" : "/admin";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    const result = await checkToken(token, refreshToken);

    if (!result.valid) {
      // remove expired cookies & redirect to login
      const res = NextResponse.redirect(new URL("/admin", req.url));
      res.cookies.delete("token");
      res.cookies.delete("refreshToken");
      return res;
    }

    // refresh cookies if needed
    const res = NextResponse.next();
    if (result.token !== token) {
      res.cookies.set("token", result.token, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      res.cookies.set("refreshToken", result.refreshToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
