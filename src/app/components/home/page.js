"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { faEnvelope, faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import "./home.css";
import DreamProject from "./dream-project/page";
import Featured from "./featured/page";
import NewsViews from "./new-views/page";
import SocialFeed from "./social-feed/page";
import Header from "../header/page";
import Footer from "../footer/page";
import { useEffect, useState } from "react";
import axios from "axios";
import InsightNew from "./insight/page";
export default function HomePage() {
  const [projectTypeList, setProjectTypeList] = useState([]);
  const [imageSrc, setImageSrc] = useState("/banner-desktop.webp");
  const [cityList, setCityList] = useState([]);
  //defining project range
  const projectRange = ["Up to 1Cr*", "1-3 Cr*", "3-5 Cr*", "Above 5 Cr*"];
  //Our facts
  const ourFacts = [
    {
      id: 1,
      numbers: "12+",
      text: "Years of experience",
    },
    {
      id: 2,
      numbers: "2000+",
      text: "Units booked",
    },
    {
      id: 3,
      numbers: "200+",
      text: "Happy faces",
    },
    {
      id: 4,
      numbers: "20Mln+",
      text: "Area sold(sq.ft)",
    },
  ];
  const fetchProjectTypes = async () => {
    const projectTypesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    if (projectTypesResponse) {
      setProjectTypeList(projectTypesResponse.data);
    }
  };
  //Fetching all city
  const fetchAllCities = async () => {
    const projectTypesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    if (projectTypesResponse) {
      setCityList(projectTypesResponse.data);
    }
  };
  useEffect(() => {
    fetchProjectTypes();
    fetchAllCities();
  }, []);

  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth <= 768) {
        setImageSrc("/banner-mobile.webp");
      } else if (window.innerWidth <= 1200) {
        setImageSrc("/banner-tablet.webp");
      } else {
        setImageSrc("/banner-desktop.webp");
      }
    };
    updateImage(); // Set initial image
    window.addEventListener("resize", updateImage);
    return () => window.removeEventListener("resize", updateImage);
  }, []);

  return (
    <>
      <Header />
      <div id="banner" className="banner">
        <Image
          src={imageSrc}
          alt="My propery fact"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
          srcSet="
              /banner-mobile.webp 600w,
              /banner-tablet.webp 1200w,
              /banner-desktop.webp 1920w"
          objectFit="fill"
          layout="fill"
        />
        <div className="bannerContainer">
          <h1 className="h1">Find the best property</h1>
          <div className="btn-container">
            {projectTypeList.map((item, index) => (
              <div key={`row-${index}`} className="readmore mt-0">
                <a href={`projects/${item.slugUrl}`} className="button light">
                  {item.projectTypeName}
                </a>
              </div>
            ))}
          </div>
          <div className="statsWrapper">
            <div className="row gap-row">
              {ourFacts.map((item, index) => (
                <div key={`${item.text}-${index}`} className="col-md-3 col-sm-6 statBox">
                  <section>
                    <h6 className="h3">
                      <span className="counter">{item.numbers}</span>
                      {/* <small>+</small> */}
                    </h6>
                    <p>{item.text}</p>
                  </section>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-100 search-filter">
        <div className="container">
          <div className="filter-form">
            <form method="POST" action="projects" encType="multipart/form-data">
              <div className="form-row align-items-center">
                <div className="col">
                  <select
                    name="category"
                    id="category"
                    className="form-control"
                    title="category"
                  >
                    <option value="">Property Type</option>
                    {projectTypeList.map((item, index) => (
                      <option key={`${item.projectTypeName}-${index}`}>
                        {item.projectTypeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    name="location"
                    id="location"
                    className="form-control"
                    title="location"
                  >
                    <option>Select Location</option>
                    {cityList.map((item, index) => (
                      <option key={`${item.name}-${index}`} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <select
                    name="projectname"
                    id="projectname"
                    className="form-control"
                    title="projectname "
                  >
                    <option value="">Price Range</option>
                    {projectRange.map((option, index) => (
                      <option key={`${option.id}-${index}`} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="readmore mt-0 pr-2">
                  <input type="hidden" name="projectfltr" value="active" />
                  <button className="button" type="submit">
                    <FontAwesomeIcon icon={faSearch} width={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button className="enquiry-sticky-btn">
        <span>
          <FontAwesomeIcon icon={faEnvelope} width={20} />
          <span>Enquiry</span>
        </span>
      </button>
      <InsightNew />
      {/* <Insight /> */}
      <Featured />
      <DreamProject />
      <NewsViews />
      <SocialFeed />
      <Footer />
    </>
  );
}
