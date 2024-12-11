"use client";
import Link from "next/link";
import "./header.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import axios from "axios";
const Header = () => {
  const [cityList, setCityList] = useState([]);
  const [builderList, setBuilderList] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
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
      <header className="header">
        <div className="main-header">
          <div className="logo">
            <Link href="/">
              <img
                src="/logo.png"
                alt="My Property facts"
                height={70}
                width={100}
              />
              {/* <p className="logo-text">MY PROPERTY</p>
              <span className="logo-text2">FACT</span> */}
            </Link>
          </div>
          <nav className="navi d-none d-xl-flex">
            <div className="menu position-relative">
              <ul className="list-inline">
                <li className="hasChild">
                  <Link href="#">
                    City<sup>+</sup>
                  </Link>
                  <div className="dropdown dropdown-lg">
                    <ul className="list-inline">
                      {cityList.map((city) => (
                        <li key={city.id}>
                          <Link href={`/city/${city.slugUrl}`}>
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="hasChild">
                  <Link href="#">
                    Builder<sup>+</sup>
                  </Link>
                  <div className="dropdown dropdown-lg">
                    <ul className="list-inline">
                      {builderList.map((builder) => (
                        <li key={builder.id}>
                          <Link href={`/builder/${builder.slugUrl}`}>
                            {builder.builderName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="hasChild">
                  <Link href="/projects">
                    Projects<sup>+</sup>
                  </Link>
                  <div className="dropdown">
                    <ul className="list-inline">
                      {projectTypes.map((project) => (
                        <li key={project.id}>
                          <Link href={`/projects/${project.slugUrl}`}>
                            {project.projectTypeName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="hasChild">
                  <Link href="/about-us">About Us</Link>
                </li>
                <li className="hasChild">
                  <Link href="/media">
                    Media
                    {/* <sup>+</sup> */}
                  </Link>
                  {/* <div className="dropdown">
                    <ul className="list-inline">
                      {CityList.resources.map((media) => (
                        <li key={media.name}>
                          <Link href={media.url}>{media.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div> */}
                </li>
                <li>
                  <Link href="/clients-speak">Clients Speak</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact us</Link>
                </li>
                {/* <li><Link href="/contact-us">Login/Register</Link></li> */}
              </ul>
            </div>
          </nav>
          <div className="menuBtn" onClick={openMenu}>
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
                    <Link href="/">Home</Link>
                  </li>
                  <li className={`mb-hasChild ${activeDropdown === 'city' ? 'active' : ''}`}>
                    <Link href="#" onClick={()=>openMenuMobile('city')}>
                      City<sup>+</sup>
                    </Link>
                    <div className={`dropdown ${activeDropdown === 'city' ? 'activeHeader' : ''}`}>
                      <ul className="list-inline">
                        {cityList.map((city) => (
                          <li key={city.id}>
                            <Link href={`/city/${city.slugUrl}`}>
                              {city.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li className={`mb-hasChild ${activeDropdown === 'builder' ? 'active' : ''}`}>
                    <Link href="#" onClick={()=>openMenuMobile('builder')}>
                      Builder<sup>+</sup>
                    </Link>
                    <div className={`dropdown ${activeDropdown === 'builder' ? 'activeHeader' : ''}`}>
                      <ul className="list-inline">
                        {builderList.map((builder) => (
                          <li key={builder.id}>
                            <Link href={`/builder/${builder.slugUrl}`}>
                              {builder.builderName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  <li className={`mb-hasChild ${activeDropdown === 'projects' ? 'active' : ''}`}>
                    <Link href="#" onClick={()=>openMenuMobile('projects')}>
                      Projects<sup>+</sup>
                    </Link>
                    <div className={`dropdown ${activeDropdown === 'projects' ? 'activeHeader' : ''}`}>
                      <ul className="list-inline">
                        {projectTypes.map((project) => (
                          <li key={project.id}>
                            <Link href={`/projects/${project.slugUrl}`}>
                              {project.projectTypeName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                  {/* <li className="mb-hasChild">
                    <Link href="javascript:;">
                      Media<sup>+</sup>
                    </Link>
                    <div className="dropdown">
                      <ul className="list-inline">
                        <li>
                          <Link href="news.html">News</Link>
                        </li>
                        <li>
                          <Link href="blogs.html">Blogs</Link>
                        </li>
                        <li>
                          <Link href="events.html">Events</Link>
                        </li>
                        <li>
                          <Link href="advertisements.html">Advertisements</Link>
                        </li>
                      </ul>
                    </div>
                  </li> */}
                </ul>
              </div>
              <div className="smallMenuList">
                <ul className="list-inline">
                  <li>
                    <Link href="/media">Media</Link>
                  </li>
                  <li>
                    <Link href="/about-us">About Us</Link>
                  </li>
                  <li>
                    <Link href="/clients-speak">Clients Speak</Link>
                  </li>
                  <li>
                    <Link href="/careers">Careers</Link>
                  </li>
                  <li>
                    <Link href="/contact-us">Contact us</Link>
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
      </header>
    </>
  );
};
export default Header;
