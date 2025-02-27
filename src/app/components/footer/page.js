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
  // Defining footer media array
  const mediaArr = [
    {
      id: 1,
      name: "News",
      slugUrl: "/",
    },
    {
      id: 2,
      name: "Blogs",
      slugUrl: "/media",
    },
    {
      id: 3,
      name: "Events",
      slugUrl: "/",
    },
    {
      id: 4,
      name: "Advertisements",
      slugUrl: "/",
    },
    {
      id: 5,
      name: "Newsletter",
      slugUrl: "/",
    },
  ];

  //Defining company array
  const companyArr = [
    {
      id: 1,
      name: "About MPF",
      slugUrl: "/about-us",
    },
    {
      id: 2,
      name: "Mission & Vision",
      slugUrl: "/",
    },
    {
      id: 3,
      name: "Who we are",
      slugUrl: "/",
    },
    {
      id: 4,
      name: "Client's speak",
      slugUrl: "/",
    },
    {
      id: 5,
      name: "FAQs",
      slugUrl: "/",
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
      <footer className="footer-area overflow-hidden float-left w-100">
        <div className="py-3 foot-links" style={{ backgroundColor: "#101010" }}>
          <div className="container-fluid">
            <div className="inner">
              <div className="row gap-row">
                <div className="col-md-12 col-sm-12 foot-menu">
                  <div className="insideBox">
                    <h6>Cities</h6>
                    <ul className="list-inline footer-cities d-flex flex-wrap">
                      {cityList.map((item, index) => (
                        <li key={`${item.name}-${index}`}>
                          <Link href={item.slugUrl}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="padding border-bottom footer-keywords">
            <div className="row">
              <div className="col-md-3">
                <ul className="row list-inline">
                  {cityList.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <Link href={item.slugUrl}>Apartments in {item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-3">
                <ul className="row list-inline">
                  {cityList.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <Link href={item.slugUrl}>
                        New Projects in {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-3">
                <ul className="row list-inline">
                  {cityList.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <Link href={item.slugUrl}>Flats in {item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-md-3">
                <ul className="row list-inline">
                  {cityList.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      <Link href={item.slugUrl}>
                        Commercial Property in {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="padding foot-links">
            <div className="inner">
              <div className="row gap-row">
                <div className="col foot-menu">
                  <div className="insideBox">
                    <h6>Projects</h6>
                    <ul className="list-inline">
                      {projectTypes.map((item, index) => (
                        <li key={`${item.name}-${index}`}>
                          <Link href={item.slugUrl}>
                            {item.projectTypeName}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col foot-menu">
                  <div className="insideBox">
                    <h6>Company</h6>
                    <ul className="list-inline">
                      {companyArr.map((item, index) => (
                        <li key={`${item.id}-${index}`}>
                          <Link href={item.slugUrl}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col foot-menu">
                  <div className="insideBox">
                    <h6>Media</h6>
                    <ul className="list-inline">
                      {mediaArr.map((item, index) => (
                        <li key={`${item.id}-${index}`}>
                          <Link href={item.slugUrl}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col foot-menu">
                  <div className="insideBox">
                    <h6>Explore</h6>
                    <ul className="list-inline">
                      {exploreArr.map((item, index) => (
                        <li key={`${item.id}-${index}`}>
                          <Link href={item.slugUrl}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col foot-menu socialBox">
                  <div className="insideBox">
                    <h6>Get Social</h6>
                    <ul className="list-inline socialMediaLink socialSolid">
                      <li className="list-inline-item">
                        <Link href="#" target="_blank" title="facebook">
                          <FontAwesomeIcon icon={faFacebook} />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link href="#" target="_blank" title="instagram">
                          <FontAwesomeIcon icon={faInstagram} />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link href="#" target="_blank" title="linkedin">
                          <FontAwesomeIcon icon={faLinkedin} />
                        </Link>
                      </li>
                      <li className="list-inline-item">
                        <Link href="#" target="_blank" title="youtube">
                          <FontAwesomeIcon icon={faYoutube} />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="modal fade" id="formModal">
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header bg-yellow">
              <h6 className="modal-title">For any query, fill the form.</h6>
            </div>
            <div className="modal-body">
              <div className="formContainer text-white">
                <div className="form">
                  <form
                    className="form-container"
                    id="contact_form"
                    method="post"
                  >
                    <p className="status mb-0 text-warning"></p>
                    <div className="form-row">
                      <div className="col-md-12 form-group">
                        <label htmlFor="name">
                          Name<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-white"
                          id="name"
                          name="name"
                        />
                      </div>
                      <div className="col-md-12 form-group">
                        <label htmlFor="email">
                          Email<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-white"
                          name="email"
                          id="email"
                        />
                      </div>
                      <div className="col-md-12 form-group">
                        <label htmlFor="mobile">
                          Mobile<sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-white"
                          name="mobile"
                          id="mobile"
                        />
                      </div>
                      <div className="col-md-12 formFooter readmore mt-0">
                        <input
                          type="hidden"
                          name="contact_action"
                          value="active"
                        />
                        <input
                          type="hidden"
                          id="pagename"
                          name="pagename"
                          value=""
                        />
                        <input
                          type="hidden"
                          name="proj_category"
                          id="fproj_category"
                          value=""
                        />
                        <input
                          type="hidden"
                          name="fproj_addrr"
                          id="fproj_addrr"
                          value=""
                        />
                        <input
                          type="hidden"
                          name="projecturls"
                          value="www.starestate.in/"
                        />
                        <input type="hidden" name="utm_source" value="" />
                        <input type="hidden" name="utm_medium" value="" />
                        <input type="hidden" name="utm_campaign" value="" />
                        <button
                          type="submit"
                          className="button hoverOnWhite mx-auto"
                        >
                          Submit
                        </button>
                      </div>
                      <div className="col-md-12 modal-call text-center gap-form-row mt-4 d-flex flex-wrap align-items-center justify-content-center">
                        <h6 className="mb-0">Request a Call Back</h6>
                        <div className="readmore ml-0 ml-sm-3 mt-0">
                          <a href="#" className="button gray">
                            <i className="fa fa-phone"></i>
                            <span id="ivrmodal">+91 000 0000 000</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
