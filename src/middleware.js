import { NextResponse } from "next/server";

const protectedRoutes = [
  "/admin",
  "/admin/dashboard",
  "/admin/settings",
  "/portal",
  "/portal/dashboard",
];

// checking session validity and extracting roles
async function checkSession(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    for(const cookie of cookieHeader.split(";")) {
      console.log("[", cookie.split("=")[0], "] = [", cookie.split("=")[1], "]");
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/session`, {
      headers: {
        "Cookie": cookieHeader || "",
        "Cookie": cookieHeader || "",
      },
    });
    if (!res.ok) return { valid: false };
    if (!res.ok) return { valid: false };

    const data = await res.json();
    console.log("data", data);
    return {
      valid: true,
      roles: data.roles || [],
      email: data.email,
    };
    console.log("data", data);
    return {
      valid: true,
      roles: data.roles || [],
      email: data.email,
    };
  } catch (err) {
    console.error("checkSession error:", err);
    console.error("checkSession error:", err);
    return { valid: false };
  }
}

// Helper function to check if user has required role
function hasRole(roles, requiredRole) {
  if (!roles || !Array.isArray(roles)) return false;

  const normalizedRequired = requiredRole.toUpperCase();

  return roles.some((role) => {
    if (!role) return false;
    const normalizedRole = role.toUpperCase();
    return (
      normalizedRole === normalizedRequired ||
      normalizedRole === `ROLE_${normalizedRequired}`
    );
  });
}
// Helper function to check if user has required role
function hasRole(roles, requiredRole) {
  if (!roles || !Array.isArray(roles)) return false;

  const normalizedRequired = requiredRole.toUpperCase();

  return roles.some((role) => {
    if (!role) return false;
    const normalizedRole = role.toUpperCase();
    return (
      normalizedRole === normalizedRequired ||
      normalizedRole === `ROLE_${normalizedRequired}`
    );
  });
}

export async function middleware(req) {
  const path = req.nextUrl.pathname;
export async function middleware(req) {
  const path = req.nextUrl.pathname;
  // Special case: login page
  if (path === "/admin") {
    // Check if accessDenied query parameter is already present
    // Check if accessDenied query parameter is already present
    const accessDenied = req.nextUrl.searchParams.get("accessDenied");

    const session = await checkSession(req);
    console.log("session", session);
    if (session.valid) {
      // Check if user has SUPERADMIN role
      if (hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      // Logged in but wrong role
      if (accessDenied === "true") {
        return NextResponse.next(); // allow page to show toast
      }
      return NextResponse.redirect(
        new URL("/admin?accessDenied=true", req.url),
      );

    const session = await checkSession(req);
    console.log("session", session);
    if (session.valid) {
      // Check if user has SUPERADMIN role
      if (hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      // Logged in but wrong role
      if (accessDenied === "true") {
        return NextResponse.next(); // allow page to show toast
      }
      return NextResponse.redirect(
        new URL("/admin?accessDenied=true", req.url),
      );
    }
    return NextResponse.next();
  }

  // Special case: portal root (signin page)
  if (path === "/portal" || path === "/portal/") {
    const session = await checkSession(req);
    const session = await checkSession(req);

    if (session.valid) {
      if (
        hasRole(session.roles, "USER") &&
        !hasRole(session.roles, "SUPERADMIN")
      ) {
        return NextResponse.redirect(new URL("/portal/dashboard", req.url));
      }

      // SUPERADMIN trying to access portal
      if (hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
    if (session.valid) {
      if (
        hasRole(session.roles, "USER") &&
        !hasRole(session.roles, "SUPERADMIN")
      ) {
        return NextResponse.redirect(new URL("/portal/dashboard", req.url));
      }

      // SUPERADMIN trying to access portal
      if (hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }
  // Protect admin and portal routes (except /portal which is the signin page)
  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    path !== "/portal" &&
    path !== "/portal/"
  ) {
    const session = await checkSession(req);

    if (!session.valid) {
  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    path !== "/portal" &&
    path !== "/portal/"
  ) {
    const session = await checkSession(req);

    if (!session.valid) {
      const redirectTo = path.startsWith("/portal") ? "/portal" : "/admin";


      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    const isAdminRoute = path.startsWith("/admin");
    const isPortalRoute = path.startsWith("/portal");

    // ---- ROLE BASED ACCESS ----

    // ---- ROLE BASED ACCESS ----
    if (isAdminRoute) {
      if (!hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(
          new URL("/admin?accessDenied=true", req.url),
        );
      if (!hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(
          new URL("/admin?accessDenied=true", req.url),
        );
      }
    }

    if (isPortalRoute) {
      if (hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      if (!hasRole(session.roles, "USER")) {
        return NextResponse.redirect(new URL("/portal", req.url));
    }

    if (isPortalRoute) {
      if (hasRole(session.roles, "SUPERADMIN")) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }

      if (!hasRole(session.roles, "USER")) {
        return NextResponse.redirect(new URL("/portal", req.url));
      }
    }
    // All good → allow request
    return NextResponse.next();
  }
    // All good → allow request
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
