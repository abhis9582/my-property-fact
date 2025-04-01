"use client";
import Link from "next/link";
import "./header.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
const Header = () => {
  const [cityList, setCityList] = useState([]);
  const [builderList, setBuilderList] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  //Defining scroll variable
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchData = async () => {
    const cityResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    if (cityResponse) {
      setCityList(cityResponse.data);
    }
  };
  const fetchBuilders = async () => {
    const builderResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}builders/get-all`
    );
    if (builderResponse) {
      setBuilderList(builderResponse.data.builders);
    }
  };
  const fetchProjectTypes = async () => {
    const projectTypesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    if (projectTypesResponse) {
      setProjectTypes(projectTypesResponse.data);
    }
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
  useEffect(() => {
    fetchData();
    fetchBuilders();
    fetchProjectTypes();
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

  return (
    <>
      <div className={`d-flex justify-content-between align-items-center px-2 px-lg-4 mpf-bg header ${isScrolled ? "fixed-header" : ""}`}>
        <div className="mpf-logo">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="My Property facts"
              height={70}
              width={80}
            />
          </Link>
        </div>
        <nav className="d-none d-lg-flex">
          <div className="menu position-relative">
            <ul className="d-flex gap-5 m-0 fw-bold align-items-center">
              <li className="hasChild">
                <Link href="#" className="text-light text-uppercase">
                  City<sup>+</sup>
                </Link>
                <div className="dropdown dropdown-lg z-3">
                  <ul className="list-inline">
                    {cityList.map((city) => (
                      <li key={city.id}>
                        <Link href={`/city/${city.slugUrl}`} className="text-light">
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="hasChild">
                <Link href="#" className="text-light text-uppercase">
                  Builder<sup>+</sup>
                </Link>
                <div className="dropdown dropdown-lg z-3">
                  <ul className="list-inline">
                    {builderList.map((builder) => (
                      <li key={builder.id}>
                        <Link href={`/builder/${builder.slugUrl}`} className="text-light">
                          {builder.builderName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="hasChild">
                <Link href="/projects" className="text-light text-uppercase">
                  Projects<sup>+</sup>
                </Link>
                <div className="dropdown projects-dropdown z-3">
                  <ul className="list-inline">
                    {projectTypes.map((project) => (
                      <li key={project.id}>
                        <Link href={`/projects/${project.slugUrl}`} className="text-light">
                          {project.projectTypeName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="hasChild">
                <Link href="/about-us" className="text-light text-uppercase">About Us</Link>
              </li>
              <li className="hasChild">
                <Link href="/blogs" className="text-light text-uppercase">
                  Blogs
                </Link>
              </li>
              <li className="hasChild">
                <Link href="/clients-speak" className="text-light text-uppercase">Clients Speak</Link>
              </li>
              <li className="hasChild">
                <Link href="/careers" className="text-light text-uppercase">Careers</Link>
              </li>
              <li className="hasChild">
                <Link href="/contact-us" className="text-light text-uppercase">Contact us</Link>
              </li>
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
              <ul className="list-inline active">
                <li>
                  <Link href="/" onClick={openMenu}>Home</Link>
                </li>
                <li
                  className={`mb-hasChild ${activeDropdown === "city" ? "active" : ""
                    }`}
                >
                  <Link href="#" onClick={() => openMenuMobile("city")}>
                    City<sup>+</sup>
                  </Link>
                  <div
                    className={`dropdown ${activeDropdown === "city" ? "activeHeader" : ""
                      }`}
                  >
                    <ul className="list-inline">
                      {cityList.map((city) => (
                        <li key={city.id}>
                          <Link href={`/city/${city.slugUrl}`} onClick={openMenu}>
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li
                  className={`mb-hasChild ${activeDropdown === "builder" ? "active" : ""
                    }`}
                >
                  <Link href="#" onClick={() => openMenuMobile("builder")}>
                    Builder<sup>+</sup>
                  </Link>
                  <div
                    className={`dropdown ${activeDropdown === "builder" ? "activeHeader" : ""
                      }`}
                  >
                    <ul className="list-inline">
                      {builderList.map((builder) => (
                        <li key={builder.id}>
                          <Link href={`/builder/${builder.slugUrl}`} onClick={openMenu}>
                            {builder.builderName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li
                  className={`mb-hasChild ${activeDropdown === "projects" ? "active" : ""
                    }`}
                >
                  <Link href="#" onClick={() => openMenuMobile("projects")}>
                    Projects<sup>+</sup>
                  </Link>
                  <div
                    className={`dropdown ${activeDropdown === "projects" ? "activeHeader" : ""
                      }`}
                  >
                    <ul className="list-inline">
                      {projectTypes.map((project) => (
                        <li key={project.id}>
                          <Link href={`/projects/${project.slugUrl}`} onClick={openMenu}>
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
              <ul className="list-inline">
                <li>
                  <Link href="/blogs" onClick={openMenu}>Blogs</Link>
                </li>
                <li>
                  <Link href="/about-us" onClick={openMenu}>About Us</Link>
                </li>
                <li>
                  <Link href="/clients-speak" onClick={openMenu}>Clients Speak</Link>
                </li>
                <li>
                  <Link href="/careers" onClick={openMenu}>Careers</Link>
                </li>
                <li>
                  <Link href="/contact-us" onClick={openMenu}>Contact us</Link>
                </li>
              </ul>
            </div>
            <div className="socialMediaLink">
              <ul className="list-inline">
                <li>
                  <Link
                    href="https://www.facebook.com/starestate.in"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/starestate_official/"
                    target="_blank"
                  >
                    <i className="fab fa-instagram"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.linkedin.com/company/star-estate"
                    target="_blank"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                </li>
                <li>
                  <Link
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
    </>
  );
};
export default Header;
