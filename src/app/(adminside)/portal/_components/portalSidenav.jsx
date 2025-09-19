"use client";
import {
  CBadge,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavItem,
  CNavTitle,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import CIcon from "@coreui/icons-react";
import {
  cilAccountLogout,
  cilCloudDownload,
  cilLayers,
  cilPuzzle,
  cilSettings,
  cilSpeedometer,
  cilUser,
} from "@coreui/icons";
import Image from "next/image";

export default function PortalSideNav() {
  //Function to handle user logout
  const handleLogout = () => {
    // Clear your auth token / cookies here
    console.log("Logging out...");
  };

  return (
    <>
      <div className="container-fluid">
        <CSidebar className="border-end">
          <CSidebarHeader className="border-bottom">
            <CSidebarBrand>
              <Image
                src="/logo.png"
                alt="portal-logo"
                height={100}
                width={100}
                className="img-fluid rounded rounded-3"
              />
            </CSidebarBrand>
          </CSidebarHeader>
          <CSidebarNav>
            <CNavTitle>Dashboard</CNavTitle>
            <CNavItem href="/portal/dashboard">
              <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
              Dashboard
            </CNavItem>
            <CNavItem href="/portal/dashboard/listings">
              <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
              Listings
              <CBadge color="primary ms-auto">NEW</CBadge>
            </CNavItem>
            <CNavGroup
              toggler={
                <>
                  <CIcon customClassName="nav-icon" icon={cilPuzzle} />
                  Leads
                </>
              }
            >
              <CNavItem href="#">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>{" "}
                Nav dropdown item
              </CNavItem>
              <CNavItem href="#">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>{" "}
                Nav dropdown item
              </CNavItem>
            </CNavGroup>
            <CNavItem href="https://coreui.io">
              <CIcon customClassName="nav-icon" icon={cilCloudDownload} />{" "}
              Download CoreUI
            </CNavItem>
            <CNavItem href="https://coreui.io/pro/">
              <CIcon customClassName="nav-icon" icon={cilLayers} /> Try CoreUI
              PRO
            </CNavItem>
          </CSidebarNav>
          <CSidebarHeader className="border-top">
            {/* User Dropdown */}
            <CDropdown>
              <CDropdownToggle
                placement="bottom-end"
                className="py-0"
                caret={false}
              >
                <Image
                  src="/logo.png"
                  alt="user-icon"
                  height={50}
                  width={50}
                  className="img-fluid rounded-pill bg-danger"
                />
              </CDropdownToggle>
              <CDropdownMenu className="pt-0" placement="bottom-end">
                <CDropdownItem href="#">
                  <CIcon icon={cilUser} className="me-2" />
                  Profile
                </CDropdownItem>
                <CDropdownItem href="#">
                  <CIcon icon={cilSettings} className="me-2" />
                  Settings
                </CDropdownItem>
                <CDropdownItem href="#" onClick={handleLogout}>
                  <CIcon icon={cilAccountLogout} className="me-2" />
                  Logout
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CSidebarHeader>
        </CSidebar>
      </div>
    </>
  );
}
