"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideNav from "../_sidenav/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import axios from "axios";
import "./admin-layout.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  // Check if user has SUPERADMIN role
  useEffect(() => {
    const checkAuthorization = async () => {
      const token = Cookies.get("token") || Cookies.get("authToken");
      
      if (!token) {
        router.push("/admin?accessDenied=true");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}auth/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.valid) {
          const roles = response.data.roles || [];
          
          // Check if user has SUPERADMIN role (handles both formats)
          const hasSuperAdmin = roles.some((role) => {
            if (!role) return false;
            const normalizedRole = role.toUpperCase();
            const isSuperAdmin = (
              normalizedRole === "SUPERADMIN" ||
              normalizedRole === "ROLE_SUPERADMIN"
            );
            return isSuperAdmin;
          });
          if (hasSuperAdmin) {
            setIsAuthorized(true);
          } else {
            // User doesn't have SUPERADMIN role, redirect to admin login
            console.warn("Access denied - User roles:", roles);
            router.push("/admin?accessDenied=true");
          }
        } else {
          router.push("/admin?accessDenied=true");
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        console.error("Error details:", error.response?.data || error.message);
        
        // If token is invalid, try to refresh it
        if (error.response?.status === 401) {
          const refreshToken = Cookies.get("refreshToken");
          if (refreshToken) {
            try {
              const refreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}auth/refresh`,
                { refreshToken },
                { withCredentials: true }
              );
              
              if (refreshResponse.data?.token) {
                Cookies.set("token", refreshResponse.data.token, {
                  expires: 1,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "Strict",
                  path: "/",
                });
                
                // Retry authorization check with new token
                const retryResponse = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}auth/verify`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${refreshResponse.data.token}`,
                    },
                  }
                );
                
                if (retryResponse.data.valid) {
                  const roles = retryResponse.data.roles || [];
                  const hasSuperAdmin = roles.some((role) => {
                    if (!role) return false;
                    const normalizedRole = role.toUpperCase();
                    return (
                      normalizedRole === "SUPERADMIN" ||
                      normalizedRole === "ROLE_SUPERADMIN"
                    );
                  });
                  
                  if (hasSuperAdmin) {
                    setIsAuthorized(true);
                    setIsChecking(false);
                    return;
                  }
                }
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
            }
          }
        }
        
        router.push("/admin?accessDenied=true");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthorization();
  }, [router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading state while checking authorization
  if (isChecking) {
    return (
      <div className="admin-layout-wrapper" style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)"
      }}>
        <div className="spinner-border" role="status" style={{ width: "3rem", height: "3rem", borderWidth: "0.3rem", color: "#68ac78" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (redirect will happen)
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="admin-layout-wrapper">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
        </button>
        <h5 className="mobile-header-title">Admin Dashboard</h5>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="admin-mobile-overlay"
          onClick={closeSidebar}
        />
      )}

      <div className="admin-layout-container">
        {/* Sidebar */}
        <div className={`admin-sidebar-wrapper ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <SideNav onLinkClick={closeSidebar} />
        </div>

        {/* Main Content */}
        <div className="admin-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}
