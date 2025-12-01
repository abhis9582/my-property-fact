"use client";
import Link from "next/link";
import "./sidenav.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";

export default function SideNav({ onLinkClick }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  const handleLogout = async () => {
    try {
      Cookies.set("token", "", { expires: new Date(0), path: "/" });
      Cookies.set("refreshToken", "", { expires: new Date(0), path: "/" });
      toast.success("Logout successfull...");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    // Sidebar
    <nav id="sidebar">
      <div className="sidebar-header">
        <Image src={"/logo.png"} alt="mpf-logo" width={100} height={100} />
      </div>
      <ul className="list-unstyled components">
        <li>
          <Link href="/admin/dashboard" onClick={handleLinkClick}>Dashboard</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/property-approvals" onClick={handleLinkClick}>Property Approvals</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/manage-users" onClick={handleLinkClick}>Manage Users</Link>
        </li>
        <li className={activeDropdown === "dropdown3" ? "active" : ""}>
          <Link
            href="#"
            onClick={() => toggleDropdown("dropdown3")}
            data-toggle="collapse"
            aria-expanded="false"
            className="dropdown-toggle"
          >
            Manage Options
          </Link>
          <ul
            className={`collapse list-unstyled ms-4 ${
              activeDropdown === "dropdown3" ? "show" : ""
            }`}
          >
            <li>
              <Link href="/admin/dashboard/manage-countries" onClick={handleLinkClick}>
                Manage Countries
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-states" onClick={handleLinkClick}>Manage States</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-cities" onClick={handleLinkClick}>Manage Cities</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-localities" onClick={handleLinkClick}>
                Manage Localities
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-score-evalution" onClick={handleLinkClick}>
                Manage Score Evalution
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/project-types" onClick={handleLinkClick}>
                Manage Project Types
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-project-status" onClick={handleLinkClick}>
                Manage Project Status
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/builder" onClick={handleLinkClick}>Manage Builders</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/budget-options" onClick={handleLinkClick}>
                Manage budget options
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-career-applications" onClick={handleLinkClick}>
                Manage career applications
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-location-benefits" onClick={handleLinkClick}>
                Manage location benefits
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/aminities" onClick={handleLinkClick}>
                Manage Amenities
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-features" onClick={handleLinkClick}>
                Manage Features
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-location-benefits" onClick={handleLinkClick}>
                Manage Nearby Benefits
              </Link>
            </li>
          </ul>
        </li>
        <li className={activeDropdown === "dropdown1" ? "active" : ""}>
          <Link
            href="#"
            data-toggle="collapse"
            aria-expanded="false"
            onClick={() => toggleDropdown("dropdown1")}
            className="dropdown-toggle"
          >
            Management
          </Link>
          <ul
            className={`collapse list-unstyled ms-4 ${
              activeDropdown === "dropdown1" ? "show" : ""
            }`}
          >
            <li>
              <Link href="/admin/dashboard/aminities" onClick={handleLinkClick}>
                Manage Amenities
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-features" onClick={handleLinkClick}>
                Manage Features
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-location-benefits" onClick={handleLinkClick}>
                Manage Nearby Benefits
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/project-amenity" onClick={handleLinkClick}>
                Manage Project&apos;s Amenities
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-banners" onClick={handleLinkClick}>Manage Banners</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-floor-plans" onClick={handleLinkClick}>
                Manage Floor Plans
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-gallery" onClick={handleLinkClick}>Manage Gallery</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-faqs" onClick={handleLinkClick}>Manage FAQs</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-project-about" onClick={handleLinkClick}>
                Manage Project&apos;s About
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-project-walkthrough" onClick={handleLinkClick}>
                Manage Project&apos;s Walkthrough
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/location-benifits" onClick={handleLinkClick}>
                Location benifits
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/admin/dashboard/manage-projects" onClick={handleLinkClick}>Manage Projects</Link>
        </li>
        <li className={activeDropdown === "dropdown2" ? "active" : ""}>
          <Link
            href="#"
            onClick={() => toggleDropdown("dropdown2")}
            data-toggle="collapse"
            aria-expanded="false"
            className="dropdown-toggle"
          >
            Insight Management
          </Link>
          <ul
            className={`collapse list-unstyled ms-4 ${
              activeDropdown === "dropdown2" ? "show" : ""
            }`}
          >
            <li>
              <Link href="/admin/dashboard/city-price-data" onClick={handleLinkClick}>
                City Price Data
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-insight-headers" onClick={handleLinkClick}>
                Manage Headers
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/insight-category" onClick={handleLinkClick}>
                Manage Insight Category
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/top-developers" onClick={handleLinkClick}>
                Manage Top developers
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/admin/dashboard/aminities" onClick={handleLinkClick}>Amenities</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/manage-features" onClick={handleLinkClick}>Manage Features</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/manage-location-benefits" onClick={handleLinkClick}>Manage Nearby Benefits</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/enquiries" onClick={handleLinkClick}>Manage Enquiries</Link>
        </li>
        <li className={activeDropdown === "dropdown4" ? "active" : ""}>
          <Link
            href="#"
            onClick={() => toggleDropdown("dropdown4")}
            data-toggle="collapse"
            aria-expanded="false"
            className="dropdown-toggle"
          >
            Blog management
          </Link>
          <ul
            className={`collapse list-unstyled ms-4 ${
              activeDropdown === "dropdown4" ? "show" : ""
            }`}
          >
            <li>
              <Link href="/admin/dashboard/manage-blogs" onClick={handleLinkClick}>Manage Blogs</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-categories" onClick={handleLinkClick}>
                Manage Blog Categories
              </Link>
            </li>
          </ul>
        </li>
        <li className={activeDropdown === "dropdown5" ? "active" : ""}>
          <Link
            href="#"
            onClick={() => toggleDropdown("dropdown5")}
            data-toggle="collapse"
            aria-expanded="false"
            className="dropdown-toggle"
          >
            Web story management
          </Link>
          <ul
            className={`collapse list-unstyled ms-4 ${
              activeDropdown === "dropdown5" ? "show" : ""
            }`}
          >
            <li>
              <Link href="/admin/dashboard/web-story-category" onClick={handleLinkClick}>
                Web Story category
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/web-story" onClick={handleLinkClick}>Web Story</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="#" onClick={() => handleLogout()}>
            Log out
          </Link>
        </li>
      </ul>
    </nav>
  );
}
