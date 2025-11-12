"use client";
import Link from "next/link";
import "./header.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Spinner } from "react-bootstrap";
import LoginSignupModal from "../_homecomponents/loginSignupModal";

const HeaderComponent = ({ cityList, projectTypes, builderList }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLoginModal, setShowModal] = useState(false);
  const pathname = usePathname();
  // Check if the pathname starts with /city/
  const isCityRoute = pathname.startsWith("/city");
  const isBuilderRoute = pathname.startsWith("/builder");
  const isProjectTypeRoute = pathname.startsWith("/projects");
  const isBlogTypeRoute = pathname.startsWith("/blog");
  //Defining scroll variable
  const [isScrolled, setIsScrolled] = useState(false);
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

      // Toggle className for body to remove overflow-hidden
      document.body.classList.remove("overflow-hidden");
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

      // Toggle className for body to add overflow-hidden
      document.body.classList.add("overflow-hidden");
    }
  };

  const openSignUpModal = () => {
    setShowModal(true);
  }

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
        <nav className="d-none d-lg-flex">
          <div className="menu position-relative">
            <ul className="d-flex gap-5 m-0 align-items-center header-links list-unstyled fw-bold">
              <li className="hasChild">
                <Link
                  href="/"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    pathname === "/" ? "header-link-active" : ""
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="#"
                  className={`text-light text-uppercase text-decoration-none py-3 ${
                    isCityRoute ? "header-link-active" : ""
                  }`}
                >
                  City<sup>+</sup>
                </Link>
                <div className="dropdown dropdown-lg z-3">
                  {!cityList ? (
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner animation="border" variant="light" />
                    </div>
                  ) : (
                    <ul className="list-inline">
                      {cityList?.map((city) => (
                        <li key={city.id}>
                          <Link
                            href={`/city/${city.slugURL}`}
                            className={`text-light py-3 text-decoration-none ${
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
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="#"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    isBuilderRoute ? "header-link-active" : ""
                  }`}
                >
                  Builder<sup>+</sup>
                </Link>
                <div className="dropdown dropdown-lg z-3">
                  {builderList.length === 0 ? (
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner animation="border" variant="light" />
                    </div>
                  ) : (
                    <ul className="list-inline">
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
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="/projects"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    isProjectTypeRoute ? "header-link-active" : ""
                  }`}
                >
                  Projects<sup>+</sup>
                </Link>
                <div className="dropdown projects-dropdown z-3">
                  {!projectTypes ? (
                    <div className="d-flex align-items-center justify-content-center p-3">
                      <Spinner animation="border" variant="light" />
                    </div>
                  ) : (
                    <ul className="list-inline">
                      {projectTypes?.map((project) => (
                        <li key={project.id}>
                          <Link
                            href={`/projects/${project.slugUrl}`}
                            className={`text-light text-decoration-none ${
                              pathname === "/projects/" + project.slugUrl
                                ? "header-link-active"
                                : ""
                            }`}
                          >
                            {project.projectTypeName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
              <li className="hasChild">
                <Link
                  href="/about-us"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    pathname === "/about-us" ? "header-link-active" : ""
                  }`}
                >
                  About Us
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/blog"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    isBlogTypeRoute ? "header-link-active" : ""
                  }`}
                >
                  Blog
                </Link>
              </li>
              {/* <li className="hasChild">
                <Link href="/clients-speak" className={`text-light text-uppercase ${pathname === "/clients-speak" ? "header-link-active" : ""}`}>Clients Speak</Link>
              </li> */}
              <li className="hasChild">
                <Link
                  href="/career"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    pathname === "/career" ? "header-link-active" : ""
                  }`}
                >
                  Career
                </Link>
              </li>
              <li className="hasChild">
                <Link
                  href="/contact-us"
                  className={`text-light py-3 text-uppercase text-decoration-none ${
                    pathname === "/contact-us" ? "header-link-active" : ""
                  }`}
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
        </nav>
        <div className="menuBtn d-flex d-lg-none " onClick={openMenu}>
          <span id="menuLine1"></span>
          <span id="menuLine2"></span>
          <span id="menuLine3"></span>
        </div>
      </div>
      <div className="mbMenuContainer" id="mbdiv">
        <div className="mbMenu">
          <div className="h-100 scroller">
            <div className="bigMenuList">
              <ul className="list-inline active list-unstyled">
                <li>
                  <Link className="text-decoration-none" href="/" onClick={openMenu}>
                    Home
                  </Link>
                </li>
                <li
                  className={`mb-hasChild ${
                    activeDropdown === "city" ? "active" : ""
                  }`}
                >
                  <Link href="#" className="text-decoration-none" onClick={() => openMenuMobile("city")}>
                    City<sup>+</sup>
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
                  <Link className="text-decoration-none" href="#" onClick={() => openMenuMobile("builder")}>
                    Builder<sup>+</sup>
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
                          className="text-decoration-none"
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
                <li
                  className={`mb-hasChild ${
                    activeDropdown === "projects" ? "active" : ""
                  }`}
                >
                  <Link href="#" className="text-decoration-none" onClick={() => openMenuMobile("projects")}>
                    Projects<sup>+</sup>
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
                  <Link className="text-decoration-none" href="/blog" onClick={openMenu}>
                    Blog
                  </Link>
                </li>
                {/* <li>
                  <Link href="/web-stories" onClick={openMenu}>Web Stories</Link>
                </li> */}
                <li>
                  <Link className="text-decoration-none" href="/about-us" onClick={openMenu}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none" href="/clients-speak" onClick={openMenu}>
                    Clients Speak
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none" href="/career" onClick={openMenu}>
                    Career
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none" href="/contact-us" onClick={openMenu}>
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
      <LoginSignupModal show={showLoginModal} handleClose={setShowModal}/>
    </>
  );
};
export default HeaderComponent;
