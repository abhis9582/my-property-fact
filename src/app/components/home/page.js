"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import { faEnvelope, faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import "./home.css";
import Insight from "./insight-tools/page";
import DreamProject from "./dream-project/page";
import Featured from "./featured/page";
import NewsViews from "./new-views/page";
import SocialFeed from "./social-feed/page";
import Header from "../header/page";
import Footer from "../footer/page";
import { useEffect, useState } from "react";
import axios from "axios";
export default function HomePage() {
  const [typeList, setTypeList] = useState([]);
  const fetchProjectTypes = async () => {
    const projectTypesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    if (projectTypesResponse) {
      setTypeList(projectTypesResponse.data);
    }
  };
  useEffect(() => {
    fetchProjectTypes();
  }, []);
  return (
    <>
      <Header />
      <div id="banner" className="banner">
        <picture>
          <Image
            src="/banner-new-4k.jpg"
            alt="Star Estate"
            layout="fill"
            objectFit="cover"
          />
        </picture>
        <div className="bannerContainer">
          <h1 className="h1">Find the best property</h1>
          <div className="btn-container d-flex justify-content-center my-3 my-md-4">
            {typeList.map((item) => (
              <div key={item.id} className="readmore mt-0">
                <a href="#" className="button light">
                  {item.projectTypeName}
                </a>
              </div>
            ))}
          </div>
          <div className="statsWrapper">
            <div className="row gap-row">
              <div className="col-md-3 col-sm-6 statBox">
                <section>
                  <h6 className="h3">
                    <span className="counter">12</span>
                    <small>+</small>
                  </h6>
                  <p>Years of Experience</p>
                </section>
              </div>
              <div className="col-md-3 col-sm-6 statBox">
                <section>
                  <h6 className="h3">
                    <span className="counter">20000</span>
                    <small>+</small>
                  </h6>
                  <p>Units Booked</p>
                </section>
              </div>
              <div className="col-md-3 col-sm-6 statBox">
                <section>
                  <h6 className="h3">
                    <span className="counter">50000</span>
                    <small>+</small>
                  </h6>
                  <p>Happy Faces</p>
                </section>
              </div>
              <div className="col-md-3 col-sm-6 statBox">
                <section>
                  <h6 className="h3">
                    <span className="counter">50</span>
                    <small>Mln+</small>
                  </h6>
                  <p>Area Sold (Sq.ft)</p>
                </section>
              </div>
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
                    <option value="2">Commercial</option>
                    <option value="1">Residential</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    name="location"
                    id="location"
                    className="form-control"
                    title="location"
                  >
                    <option value="">Project Location</option>
                    <option value="agra">Agra</option>
                    <option value="ahmedabad">Ahmedabad</option>
                    <option value="ayodhya">Ayodhya</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                    <option value="delhi">Delhi</option>
                    <option value="faridabad">Faridabad</option>
                    <option value="ghaziabad">Ghaziabad</option>
                    <option value="greater noida">Greater Noida</option>
                    <option value="gurugram">Gurugram</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="lucknow">Lucknow</option>
                    <option value="mathura">Mathura</option>
                    <option value="mohali">Mohali</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="noida">Noida</option>
                    <option value="pune">Pune</option>
                  </select>
                </div>
                <div className="col">
                  <select
                    name="projectname"
                    id="projectname"
                    className="form-control"
                    title="projectname "
                  >
                    <option value="">Project Options</option>
                    {typeList.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.projectTypeName}
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
      <Insight />
      <div className=" mt-4 row" style={{ width: "100% !important" }}>
        <p className="h2 text-center mt-4">Featured Projects</p>
        <Featured />
      </div>
      <DreamProject />
      <NewsViews />
      <SocialFeed />
      <Footer />
    </>
  );
}
