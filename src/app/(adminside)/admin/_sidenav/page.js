"use client";
import Link from "next/link";
import "./sidenav.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Image from "next/image";
export default function SideNav() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  const toggleSidebar = () => {
    setIsActive(!isActive);
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
          <Link href="/admin/dashboard">Dashboard</Link>
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
              <Link href="/admin/dashboard/manage-countries">
                Manage Countries
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-states">Manage States</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-cities">Manage Cities</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-localities">
                Manage Localities
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-score-evalution">
                Manage Score Evalution
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/project-types">
                Manage Project Types
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-project-status">
                Manage Project Status
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/builder">Manage Builders</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/budget-options">
                Manage budget options
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-career-applications">
                Manage career applications
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-location-benefits">
                Manage location benefits
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
              <Link href="/admin/dashboard/project-amenity">
                Manage Project&apos;s Amenities
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-banners">Manage Banners</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-floor-plans">
                Manage Floor Plans
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-gallery">Manage Gallery</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-faqs">Manage FAQs</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-project-about">
                Manage Project&apos;s About
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-project-walkthrough">
                Manage Project&apos;s Walkthrough
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/location-benifits">
                Location benifits
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/admin/dashboard/manage-projects">Manage Projects</Link>
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
              <Link href="/admin/dashboard/city-price-data">
                City Price Data
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-insight-headers">
                Manage Headers
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/insight-category">
                Manage Insight Category
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/top-developers">
                Manage Top developers
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link href="/admin/dashboard/aminities">Amenities</Link>
        </li>
        <li>
          <Link href="/admin/dashboard/enquiries">Manage Enquiries</Link>
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
              <Link href="/admin/dashboard/manage-blogs">Manage Blogs</Link>
            </li>
            <li>
              <Link href="/admin/dashboard/manage-categories">
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
              <Link href="/admin/dashboard/web-story-category">
                Web Story category
              </Link>
            </li>
            <li>
              <Link href="/admin/dashboard/web-story">Web Story</Link>
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
