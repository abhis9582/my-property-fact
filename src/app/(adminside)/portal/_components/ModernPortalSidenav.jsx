"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Image from "next/image";
import { useState } from "react";
import sidenavConfig from "./sidenav-config.json";
import { useUser } from "../_contexts/UserContext";

export default function ModernPortalSidenav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const router = useRouter();
  const { userData, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNavigation = (href) => {
    router.push(href);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };


  const renderNavigation = () => {
    return sidenavConfig.navigation.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <CNavGroup
            key={item.id}
            toggler={
              <>
                {item.label}
                {item.badge && (
                  <CBadge color="primary ms-auto">{item.badge}</CBadge>
                )}
              </>
            }
          >
            {item.children.map((child) => (
              <CNavItem key={child.id}>
                <Link href={child.href} className="nav-link">
                  <span className="nav-icon">
                    <span className="nav-icon-bullet"></span>
                  </span>
                  {child.label}
                  {child.badge && (
                    <CBadge color="secondary ms-auto">{child.badge}</CBadge>
                  )}
                </Link>
              </CNavItem>
            ))}
          </CNavGroup>
        );
      } else {
        return (
          <CNavItem key={item.id}>
            <Link href={item.href} className="nav-link">
              {item.label}
              {item.badge && (
                <CBadge color="primary ms-auto">{item.badge}</CBadge>
              )}
            </Link>
          </CNavItem>
        );
      }
    });
  };

  return (
    <div className="sidebar-container">
      <CSidebar className="border-end sidebar-modern">
        <CSidebarHeader className="border-bottom sidebar-header-modern">
          <CSidebarBrand>
            <div className="brand-container">
              <Image
                src="/logo.png"
                alt="portal-logo"
                height={40}
                width={40}
                className="brand-logo"
              />
              <div className="brand-text">
                <h6 className="brand-title text-black text-decoration-none">Property Portal</h6>
                {/* <small className="brand-subtitle">Agent Dashboard</small> */}
              </div>
            </div>
          </CSidebarBrand>
        </CSidebarHeader>

        <CSidebarNav className="sidebar-nav-modern">
          <CNavTitle className="nav-title-modern">Navigation</CNavTitle>
          {renderNavigation()}
        </CSidebarNav>

        <CSidebarHeader className="border-top sidebar-footer-modern">
          <CDropdown>
            <CDropdownToggle
              placement="bottom-end"
              className="py-2 user-dropdown-toggle"
              caret={false}
            >
              <div className="user-profile">
                <Image
                  src="/logo.png"
                  alt="user-avatar"
                  height={32}
                  width={32}
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">{userData?.fullName || 'User'}</div>
                  <div className="user-role">{userData?.role || 'Agent'}</div>
                </div>
              </div>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0 user-dropdown-menu" placement="bottom-end">
              <CDropdownItem onClick={() => handleNavigation("/portal/dashboard/profile")}>
                Profile
              </CDropdownItem>
              <CDropdownItem onClick={() => handleNavigation("/portal/dashboard/settings")}>
                Settings
              </CDropdownItem>
              <CDropdownItem onClick={() => handleNavigation("/portal/dashboard/notifications")}>
                Notifications
              </CDropdownItem>
              <CDropdownItem divider="true" />
              <CDropdownItem onClick={handleLogout}>
                Logout
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CSidebarHeader>
      </CSidebar>

      <style jsx>{`
        .sidebar-container {
          height: 100vh;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .sidebar-modern {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1) !important;
          min-height: 100vh !important;
          width: 100% !important;
          border: none !important;
          position: relative !important;
        }

        .sidebar-header-modern {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
          padding: 1rem;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-logo {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .brand-text {
          color: white;
        }

        .brand-title {
          margin: 0;
          font-weight: 600;
          font-size: 1.1rem;
          color: white;
          text-decoration: none;
        }

        .brand-subtitle {
          opacity: 0.8;
          font-size: 0.75rem;
        }

        .sidebar-nav-modern {
          padding: 1rem 0;
        }

        .nav-title-modern {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 0 1rem 0.5rem;
          margin-bottom: 0.5rem;
        }

        .sidebar-nav-modern :global(.nav-link) {
          color: rgba(255, 255, 255, 0.9);
          padding: 0.75rem 1rem;
          margin: 0.125rem 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .sidebar-nav-modern :global(.nav-link:hover) {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateX(4px);
        }

        .sidebar-nav-modern :global(.nav-link.active) {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-nav-modern :global(.nav-group-items) {
          margin-left: 1rem;
        }

        .sidebar-nav-modern :global(.nav-group-items .nav-link) {
          font-size: 0.9rem;
          padding: 0.5rem 1rem 0.5rem 2rem;
          position: relative;
        }

        .sidebar-nav-modern :global(.nav-group-items .nav-icon) {
          position: absolute;
          left: 1rem;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
        }


        .sidebar-footer-modern {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 1rem;
        }

        .user-dropdown-toggle {
          background: none !important;
          border: none !important;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          width: 100%;
        }

        .user-dropdown-toggle:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
        }

        .user-avatar {
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .user-info {
          flex: 1;
          text-align: left;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          margin: 0;
        }

        .user-role {
          font-size: 0.75rem;
          opacity: 0.8;
          margin: 0;
        }

        .user-dropdown-menu {
          min-width: 200px;
          border: none;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
        }

        .user-dropdown-menu :global(.dropdown-item) {
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }

        .user-dropdown-menu :global(.dropdown-item:hover) {
          background: #f8f9fa;
          color: #495057;
        }

        .user-dropdown-menu :global(.dropdown-divider) {
          margin: 0.5rem 0;
        }

        @media (max-width: 992px) {
          .sidebar-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1050 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
            width: 280px !important;
            height: 100vh !important;
            overflow-y: auto !important;
          }

          .sidebar-container.mobile-open {
            transform: translateX(0) !important;
          }

          .brand-text {
            display: none;
          }

          .user-info {
            display: none;
          }

          .sidebar-modern {
            min-height: 100vh !important;
            width: 100% !important;
            position: relative !important;
          }
        }

        @media (max-width: 576px) {
          .sidebar-container {
            width: 100vw;
          }

          .sidebar-nav-modern :global(.nav-link) {
            padding: 1rem;
            font-size: 1rem;
          }

          .user-dropdown-toggle {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
