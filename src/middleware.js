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

    // Handle both successful and error responses
    let data;
    try {
      data = await res.json();
    } catch (e) {
      // If response is not JSON, token is invalid
      data = { valid: false };
    }

    // If token is valid, return success
    if (res.ok && data.valid) {
      return { 
        valid: true, 
        token, 
        refreshToken,
        roles: data.roles || [] // Extract roles from response
      };
    }

    // Access token invalid → try refreshing
    if (refreshToken) {
      try {
        const refreshRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        let refreshData;
        try {
          refreshData = await refreshRes.json();
        } catch (e) {
          // If refresh response is not JSON, refresh failed
          return { valid: false };
        }

        if (refreshRes.ok && refreshData.token) {
          // Verify the new token to get roles
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${refreshData.token}`,
              },
            });

            let verifyData;
            try {
              verifyData = await verifyRes.json();
            } catch (e) {
              // If verify response is not JSON, use empty roles
              verifyData = { roles: [] };
            }
            
            return {
              valid: true,
              token: refreshData.token,
              refreshToken: refreshData.refreshToken || refreshToken,
              roles: verifyData.roles || [],
            };
          } catch (verifyErr) {
            console.error("Error verifying refreshed token:", verifyErr);
            // Even if verification fails, return the new token
            return {
              valid: true,
              token: refreshData.token,
              refreshToken: refreshData.refreshToken || refreshToken,
              roles: [],
            };
          }
        }
      } catch (refreshErr) {
        console.error("Error refreshing token:", refreshErr);
        return { valid: false };
      }
    }

    // Both expired or refresh failed
    return { valid: false };
  } catch (err) {
    console.error("checkToken error:", err);
    return { valid: false };
  }
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value || req.cookies.get("authToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const path = req.nextUrl.pathname;

  // Helper function to check if user has required role
  // Handles both "SUPERADMIN" and "ROLE_SUPERADMIN" formats
  function hasRole(roles, requiredRole) {
    if (!roles || !Array.isArray(roles)) return false;
    const normalizedRequired = requiredRole.toUpperCase();
    return roles.some(role => {
      if (!role) return false;
      const normalizedRole = role.toUpperCase();
      // Check for exact match or ROLE_ prefix match
      return (
        normalizedRole === normalizedRequired ||
        normalizedRole === `ROLE_${normalizedRequired}`
      );
    });
  }

  // Special case: login page
  if (path === "/admin") {
    // Check if accessDenied query parameter is already present (to avoid redirect loop)
    const accessDenied = req.nextUrl.searchParams.get("accessDenied");
    
    if (token) {
      const result = await checkToken(token, refreshToken);

      if (result.valid) {
        // Check if user has SUPERADMIN role
        if (hasRole(result.roles, "SUPERADMIN")) {
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
          // User doesn't have SUPERADMIN role
          // If accessDenied param is already present, just allow the page to load (to show toast)
          if (accessDenied === "true") {
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
          // Otherwise, redirect with accessDenied parameter
          const res = NextResponse.redirect(new URL("/admin?accessDenied=true", req.url));
          return res;
        }
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

  // Special case: portal root (signin page)
  if (path === "/portal" || path === "/portal/") {
    if (token) {
      const result = await checkToken(token, refreshToken);

      if (result.valid) {
        // Check if user has USER role (or any role that's not SUPERADMIN)
        if (hasRole(result.roles, "USER") && !hasRole(result.roles, "SUPERADMIN")) {
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
        } else if (hasRole(result.roles, "SUPERADMIN")) {
          // SUPERADMIN trying to access portal, redirect to admin dashboard
          const res = NextResponse.redirect(new URL("/admin/dashboard", req.url));
          return res;
        }
      } else {
        // remove expired cookies and show signin page
        const res = NextResponse.next();
        res.cookies.delete("token");
        res.cookies.delete("refreshToken");
        return res;
      }
    }
    // Not logged in → show signin page
    return NextResponse.next();
  }

  // Protect admin and portal routes (except /portal which is the signin page)
  if (protectedRoutes.some((route) => path.startsWith(route)) && path !== "/portal" && path !== "/portal/") {
    if (!token) {
      // If accessing portal routes, send to portal signin; admin stays to /admin
      const redirectTo = path.startsWith("/portal") ? "/portal" : "/admin";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }

    const result = await checkToken(token, refreshToken);

    if (!result.valid) {
      // remove expired cookies & redirect to login
      const redirectTo = path.startsWith("/portal") ? "/portal" : "/admin";
      const res = NextResponse.redirect(new URL(redirectTo, req.url));
      res.cookies.delete("token");
      res.cookies.delete("refreshToken");
      return res;
    }

    // Role-based access control
    const isAdminRoute = path.startsWith("/admin");
    const isPortalRoute = path.startsWith("/portal");
    
    if (isAdminRoute) {
      // Admin routes require SUPERADMIN role
      if (!hasRole(result.roles, "SUPERADMIN")) {
        // User doesn't have SUPERADMIN role, redirect to admin login with access denied message
        const res = NextResponse.redirect(new URL("/admin?accessDenied=true", req.url));
        return res;
      }
    } else if (isPortalRoute) {
      // Portal routes require USER role and should NOT have SUPERADMIN role
      if (hasRole(result.roles, "SUPERADMIN")) {
        // SUPERADMIN trying to access portal, redirect to admin
        const res = NextResponse.redirect(new URL("/admin/dashboard", req.url));
        return res;
      } else if (!hasRole(result.roles, "USER")) {
        // User doesn't have USER role, redirect to portal signin
        const res = NextResponse.redirect(new URL("/portal", req.url));
        return res;
      }
    }

    // refresh cookies if needed
    const res = NextResponse.next();
    if (result.token !== token) {
      res.cookies.set("token", result.token, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      res.cookies.set("authToken", result.token, {
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
