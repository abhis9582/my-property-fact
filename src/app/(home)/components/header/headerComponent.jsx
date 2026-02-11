"use client";
import Link from "next/link";
import "./header.css";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Spinner } from "react-bootstrap";
import LoginSignupModal from "../_homecomponents/loginSignupModal";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { faFacebook, faInstagram, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";

const HeaderComponent = ({ cityList, projectTypes, builderList, projectList }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLoginModal, setShowModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Check if the pathname starts with /city/
  const isCityRoute = pathname.startsWith("/city");
  const isBuilderRoute = pathname.startsWith("/builder");
  const isProjectTypeRoute = pathname.startsWith("/projects");
  const isBlogTypeRoute = pathname.startsWith("/blog");
  const isPropertiesRoute = pathname === "/properties";
  //Defining scroll variable
  const [isScrolled, setIsScrolled] = useState(false);
  const [isConditionalHeader, setIsConditionalHeader] = useState(false);
  // Project search state
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [projectSearchResults, setProjectSearchResults] = useState([]);
  const [isSearchingProjects, setIsSearchingProjects] = useState(false);
  const [imageErrors, setImageErrors] = useState({}); // Track image errors per project
  const projectSearchTimeoutRef = useRef(null);
  const projectsDropdownRef = useRef(null);
  const scrollPositionRef = useRef(0);

  // Get image URL for a project (matching the pattern used in PropertyContainer)
  const getProjectImageSrc = (project) => {
    const DEFAULT_IMAGE = "/static/no_image.png";
    const projectId = project.id || project.slugURL;
    
    // If image failed to load for this project, return default
    if (imageErrors[projectId] || !project.projectThumbnailImage) {
      return DEFAULT_IMAGE;
    }
    
    // Construct full image URL
    return `${process.env.NEXT_PUBLIC_IMAGE_URL || ''}properties/${project.slugURL}/${project.projectThumbnailImage}`;
  };

  // Handle image error
  const handleImageError = (projectId) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };
  const openMenuMobile = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  //Hadling header fixed - only when mobile menu is not open
  useEffect(() => {
    const handleScroll = () => {
      // Check if mobile menu is open
      const menu = document.getElementById("mbdiv");
      const isMenuOpen = menu && menu.classList.contains("active");
      
      // Prevent scrolling when menu is open
      if (isMenuOpen) {
        // Restore scroll position if it changed
        window.scrollTo(0, scrollPositionRef.current);
        return;
      }
      
      // Only update scroll state if menu is not open
      if (!isMenuOpen) {
        if (window.scrollY > 100) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };

    // Also prevent scroll events on touch devices - but allow scrolling in dropdowns
    const preventScroll = (e) => {
      const menu = document.getElementById("mbdiv");
      const isMenuOpen = menu && menu.classList.contains("active");
      if (isMenuOpen) {
        // Check if the touch is inside a scrollable dropdown menu
        const target = e.target;
        const dropdownUl = target.closest('.bigMenuList .dropdown.activeHeader ul');
        const dropdownContainer = target.closest('.bigMenuList .dropdown.activeHeader');
        
        // Allow scrolling inside dropdown menus - don't prevent default
        if (dropdownUl || dropdownContainer) {
          // Don't prevent default - allow natural scrolling
          return; // Exit early without preventing
        }
        
        // Check if touch is inside the main menu scroller or any menu content
        const isInsideMenu = target.closest('.mbMenuContainer .mbMenu');
        if (isInsideMenu) {
          // Allow scrolling in main menu container and all its children
          return; // Don't prevent - allow scrolling
        }
        
        // Only prevent scrolling on backdrop/container (outside menu)
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // Handle resize to close mobile menu on desktop
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        const menu = document.getElementById("mbdiv");
        const menuButtons = document.getElementsByClassName("menuBtn");
        if (menu && menu.classList.contains("active")) {
          // Close the menu
          for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].classList.remove("closeMenuBtn");
          }
          menu.style.display = "none";
          menu.classList.remove("active");

          // Remove notfixed class from header
          const header = document.querySelector(".header");
          if (header) {
            header.classList.remove("notfixed");
          }

          // Restore body scroll
          document.body.style.overflow = "";
          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.width = "";
          document.body.style.height = "";
          document.documentElement.style.overflow = "";
          document.documentElement.style.height = "";
          
          // Restore scroll position
          window.scrollTo(0, scrollPositionRef.current);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false });
    // Use capture phase to check before other handlers
    window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const openMenu = () => {
    const menuButtons = document.getElementsByClassName("menuBtn");
    const menu = document.getElementById("mbdiv");
    // Check if the menu is already open
    const isMenuOpen = menu.classList.contains("active");

    if (isMenuOpen) {
      // Close the menu
      for (let i = 0; i < menuButtons.length; i++) {
        menuButtons[i].classList.remove("closeMenuBtn");
      }
      menu.style.display = "none";
      menu.classList.remove("active");

      // Toggle className for .header
      const header = document.querySelector(".header");
      if (header) {
        header.classList.remove("notfixed");
      }

      // Restore body scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    } else {
      // Open the menu
      for (let i = 0; i < menuButtons.length; i++) {
        menuButtons[i].classList.add("closeMenuBtn");
      }
      menu.style.display = "block";
      menu.classList.add("active");

      // Toggle className for .header
      const header = document.querySelector(".header");
      if (header) {
        header.classList.add("notfixed");
      }

      // Prevent body scroll - save current scroll position
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
    }
  };

  const openSignUpModal = () => {
    setShowModal(true);
  };

  // Handle project search
  useEffect(() => {
    if (projectSearchQuery.trim().length >= 2 && projectList && projectList.length > 0) {
      setIsSearchingProjects(true);
      
      // Clear previous timeout
      if (projectSearchTimeoutRef.current) {
        clearTimeout(projectSearchTimeoutRef.current);
      }

      // Debounce search
      projectSearchTimeoutRef.current = setTimeout(async () => {
        try {
          // Filter projects by search query
          const query = projectSearchQuery.trim().toLowerCase();
          const filtered = projectList.filter((project) => {
            const projectName = (project.projectName || project.name || "").toLowerCase();
            const builderName = (project.builderName || "").toLowerCase();
            const cityName = (project.cityName || "").toLowerCase();
            const location = (project.location || project.projectAddress || "").toLowerCase();
            
            return (
              projectName.includes(query) ||
              builderName.includes(query) ||
              cityName.includes(query) ||
              location.includes(query)
            );
          }).slice(0, 50); // Limit to 50 results
          
          setProjectSearchResults(filtered);
        } catch (error) {
          console.error("Error searching projects:", error);
          setProjectSearchResults([]);
        } finally {
          setIsSearchingProjects(false);
        }
      }, 300);
    } else {
      setProjectSearchResults([]);
      setIsSearchingProjects(false);
    }

    return () => {
      if (projectSearchTimeoutRef.current) {
        clearTimeout(projectSearchTimeoutRef.current);
      }
    };
  }, [projectSearchQuery, projectList]);

  // Handle project click navigation
  const handleProjectClick = (project) => {
    if (project.slugURL) {
      router.push(`/${project.slugURL}`);
      setProjectSearchQuery("");
      setProjectSearchResults([]);
    }
  };

  // Handle Explore button click
  const handleExploreClick = () => {
    if (projectSearchResults.length > 0 && projectSearchResults[0]?.slugURL) {
      router.push(`/${projectSearchResults[0].slugURL}`);
      setProjectSearchQuery("");
      setProjectSearchResults([]);
    } else if (projectSearchQuery.trim().length >= 2) {
      // Navigate to projects page with search query
      router.push(`/projects?search=${encodeURIComponent(projectSearchQuery)}`);
      setProjectSearchQuery("");
      setProjectSearchResults([]);
    }
  };

  // Reset search when dropdown closes
  useEffect(() => {
    const handleMouseLeave = () => {
      // Reset search when mouse leaves the projects dropdown area
      setTimeout(() => {
        const projectsLi = document.querySelector('.hasChild:has(.projects-dropdown)');
        const isHovering = projectsLi?.matches(':hover') || 
                          projectsDropdownRef.current?.matches(':hover');
        if (!isHovering) {
          setProjectSearchQuery("");
          setProjectSearchResults([]);
        }
      }, 200);
    };

    const projectsLi = document.querySelector('.hasChild:has(.projects-dropdown)');
    if (projectsLi) {
      projectsLi.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        projectsLi.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <>
      <div
        className={`d-flex justify-content-between align-items-center px-2 px-lg-4 header ${
          isScrolled ? "fixed-header" : ""
        } ${isPropertiesRoute ? "properties-header" : ""} ${pathname.includes("/properties/") ? "conditional-header" : ""} `}
      >
        <div className="mpf-logo d-flex align-items-center gap-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="My Property fact"
              height={74}
              width={80}
              priority
            />
          </Link>
        </div>
        <nav className="d-none d-lg-flex flex-grow-1 justify-content-center">
          <div className="menu position-relative">
            <ul className="d-flex gap-5 m-0 align-items-center header-links list-unstyled fw-bold">
              <li className="hasChild">
                <Link
                  href="#"
                  className={`text-light text-decoration-none py-3 plus-jakarta-sans-semi-bold${
                    isCityRoute ? "header-link-active" : ""
                  }`}
                >
                  City
                </Link>
                <div className="dropdown dropdown-lg z-3 city-dropdown">
                  {!cityList ? (
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner animation="border" variant="light" />
                    </div>
                  ) : (
                    <div className="city-dropdown-content">
                      <div className="city-dropdown-left">
                        <Link href="/projects/commercial" className="city-dropdown-item plus-jakarta-sans-semi-bold" prefetch={true}>
                          Commercial
                        </Link>
                        <Link href="/projects/residential" className="city-dropdown-item plus-jakarta-sans-semi-bold" prefetch={true}>
                          Residential
                        </Link>
                        <Link href="/projects/new-launches" className="city-dropdown-item with-badge plus-jakarta-sans-semi-bold" prefetch={true}>
                          New Launches <span className="city-dropdown-badge">New</span>
                        </Link>
                        <Link href="/blog" className="city-dropdown-item plus-jakarta-sans-semi-bold">
                          Articles &amp; News
                        </Link>
                      </div>
                      <ul className="list-inline city-dropdown-right">
                        {cityList?.map((city) => (
                          <li key={city.id}>
                            <Link
                              href={`/city/${city.slugURL}`}
                              className={`text-light text-decoration-none plus-jakarta-sans-semi-bold ${
                                pathname === "/city/" + city.URL
                                  ? "header-link-active"
                                  : ""
                              }`}
                            >
                              {city.cityName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="#"
                  className={`text-light py-3 text-decoration-none plus-jakarta-sans-semi-bold ${
                    isBuilderRoute ? "header-link-active" : ""
                  }`}
                >
                  Builder
                </Link>
                <div className="dropdown dropdown-lg z-3 builder-dropdown">
                  {builderList.length === 0 ? (
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner animation="border" variant="light" />
                    </div>
                  ) : (
                    <div className="city-dropdown-content">
                      <div className="city-dropdown-left">
                        <Link href="/projects/commercial" className="city-dropdown-item plus-jakarta-sans-semi-bold" prefetch={true}>
                          Commercial
                        </Link>
                        <Link href="/projects/residential" className="city-dropdown-item plus-jakarta-sans-semi-bold" prefetch={true}>
                          Residential
                        </Link>
                        <Link href="/projects/new-launches" className="city-dropdown-item with-badge plus-jakarta-sans-semi-bold" prefetch={true}>
                          New Launches <span className="city-dropdown-badge">New</span>
                        </Link>
                        <Link href="/blog" className="city-dropdown-item plus-jakarta-sans-semi-bold">
                          Articles &amp; News
                        </Link>
                      </div>
                      <ul className="list-inline city-dropdown-right">
                        {builderList?.map((builder) => (
                          <li key={builder.id}>
                            <Link
                              href={`/builder/${builder.slugUrl}`}
                              className={`text-light text-decoration-none plus-jakarta-sans-semi-bold ${
                                pathname === "/builder/" + builder.slugUrl
                                  ? "header-link-active"
                                  : ""
                              }`}
                            >
                              {builder.builderName.toLowerCase()}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="/about-us"
                  className={`text-light py-3  text-decoration-none plus-jakarta-sans-semi-bold${
                    pathname === "/about-us" ? "header-link-active" : ""
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/projects"
                  className={`text-light py-3 text-decoration-none plus-jakarta-sans-semi-bold${
                    isProjectTypeRoute ? "header-link-active" : ""
                  }`}
                >
                  Projects
                </Link>
                <div 
                  className="dropdown dropdown-lg projects-dropdown z-3"
                  ref={projectsDropdownRef}
                >
                  {!projectTypes ? (
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner animation="border" variant="light" />
                    </div>
                  ) : (
                    <div className="city-dropdown-content">
                      <div className="city-dropdown-left">
                        <Link href="/projects/commercial" className="city-dropdown-item plus-jakarta-sans-semi-bold" prefetch={true}>
                          Commercial
                        </Link>
                        <Link href="/projects/residential" className="city-dropdown-item plus-jakarta-sans-semi-bold" prefetch={true}>
                          Residential
                        </Link>
                        <Link href="/projects/new-launches" className="city-dropdown-item with-badge plus-jakarta-sans-semi-bold" prefetch={true}>
                          New Launches <span className="city-dropdown-badge">New</span>
                        </Link>
                        <Link href="/blog" className="city-dropdown-item plus-jakarta-sans-semi-bold">
                          Articles &amp; News
                        </Link>
                      </div>
                      <div className="city-dropdown-right projects-search-section">
                        <div className="projects-search-wrapper">
                          <h3 className="projects-search-title plus-jakarta-sans-semi-bold">Search Your Dream Home</h3>
                          <div className="projects-search-container">
                            <div className="projects-search-input-wrapper">
                              <FontAwesomeIcon icon={faSearch} className="projects-search-icon" />
                              <input
                                type="text"
                                placeholder="Search"
                                className="projects-search-input"
                                value={projectSearchQuery}
                                onChange={(e) => setProjectSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleExploreClick();
                                  }
                                }}
                              />
                              <button 
                                className="projects-explore-btn"
                                onClick={handleExploreClick}
                              >
                                Explore
                              </button>
                            </div>
                          </div>
                          {/* Search Results */}
                          {projectSearchQuery.trim().length >= 2 && (
                            <div className="projects-search-results">
                              {isSearchingProjects ? (
                                <div className="projects-search-loader">
                                  <Spinner animation="border" size="sm" variant="light" />
                                  <span className="ms-2">Searching...</span>
                                </div>
                              ) : projectSearchResults.length > 0 ? (
                                <ul className="projects-results-list">
                                  {projectSearchResults.map((project) => {
                                    const projectId = project.id || project.slugURL;
                                    return (
                                      <li
                                        key={projectId}
                                        className="project-result-item"
                                        onClick={() => handleProjectClick(project)}
                                      >
                                        <div className="project-result-content">
                                          <div className="project-result-image">
                                            <Image
                                              src={getProjectImageSrc(project)}
                                              alt={project.projectName || project.name || "Project"}
                                              width={60}
                                              height={60}
                                              unoptimized
                                              onError={() => handleImageError(projectId)}
                                            />
                                          </div>
                                          <div className="project-result-name">
                                            <div>{project.projectName || project.name}</div>
                                            {(project.cityName || project.builderName) && (
                                              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
                                                {[project.cityName, project.builderName].filter(Boolean).join(' • ')}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              ) : projectSearchQuery.trim().length >= 2 ? (
                                <div className="projects-no-results">
                                  No projects found matching &quot;{projectSearchQuery}&quot;
                                </div>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="/blog"
                  className={`text-light py-3  text-decoration-none plus-jakarta-sans-semi-bold${
                    isBlogTypeRoute ? "header-link-active" : ""
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/career"
                  className={`text-light py-3 text-decoration-none plus-jakarta-sans-semi-bold${
                    pathname === "/career" ? "header-link-active" : ""
                  }`}
                >
                  Career
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/contact-us"
                  className={`text-light py-3 text-decoration-none plus-jakarta-sans-semi-bold${
                    pathname === "/contact-us" ? "header-link-active" : ""
                  }`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {/* <div className="d-none d-lg-flex align-items-center">
          <div className="post-property-btn-wrapper" style={{ cursor: 'default' }}>
            <div className="post-property-btn">
              <span className="post-property-text">Post Your Property</span>
              <div className="post-property-tag-wrapper">
                <span className="post-property-pin"></span>
                <Image 
                  src="/icon/image 81.svg" 
                  alt="Free tag" 
                  width={38} 
                  height={48} 
                  className="post-property-tag"
                />
              </div>
            </div>
          </div>
        </div> */}
        <div className="menuBtn d-flex d-lg-none " onClick={openMenu}>
          <span id="menuLine1"></span>
          <span id="menuLine2"></span>
          <span id="menuLine3"></span>
        </div>
      </div>
      <div 
        className="mbMenuContainer" 
        id="mbdiv"
        onClick={(e) => {
          // Close menu if clicking on the backdrop (container), not on the menu panel
          if (e.target.id === "mbdiv") {
            openMenu();
          }
        }}
      >
        <div className="mbMenu" onClick={(e) => e.stopPropagation()}>
          {/* Mobile Menu Header with Logo and Close Button */}
          <div className="mobile-menu-header">
            <Link href="/" onClick={openMenu} className="mobile-menu-logo">
              <Image
                src="/logo.png"
                alt="My Property Fact"
                height={50}
                width={55}
                priority
              />
            </Link>
            <button 
              className="mobile-menu-close-btn" 
              onClick={openMenu}
              aria-label="Close menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className="h-100 scroller">
            <div className="bigMenuList">
              <ul className="list-inline active list-unstyled">
                <li
                  className={`mb-hasChild ${
                    activeDropdown === "city" ? "active" : ""
                  }`}
                >
                  <Link
                    href="#"
                    className="text-decoration-none mobile-menu-item"
                    onClick={() => openMenuMobile("city")}
                  >
                    <span>City</span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`mobile-dropdown-icon ${activeDropdown === "city" ? "rotate" : ""}`}
                    />
                  </Link>
                  <div
                    className={`dropdown mobile-dropdown ${
                      activeDropdown === "city" ? "activeHeader" : ""
                    }`}
                  >
                    <ul className="list-inline list-unstyled">
                      {cityList?.map((city) => (
                        <li key={city.id}>
                          <Link
                            href={`/city/${city.slugURL}`}
                            onClick={openMenu}
                            className="text-decoration-none"
                          >
                            {city.cityName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li
                  className={`mb-hasChild ${
                    activeDropdown === "builder" ? "active" : ""
                  }`}
                >
                  <Link
                    className="text-decoration-none mobile-menu-item"
                    href="#"
                    onClick={() => openMenuMobile("builder")}
                  >
                    <span>Builder</span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`mobile-dropdown-icon ${activeDropdown === "builder" ? "rotate" : ""}`}
                    />
                  </Link>
                  <div
                    className={`dropdown mobile-dropdown ${
                      activeDropdown === "builder" ? "activeHeader" : ""
                    }`}
                  >
                    <ul className="list-inline list-unstyled">
                      {builderList?.map((builder) => (
                        <li key={builder.id}>
                          <Link
                            className="text-decoration-none builder-link"
                            href={`/builder/${builder.slugUrl}`}
                            onClick={openMenu}
                          >
                            {builder.builderName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="/about-us"
                    onClick={openMenu}
                  >
                    About Us
                  </Link>
                </li>
                <li
                  className={`mb-hasChild ${
                    activeDropdown === "projects" ? "active" : ""
                  }`}
                >
                  <Link
                    href="#"
                    className="text-decoration-none mobile-menu-item"
                    onClick={() => openMenuMobile("projects")}
                  >
                    <span>Projects</span>
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`mobile-dropdown-icon ${activeDropdown === "projects" ? "rotate" : ""}`}
                    />
                  </Link>
                  <div
                    className={`dropdown mobile-dropdown ${
                      activeDropdown === "projects" ? "activeHeader" : ""
                    }`}
                  >
                    <ul className="list-inline list-unstyled">
                      {projectTypes?.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/projects/${project.slugUrl}`}
                            onClick={openMenu}
                            className="text-decoration-none"
                          >
                            {project.projectTypeName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="smallMenuList">
              <ul className="list-inline list-unstyled">
                <li>
                  <Link
                    className="text-decoration-none"
                    href="/blog"
                    onClick={openMenu}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="/career"
                    onClick={openMenu}
                  >
                    Career
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="/contact-us"
                    onClick={openMenu}
                  >
                    Contact us
                  </Link>
                </li>
                {/* <li>
                  <div className="bg-white rounded rounded-3 p-2 cursor-pointer hover-effect"
                  onClick={openSignUpModal}>
                    <p className="text-dark m-0 p-0">Post Property</p>
                  </div>
                </li> */}
              </ul>
            </div>
            <div className="socialMediaLink">
              <ul className="list-inline list-unstyled">
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.facebook.com/mypropertyfact1/"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faFacebook} />
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.instagram.com/my.property.fact/"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.linkedin.com/company/my-property-fact/"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.youtube.com/@my.propertyfact/"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faYoutube} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LoginSignupModal show={showLoginModal} handleClose={setShowModal} />
    </>
  );
};
export default HeaderComponent;
