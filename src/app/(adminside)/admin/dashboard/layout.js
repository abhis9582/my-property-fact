"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SideNav from "../_sidenav/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./admin-layout.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
