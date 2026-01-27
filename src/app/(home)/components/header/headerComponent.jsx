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
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

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
  //Defining scroll variable
  const [isScrolled, setIsScrolled] = useState(false);
  
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

  //Hadling header fixed
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Prevent body scroll when dropdown is hovered
  // useEffect(() => {
  //   let scrollTimeout = null;
  //   let scrollPosition = 0;

  //   const preventBodyScroll = () => {
  //     scrollPosition = window.scrollY;
  //     document.body.style.overflow = 'hidden';
  //     document.body.style.position = 'fixed';
  //     document.body.style.top = `-${scrollPosition}px`;
  //     document.body.style.width = '100%';
  //   };

  //   const allowBodyScroll = () => {
  //     document.body.style.overflow = '';
  //     document.body.style.position = '';
  //     document.body.style.top = '';
  //     document.body.style.width = '';
  //     window.scrollTo(0, scrollPosition);
  //   };

  //   const handleDropdownEnter = () => {
  //     if (scrollTimeout) clearTimeout(scrollTimeout);
  //     preventBodyScroll();
  //   };

  //   const handleDropdownLeave = (e) => {
  //     const relatedTarget = e.relatedTarget;
  //     // Check if moving to another dropdown or header item
  //     if (!relatedTarget || 
  //         (!relatedTarget.closest('.dropdown.dropdown-lg') && 
  //          !relatedTarget.closest('.hasChild'))) {
  //       if (scrollTimeout) clearTimeout(scrollTimeout);
  //       scrollTimeout = setTimeout(() => {
  //         const stillHovering = document.querySelector('.hasChild:hover .dropdown.dropdown-lg') ||
  //                              document.querySelector('.dropdown.dropdown-lg:hover');
  //         if (!stillHovering) {
  //           allowBodyScroll();
  //         }
  //       }, 150);
  //     }
  //   };

  //   const handleHeaderItemLeave = (e) => {
  //     const relatedTarget = e.relatedTarget;
  //     if (!relatedTarget || !relatedTarget.closest('.dropdown.dropdown-lg')) {
  //       if (scrollTimeout) clearTimeout(scrollTimeout);
  //       scrollTimeout = setTimeout(() => {
  //         const stillHovering = document.querySelector('.hasChild:hover .dropdown.dropdown-lg') ||
  //                              document.querySelector('.dropdown.dropdown-lg:hover');
  //         if (!stillHovering) {
  //           allowBodyScroll();
  //         }
  //       }, 150);
  //     }
  //   };

  //   const dropdowns = document.querySelectorAll('.dropdown.dropdown-lg');
  //   const headerItems = document.querySelectorAll('.hasChild');

  //   dropdowns.forEach(dropdown => {
  //     dropdown.addEventListener('mouseenter', handleDropdownEnter);
  //     dropdown.addEventListener('mouseleave', handleDropdownLeave);
  //   });

  //   headerItems.forEach(item => {
  //     item.addEventListener('mouseleave', handleHeaderItemLeave);
  //   });

  //   return () => {
  //     dropdowns.forEach(dropdown => {
  //       dropdown.removeEventListener('mouseenter', handleDropdownEnter);
  //       dropdown.removeEventListener('mouseleave', handleDropdownLeave);
  //     });
  //     headerItems.forEach(item => {
  //       item.removeEventListener('mouseleave', handleHeaderItemLeave);
  //     });
  //     if (scrollTimeout) clearTimeout(scrollTimeout);
  //     allowBodyScroll();
  //   };
  // }, []);

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
      document.documentElement.style.overflow = "";
      
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
      document.documentElement.style.overflow = "hidden";
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
        }`}
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
              {/* <li className="hasChild">
                <Link
                  href="/"
                  className={`text-light py-3 text-decoration-none ${
                    pathname === "/" ? "header-link-active" : ""
                  }`}
                >
                  Home
                </Link>
              </li> */}
              <li className="hasChild">
                <Link
                  href="#"
                  className={`text-light text-decoration-none py-3 ${
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
                        <Link href="/projects/commercial" className="city-dropdown-item">
                          Commercial
                        </Link>
                        <Link href="/projects/residential" className="city-dropdown-item">
                          Residential
                        </Link>
                        <Link href="/projects/new-launches" className="city-dropdown-item with-badge">
                          New Launches <span className="city-dropdown-badge">New</span>
                        </Link>
                        <Link href="/blog" className="city-dropdown-item">
                          Articles &amp; News
                        </Link>
                      </div>
                      <ul className="list-inline city-dropdown-right">
                        {cityList?.map((city) => (
                          <li key={city.id}>
                            <Link
                              href={`/city/${city.slugURL}`}
                              className={`text-light text-decoration-none ${
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
                  className={`text-light py-3 text-decoration-none ${
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
                        <Link href="/commercial" className="city-dropdown-item">
                          Commercial
                        </Link>
                        <Link href="/residential" className="city-dropdown-item">
                          Residential
                        </Link>
                        <Link href="/new-launches" className="city-dropdown-item with-badge">
                          New Launches <span className="city-dropdown-badge">New</span>
                        </Link>
                        <Link href="/blog" className="city-dropdown-item">
                          Articles &amp; News
                        </Link>
                      </div>
                      <ul className="list-inline city-dropdown-right">
                        {builderList?.map((builder) => (
                          <li key={builder.id}>
                            <Link
                              href={`/builder/${builder.slugUrl}`}
                              className={`text-light text-decoration-none ${
                                pathname === "/builder/" + builder.slugUrl
                                  ? "header-link-active"
                                  : ""
                              }`}
                            >
                              {builder.builderName}
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
                  className={`text-light py-3  text-decoration-none ${
                    pathname === "/about-us" ? "header-link-active" : ""
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/projects"
                  className={`text-light py-3 text-decoration-none ${
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
                        <Link href="/projects/commercial" className="city-dropdown-item">
                          Commercial
                        </Link>
                        <Link href="/projects/residential" className="city-dropdown-item">
                          Residential
                        </Link>
                        <Link href="/projects/new-launches" className="city-dropdown-item with-badge">
                          New Launches <span className="city-dropdown-badge">New</span>
                        </Link>
                        <Link href="/blog" className="city-dropdown-item">
                          Articles &amp; News
                        </Link>
                      </div>
                      <div className="city-dropdown-right projects-search-section">
                        <div className="projects-search-wrapper">
                          <h3 className="projects-search-title">Search Your Dream Home</h3>
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
                          {/* <div className="projects-email-info">
                            Email Us At Services@Social@Mypropertyfact.Com. Or Call Us At 8920024793 (IND Toll-Free)
                          </div> */}
                        </div>
                      </div>
                      {/* <div className="projects-dropdown-footer">
                        <div className="projects-dropdown-footer-label">
                          Contact Us Toll Free On
                        </div>
                        <div className="projects-dropdown-footer-phone">
                          <Image
                            src="/static/icon/Vector.svg"
                            alt="Phone"
                            width={16}
                            height={16}
                            className="projects-phone-icon"
                          />
                          <span>8920024793 (IND Toll-Free)</span>
                        </div>
                      </div> */}
                    </div>
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="/blog"
                  className={`text-light py-3  text-decoration-none ${
                    isBlogTypeRoute ? "header-link-active" : ""
                  }`}
                >
                  Blog
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/career"
                  className={`text-light py-3 text-decoration-none ${
                    pathname === "/career" ? "header-link-active" : ""
                  }`}
                >
                  Career
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/contact-us"
                  className={`text-light py-3 text-decoration-none ${
                    pathname === "/contact-us" ? "header-link-active" : ""
                  }`}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="d-none d-lg-flex align-items-center">
          {/* <div className="post-property-btn" onClick={openSignUpModal}>
            <span className="post-property-text">Post Property</span>
            <span className="free-tag">Free</span>
          </div> */}
        </div>
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
                    className="text-decoration-none"
                    onClick={() => openMenuMobile("city")}
                  >
                    City
                  </Link>
                  <div
                    className={`dropdown ${
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
                    className="text-decoration-none"
                    href="#"
                    onClick={() => openMenuMobile("builder")}
                  >
                    Builder
                  </Link>
                  <div
                    className={`dropdown ${
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
                    className="text-decoration-none"
                    onClick={() => openMenuMobile("projects")}
                  >
                    Projects
                  </Link>
                  <div
                    className={`dropdown ${
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
                    href="https://www.facebook.com/starestate.in"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.instagram.com/starestate_official/"
                    target="_blank"
                  >
                    <i className="fab fa-instagram"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.linkedin.com/company/star-estate"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none"
                    href="https://www.youtube.com/channel/UCwfDf7Ut8jrkjiBeRnbZUPw"
                    target="_blank"
                  >
                    <i className="fab fa-youtube"></i>
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
