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
  useEffect(() => {
    fetchData();
    fetchBuilders();
    fetchProjectTypes();
  }, []);
  const openMenu = () => {
    const menuButtons = document.getElementsByClassName("menuBtn");

    for (let i = 0; i < menuButtons.length; i++) {
      menuButtons[i].classList.add("closeMenuBtn");
    }
    document.getElementById("mbdiv").style.display = "block";
    document.getElementById("mbdiv").classList.add("active");
    // if (mbMenuContainer) {
    //   mbMenuContainer.style.display = mbMenuContainer.style.display === 'none' ? 'block' : 'none';
    //   mbMenuContainer.classList.toggle('active');
    // }

    // Toggle className for .header
    const header = document.querySelector(".header");
    if (header) {
      header.classList.toggle("notfixed");
    }

    // Toggle className for body
    document.body.classList.toggle("overflow-hidden");
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
                  <a>
                    City<sup>+</sup>
                  </a>
                  <div className="dropdown dropdown-lg">
                    <ul className="list-inline">
                      {cityList.map((city) => (
                        <li key={city.id}>
                          <Link href={`/city/${city.slugUrl}`}>{city.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="hasChild">
                  <a href="#">
                    Builder<sup>+</sup>
                  </a>
                  <div className="dropdown dropdown-lg">
                    <ul className="list-inline">
                      {builderList.map((builder) => (
                        <li key={builder.id}>
                          <Link href={`/builder/${builder.slugUrl}`}>{builder.builderName}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="hasChild">
                  <a href="/projects">
                    Projects<sup>+</sup>
                  </a>
                  <div className="dropdown">
                    <ul className="list-inline">
                      {projectTypes.map((project) => (
                        <li key={project.id}>
                          <Link href={`/projects/${project.slugUrl}`}>{project.projectTypeName}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="hasChild">
                  <a href="#">
                    About Us
                  </a>
                </li>
                <li className="hasChild">
                  <a href="#">
                    Media
                    {/* <sup>+</sup> */}
                  </a>
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
                  <a href="clients-speak.html">Clients Speak</a>
                </li>
                <li>
                  <a href="careers.html">Careers</a>
                </li>
                <li>
                  <Link href="/components/contact-us">Contact us</Link>
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
                    <a href="index.html">Home</a>
                  </li>
                  <li className="mb-hasChild">
                    <a href="javascript:;">
                      City<sup>+</sup>
                    </a>
                    <div className="dropdown">
                      <ul className="list-inline">
                        <li>
                          <a href="city/agra.html">Agra</a>
                        </li>
                        <li>
                          <a href="city/ahmedabad.html">Ahmedabad</a>
                        </li>
                        <li>
                          <a href="city/ayodhya.html">Ayodhya</a>
                        </li>
                        <li>
                          <a href="city/bangalore.html">Bangalore</a>
                        </li>
                        <li>
                          <a href="city/chennai.html">Chennai</a>
                        </li>
                        <li>
                          <a href="city/delhi.html">Delhi</a>
                        </li>
                        <li>
                          <a href="city/faridabad.html">Faridabad</a>
                        </li>
                        <li>
                          <a href="city/ghaziabad.html">Ghaziabad</a>
                        </li>
                        <li>
                          <a href="city/greater-noida.html">Greater Noida</a>
                        </li>
                        <li>
                          <a href="city/gurugram.html">Gurugram</a>
                        </li>
                        <li>
                          <a href="city/hyderabad.html">Hyderabad</a>
                        </li>
                        <li>
                          <a href="city/lucknow.html">Lucknow</a>
                        </li>
                        <li>
                          <a href="city/mathura.html">Mathura</a>
                        </li>
                        <li>
                          <a href="city/mohali.html">Mohali</a>
                        </li>
                        <li>
                          <a href="city/mumbai.html">Mumbai</a>
                        </li>
                        <li>
                          <a href="city/noida.html">Noida</a>
                        </li>
                        <li>
                          <a href="city/pune.html">Pune</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="mb-hasChild">
                    <a href="javascript:;">
                      Builder<sup>+</sup>
                    </a>
                    <div className="dropdown">
                      <ul className="list-inline">
                        <li>
                          <a href="builder/aba-corp.html">ABA Corp</a>
                        </li>
                        <li>
                          <a href="builder/ace.html">Ace</a>
                        </li>
                        <li>
                          <a href="builder/adani-realty.html">Adani Realty</a>
                        </li>
                        <li>
                          <a href="builder/ashiana-housing.html">
                            Ashiana Housing
                          </a>
                        </li>
                        <li>
                          <a href="builder/assetz-property.html">
                            Assetz Property
                          </a>
                        </li>
                        <li>
                          <a href="builder/ats.html">ATS</a>
                        </li>
                        <li>
                          <a href="builder/birla-estate.html">Birla Estate</a>
                        </li>
                        <li>
                          <a href="builder/bptp.html">BPTP</a>
                        </li>
                        <li>
                          <a href="builder/county-group.html">County Group</a>
                        </li>
                        <li>
                          <a href="builder/dlf.html">DLF</a>
                        </li>
                        <li>
                          <a href="builder/eldeco.html">Eldeco</a>
                        </li>
                        <li>
                          <a href="builder/emaar-india.html">Emaar India</a>
                        </li>
                        <li>
                          <a href="builder/embassy-group.html">Embassy Group</a>
                        </li>
                        <li>
                          <a href="builder/gaurs.html">GAURS</a>
                        </li>
                        <li>
                          <a href="builder/godrej-properties.html">
                            Godrej Properties
                          </a>
                        </li>
                        <li>
                          <a href="builder/gulshan.html">Gulshan</a>
                        </li>
                        <li>
                          <a href="builder/hero-realty.html">Hero Realty</a>
                        </li>
                        <li>
                          <a href="builder/hiranandani-developer.html">
                            Hiranandani Developer
                          </a>
                        </li>
                        <li>
                          <a href="builder/ira-realty.html">IRA Realty</a>
                        </li>
                        <li>
                          <a href="builder/jashn-realty.html">Jashn Realty</a>
                        </li>
                        <li>
                          <a href="builder/kalpa-taru.html">Kalpa-Taru</a>
                        </li>
                        <li>
                          <a href="builder/kolte-patil-developer.html">
                            Kolte Patil Developer
                          </a>
                        </li>
                        <li>
                          <a href="builder/l-and-t.html">L AND T</a>
                        </li>
                        <li>
                          <a href="builder/laureate-buildwell.html">
                            Laureate Buildwell
                          </a>
                        </li>
                        <li>
                          <a href="builder/lodha.html">Lodha</a>
                        </li>
                        <li>
                          <a href="builder/m3m.html">M3M</a>
                        </li>
                        <li>
                          <a href="builder/mahagun.html">Mahagun</a>
                        </li>
                        <li>
                          <a href="builder/max-estates.html">Max Estates</a>
                        </li>
                        <li>
                          <a href="builder/oberoi-realty.html">Oberoi Realty</a>
                        </li>
                        <li>
                          <a href="builder/omaxe-limited.html">Omaxe Limited</a>
                        </li>
                        <li>
                          <a href="builder/paras.html">Paras</a>
                        </li>
                        <li>
                          <a href="builder/piramal-realty.html">
                            Piramal Realty
                          </a>
                        </li>
                        <li>
                          <a href="builder/prateek-group.html">Prateek Group</a>
                        </li>
                        <li>
                          <a href="builder/prestige-group.html">
                            Prestige Group
                          </a>
                        </li>
                        <li>
                          <a href="builder/puravankara-limited.html">
                            Puravankara Limited
                          </a>
                        </li>
                        <li>
                          <a href="builder/purvanchal.html">Purvanchal</a>
                        </li>
                        <li>
                          <a href="builder/raheja-developers.html">
                            Raheja Developers
                          </a>
                        </li>
                        <li>
                          <a href="builder/raymond-realty.html">
                            Raymond Realty
                          </a>
                        </li>
                        <li>
                          <a href="builder/samridhi-group.html">
                            Samridhi Group
                          </a>
                        </li>
                        <li>
                          <a href="builder/shriram-properties.html">
                            Shriram Properties
                          </a>
                        </li>
                        <li>
                          <a href="builder/signature-global.html">
                            Signature Global
                          </a>
                        </li>
                        <li>
                          <a href="builder/smartworld-developers.html">
                            Smartworld Developers
                          </a>
                        </li>
                        <li>
                          <a href="builder/sobha-limited.html">Sobha Limited</a>
                        </li>
                        <li>
                          <a href="builder/sumadhura-infracon.html">
                            Sumadhura Infracon
                          </a>
                        </li>
                        <li>
                          <a href="builder/suncity-projects.html">
                            Suncity Projects
                          </a>
                        </li>
                        <li>
                          <a href="builder/tata-value-homes.html">
                            TATA Value Homes
                          </a>
                        </li>
                        <li>
                          <a href="builder/tvs-emerald.html">TVS Emerald</a>
                        </li>
                        <li>
                          <a href="builder/vtp-realty.html">VTP Realty</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="mb-hasChild">
                    <a href="javascript:;">
                      Projects<sup>+</sup>
                    </a>
                    <div className="dropdown">
                      <ul className="list-inline">
                        <li>
                          <a href="category/luxury.html">Luxury</a>
                        </li>
                        <li>
                          <a href="category/commercial.html">Commercial</a>
                        </li>
                        <li>
                          <a href="category/residential.html">Residential</a>
                        </li>
                        <li>
                          <a href="category/new-launch.html">New Launches</a>
                        </li>
                        <li>
                          <a href="nbcc-aspire.html">NBCC Aspire</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="mb-hasChild">
                    <a href="javascript:;">
                      About Us<sup>+</sup>
                    </a>
                    <div className="dropdown">
                      <ul className="list-inline">
                        <li>
                          <a href="about-us.html">About Star Estate</a>
                        </li>
                        <li>
                          <a href="about-us.html#mission">Mission & Vision</a>
                        </li>
                        <li>
                          <a href="about-us.html#who-we-are">Who We Are</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="mb-hasChild">
                    <a href="javascript:;">
                      Media<sup>+</sup>
                    </a>
                    <div className="dropdown">
                      <ul className="list-inline">
                        <li>
                          <a href="news.html">News</a>
                        </li>
                        <li>
                          <a href="blogs.html">Blogs</a>
                        </li>
                        <li>
                          <a href="events.html">Events</a>
                        </li>
                        <li>
                          <a href="advertisements.html">Advertisements</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="smallMenuList">
                <ul className="list-inline">
                  <li>
                    <a href="clients-speak.html">Clients Speak</a>
                  </li>
                  <li>
                    <a href="careers.html">Careers</a>
                  </li>
                  <li>
                    <a href="contact-us.html">Contact us</a>
                  </li>
                </ul>
              </div>
              <div className="socialMediaLink">
                <ul className="list-inline">
                  <li>
                    <a
                      href="https://www.facebook.com/starestate.in"
                      target="_blank"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/starestate_official/"
                      target="_blank"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/star-estate"
                      target="_blank"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/channel/UCwfDf7Ut8jrkjiBeRnbZUPw"
                      target="_blank"
                    >
                      <i className="fab fa-youtube"></i>
                    </a>
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
