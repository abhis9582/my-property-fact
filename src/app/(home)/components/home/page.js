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
import { useEffect, useState } from "react";
import axios from "axios";
import InsightNew from "./insight/page";
import FixedForm from "../fixedform";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function HomePage() {
  const [projectTypeList, setProjectTypeList] = useState([]);
  const [imageSrc, setImageSrc] = useState("/banner-desktop.jpg");
  const [cityList, setCityList] = useState([]);
  const [propertType, setPropertyType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [enquiryButtonName, setEnquiryButtonName] = useState("Enquiry");
  const [resetTrigger, setResetTrigger] = useState(false);
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
  // handle search
  const handleSearch = () => {
    console.log(propertType, propertyLocation, budget);
  };
  useEffect(() => {
    const updateImage = () => {
      if (window.innerWidth <= 768) {
        setImageSrc("/banner-mobile.jpg");
      } else if (window.innerWidth <= 1200) {
        setImageSrc("/banner-tablet.jpg");
      } else {
        setImageSrc("/banner-desktop.jpg");
      }
    };
    updateImage(); // Set initial image
    window.addEventListener("resize", updateImage);
    return () => window.removeEventListener("resize", updateImage);
  }, []);

  //Handle opening fixed form
  const openFixedForm = () => {
    setShowForm((prev) => {
      const newState = !prev;
      setEnquiryButtonName(newState ? "Close" : "Enquiry");
      if (!newState) {
        setResetTrigger(true); // Toggle to trigger useEffect in FixedForm
      }else{
        setResetTrigger(false);
      }
      return newState;
    });
  };
  //Hiding form after submission
  const handleSuccess = () => {
    toast.success("Form submitted successfully...");
    setShowForm(false); // Hide form after successful submission
    setEnquiryButtonName("Enquiry");
  };
  return (
    <>
      <div className={`${showForm ? "show" : ""} fixed-form-container`}>
        <FixedForm resetTrigger={resetTrigger} onSuccess={handleSuccess}/>
      </div>
      <div id="banner" className="banner">
        <Image
          src={imageSrc}
          alt="My propery fact"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
          srcSet="
              /banner-mobile.jpg 600w,
              /banner-tablet.jpg 1200w,
              /banner-desktop.jpg 1920w"
          fill
          style={{ objectFit: "fill" }}
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
                <div
                  key={`${item.text}-${index}`}
                  className="col-md-3 col-sm-6 statBox"
                >
                  <section>
                    <h6 className="h3">
                      <span className="counter">{item.numbers}</span>
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
            <form method="Get" action="projects" encType="multipart/form-data">
              <div className="form-row align-items-center">
                <div className="col">
                  <select
                    name="category"
                    id="category"
                    className="form-control"
                    title="category"
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    <option value="">Property Type</option>
                    {projectTypeList.map((item, index) => (
                      <option
                        key={`${item.projectTypeName}-${index}`}
                        value={item.id}
                      >
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
                    onChange={(e) => setPropertyLocation(e.target.value)}
                  >
                    <option>Select Location</option>
                    {cityList.map((item, index) => (
                      <option key={`${item.name}-${index}`} value={item.name}>
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
                    onChange={(e) => setBudget(e.target.value)}
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
                  {/* <input type="hidden" name="projectfltr" value="active" /> */}
                  <button className="button" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch} width={20} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button className="enquiry-sticky-btn" onClick={openFixedForm}>
        <span>
          <FontAwesomeIcon icon={faEnvelope} width={20} />
          <span>{enquiryButtonName}</span>
        </span>
      </button>
      <InsightNew />
      {/* <Insight /> */}
      <Featured />
      <DreamProject />
      <NewsViews />
      <SocialFeed />
      <ToastContainer/>
    </>
  );
}
