"use client";
import React, { useState } from "react";
import ModernPortalSidenav from "../_components/ModernPortalSidenav";
import ErrorBoundary from "../_components/ErrorBoundary";
import CSSLoader from "../_components/CSSLoader";
import { Button } from "react-bootstrap";
import { cilMenu } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function PortalDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Simulate loading completion
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Very short delay to ensure CSS is loaded
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CSSLoader />;
  }

  return (
    <ErrorBoundary>
      <div className="portal-layout">
        {/* Mobile Header */}
        <div className="mobile-header">
          <Button
            variant="outline-primary"
            className="mobile-menu-btn"
            onClick={toggleSidebar}
          >
            <CIcon icon={cilMenu} />
          </Button>
          <h4 className="mobile-title">Property Portal {sidebarOpen ? '(Open)' : '(Closed)'}</h4>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="mobile-overlay" onClick={closeSidebar}></div>
        )}

        {/* Sidebar */}
        <div className={`sidebar-wrapper ${sidebarOpen ? 'mobile-open' : ''}`}>
          <ModernPortalSidenav />
        </div>

        {/* Main Content */}
        <div className="main-content">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        .portal-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
          position: relative;
        }

        .mobile-header {
          display: none;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #e9ecef;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          z-index: 1051;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
        }

        /* Debug styles - remove after testing */
        .mobile-header::before {
          content: "Mobile Header Visible";
          position: absolute;
          top: -20px;
          left: 0;
          background: red;
          color: white;
          font-size: 10px;
          padding: 2px 4px;
        }

        .mobile-menu-btn {
          margin-right: 1rem;
          border-radius: 8px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-title {
          margin: 0;
          color: #212529;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .mobile-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1045;
        }

        .sidebar-wrapper {
          width: 280px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .main-content {
          flex: 1;
          overflow-x: auto;
          padding: 0;
          margin-top: 0;
        }

        @media (max-width: 992px) {
          .mobile-header {
            display: flex !important;
          }

          .mobile-overlay {
            display: block;
          }

          .sidebar-wrapper {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 1050 !important;
            transform: translateX(-100%) !important;
            height: 100vh !important;
            overflow-y: auto !important;
            width: 280px !important;
          }

          .sidebar-wrapper.mobile-open {
            transform: translateX(0) !important;
          }

          .main-content {
            width: 100% !important;
            margin-top: 60px !important;
          }
        }

        @media (max-width: 576px) {
          .mobile-header {
            padding: 0.75rem 1rem;
          }

          .mobile-title {
            font-size: 1.1rem;
          }

          .sidebar-wrapper {
            width: 100vw;
          }

          .main-content {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </ErrorBoundary>
  );
}
