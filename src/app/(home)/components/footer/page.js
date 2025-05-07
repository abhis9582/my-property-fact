"use client";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./footer.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import CityList from "../common/citylistcard";

export default function Footer() {
  //Defining states
  const [cityList, setCityList] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  //Function for fetching all cities list

  const fetchAllCity = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    if (response) {
      setCityList(response.data); // setting all city list
    }
  };

  const [showAll, setShowAll] = useState(false);
  const visibleCities = showAll ? cityList : cityList.slice(0, 5);

  // Defining footer media array
  const mediaArr = [
    // {
    //   id: 1,
    //   name: "News",
    //   slugUrl: "/",
    // },
    {
      id: 2,
      name: "Blog",
      slugUrl: "/blog",
    },
    // {
    //   id: 3,
    //   name: "Events",
    //   slugUrl: "/",
    // },
    // {
    //   id: 4,
    //   name: "Advertisements",
    //   slugUrl: "/",
    // },
    // {
    //   id: 5,
    //   name: "Newsletter",
    //   slugUrl: "/",
    // },
  ];

  //Defining company array
  const companyArr = [
    {
      id: 1,
      name: "About MPF",
      slugUrl: "/about-us",
    },
    {
      id: 3,
      name: "Contact Us",
      slugUrl: "/contact-us",
    },
    // {
    //   id: 4,
    //   name: "Client's speak",
    //   slugUrl: "/clients-speak",
    // },
    {
      id: 5,
      name: "Career",
      slugUrl: "/career",
    },
  ];
  //Defining Explore array
  const exploreArr = [
    {
      id: 1,
      name: "Careers",
      slugUrl: "/",
    },
    {
      id: 2,
      name: "Contact us",
      slugUrl: "/contact-us",
    },
    {
      id: 3,
      name: "Buyer guide",
      slugUrl: "/",
    },
    {
      id: 4,
      name: "Term & conditions",
      slugUrl: "/",
    },
    {
      id: 5,
      name: "Sitemap",
      slugUrl: "/",
    },
  ];
  //Fetching all project type
  const fetchProjectTypes = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    if (response) {
      setProjectTypes(response.data);
    }
  };

  //defining function for call on every render
  useEffect(() => {
    fetchAllCity();
    fetchProjectTypes();
  }, []);

  return (
    <>
      <footer className="font-gotham-light footer-bg">
        <div className="pt-5 pb-3 container-fluid">
          <div className="container-fluid">
            <div className="inner">
              <div className="row gap-row">
                <div className="col-md-12 col-sm-12 foot-menu">
                  <div className="insideBox">
                    <p className="text-white mx-4">Popular cities</p>
                    <ul className=" footer-cities d-flex flex-wrap">
                      {cityList.map((item, index) => (
                        <li key={`${item.name}-${index}`}>
                          <Link className="footer-text" href={`/city/${item.slugUrl}`}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid py-3">
          <div className="padding border-bottom footer-keywords">
            <div className="row">
              <div className="col-md-3">
                <ul>
                  <p className="text-white">Apartments in India</p>
                  <CityList cityList={cityList} />
                </ul>
              </div>
              <div className="col-md-3">
                <ul>
                  <p className="text-white">New Projects in India</p>
                  <CityList cityList={cityList} />
                </ul>
              </div>
              <div className="col-md-3">
                <ul>
                  <p className="text-white">Flats in India</p>
                  <CityList cityList={cityList} />
                </ul>
              </div>

              <div className="col-md-3">
                <ul>
                  <p className="text-white">Commercial Property in India</p>
                  <CityList cityList={cityList} />
                </ul>
              </div>
            </div>
          </div>
          <div className="container pt-5">
            <div className="row">
              <div className="col-6 col-md-3 col-sm-6">
                <p className="text-white">Projects</p>
                <ul className="p-0">
                  {projectTypes.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <Link className="footer-text" href={`/projects/${item.slugUrl}`}>
                        {item.projectTypeName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-3 col-sm-6">
                <p className="text-white">Company</p>
                <ul className="p-0">
                  {companyArr.map((item, index) => (
                    <li key={`${item.id}-${index}`}>
                      <Link className="footer-text" href={item.slugUrl} scroll={true}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-3 col-sm-6">
                <p className="text-white">Media</p>
                <ul className="p-0">
                  {mediaArr.map((item, index) => (
                    <li key={`${item.id}-${index}`}>
                      <Link className="footer-text" href={item.slugUrl}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6 col-md-3 col-sm-6">
                <div>
                  <p className="text-white">Get Social</p>
                  <ul className="d-flex gap-3 p-0">
                    <li className="">
                      <Link className="fs-4 text-white hover-green" href="https://www.facebook.com/mypropertyfact1/" target="_blank" title="facebook">
                        <FontAwesomeIcon icon={faFacebook} />
                      </Link>
                    </li>
                    <li className="">
                      <Link className="fs-4 text-white" href="https://www.instagram.com/my.property.fact/" target="_blank" title="instagram">
                        <FontAwesomeIcon icon={faInstagram} />
                      </Link>
                    </li>
                    <li className="">
                      <Link className="fs-4 text-white" href="https://www.linkedin.com/company/my-property-fact/" target="_blank" title="linkedin">
                        <FontAwesomeIcon icon={faLinkedin} />
                      </Link>
                    </li>
                    <li className="">
                      <Link className="fs-4 text-white" href="https://www.youtube.com/@my.propertyfact/" target="_blank" title="youtube">
                        <FontAwesomeIcon icon={faYoutube} />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <p className="pb-3 footer-text text-center m-0">The content and data are for informative purposes only and may be prone to inaccuracy and inconsistency. We do not take any responsibility for data mismatches and strongly advise the viewers to conduct their detailed research before making any investment or purchase-related decisions.</p>
        </div>
      </footer>
    </>
  );
}
