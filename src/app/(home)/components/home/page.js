"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import Link from "next/link";
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
      } else {
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
        <FixedForm resetTrigger={resetTrigger} onSuccess={handleSuccess} />
      </div>
      <div className="position-relative">
        <div className="position-relative overflow-hidden">
          {/* <Image
            // src={imageSrc}
            alt="My propery fact"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1920px"
            srcSet="
                /banner-mobile.jpg 600w,
                /banner-tablet.jpg 1200w,
                /banner-desktop.jpg 1920w"
            fill
            style={{ objectFit: "fill" }}
            // width={1899}
            // height={550}
            className="banner-image"
          // layout="responsive"
          /> */}
          <picture>
            {/* Mobile Image */}
            <source srcSet="/banner-mobile.jpg" media="(max-width: 768px)" />
            {/* Tablet Image */}
            <source srcSet="/banner-tablet.jpg" media="(max-width: 1200px)" />
            {/* Default (Desktop) Image */}
            <Image
              src="/banner-desktop.jpg" // Fallback image
              alt="My property fact"
              fill
              style={{ objectFit: "cover" }} // "cover" looks better than "fill"
              className="banner-image position-relative"
            />
          </picture>
          <div className="overlay"></div>
        </div>
        <div className="bannercontainer">
          <h1 className="text-center text-light fw-bold">Find the best property</h1>
          <div className="d-flex flex-wrap align-item-center justify-content-center gap-4 my-4">
            {projectTypeList.map((item, index) => (
              <div key={`row-${index}`}>
                <Link href={`projects/${item.slugUrl}`} className="border rounded-5 py-2 px-3 bg-light text-dark home-property-types">
                  {item.projectTypeName}
                </Link>
              </div>
            ))}
          </div>
          <div className="data-container">
            {ourFacts.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className="data-container-child"
              >
                <section>
                  <p className="h3">
                    <span>{item.numbers}</span>
                  </p>
                  <p>{item.text}</p>
                </section>
              </div>
            ))}
          </div>
        </div>
        <div className="position-absolute bottom-25 start-50 translate-middle w-100">
          <div className="container bg-light border rounded-4">
            <form method="Get" action="projects" encType="multipart/form-data">
              <div className="d-flex flex-wrap flex-md-row flex-column p-4 gap-3">
                <div className="col">
                  <select
                    name="category"
                    id="category"
                    className="form-select"
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
                    className="form-select"
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
                    className="form-select"
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

                <div className="d-flex align-items-center">
                  <button className="mpf-bg py-1 px-4 text-light m-0 border rounded-3" onClick={handleSearch}>
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
      <div className="mt-5 home-insight-container">
        <InsightNew />
      </div>
      {/* <Insight /> */}
      <Featured />
      <DreamProject />
      <NewsViews />
      <SocialFeed />
      <ToastContainer />
    </>
  );
}
