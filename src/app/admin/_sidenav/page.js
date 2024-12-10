"use client";
import Link from "next/link";
import "./sidenav.css";
import { useState } from "react";
export default function SideNav(){
    const [activeDropdown, setActiveDropdown] = useState(null);
    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };
    const toggleSidebar = () => {
        setIsActive(!isActive);
    };
    return(
        // Sidebar
        <nav id="sidebar">
            <div className="sidebar-header">
                <img src="/logo.png" alt="logo" width={"100"}/>
            </div>
            <ul className="list-unstyled components">
                <li className={activeDropdown === 'dropdown1' ? "active" : ""}>
                    <Link href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" onClick={() => toggleDropdown('dropdown1')} className="dropdown-toggle">Management</Link>
                    <ul className={`collapse list-unstyled ${activeDropdown === 'dropdown1' ? 'show' : ''}`}>
                        <li>
                            <Link href="/admin/dashboard/city">Manage Cities</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/builder">Manage Builders</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/aminities">Manage Amenities</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/project-types">Manage Project Types</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/manage-banners">Manage Banners</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/manage-floor-plans">Manage Floor Plans</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/manage-gallery">Manage Gallery</Link>
                        </li>
                        <li>
                            <Link href="/admin/dashboard/manage-faqs">Manage FAQs</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link href="/admin/dashboard/projects">Projects</Link>
                </li>
                <li className={activeDropdown === 'dropdown2' ? "active" : ""}>
                    <Link href="#pageSubmenu" onClick={() => toggleDropdown('dropdown2')}  data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Pages</Link>
                    <ul className={`collapse list-unstyled ${activeDropdown === 'dropdown2' ? 'show' : ''}`}>
                        <li>
                            <Link href="#">Page 1</Link>
                        </li>
                        <li>
                            <Link href="#">Page 2</Link>
                        </li>
                        <li>
                            <Link href="#">Page 3</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link href="/admin/dashboard/aminities">Aminities</Link>
                </li>
                <li>
                    <Link href="/admin/dashboard/location-benifits">Location benifits</Link>
                </li>
            </ul>
        </nav>
    );
}