"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import "./home.css";
import { useEffect, useState } from "react";
import FixedForm from "../fixedform";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useProjectContext } from "@/app/_global_components/contexts/projectsContext";
export default function ClientSideHomePage({ projectTypeList, cityList }) {
  const [propertType, setPropertyType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [enquiryButtonName, setEnquiryButtonName] = useState("Enquiry");
  const [resetTrigger, setResetTrigger] = useState(false);
  const router = useRouter();
  const { setProjectData } = useProjectContext();
  //defining project range
  const projectRange = ["Up to 1Cr*", "1-3 Cr*", "3-5 Cr*", "Above 5 Cr*"];

  //Our facts
  const ourFacts = [
    {
      id: 1,
      numbers: "50+",
      text: "Cities",
    },
    {
      id: 2,
      numbers: "80+",
      text: "Builders",
    },
    {
      id: 3,
      numbers: "500+",
      text: "Projects",
    },
    {
      id: 4,
      numbers: "10,000+",
      text: "Units",
    },
  ];

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

const handleSubmit = async (e) => {
  e.preventDefault();
  let params_obj  = {
    propertyType: propertType,        
    propertyLocation: propertyLocation,
    budget: budget,
  };

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget`,
      {
        params: {
          propertyType: propertType,
          propertyLocation: propertyLocation,
          budget: budget,
        },
      }
    );
    sessionStorage.setItem("mpf-querry", JSON.stringify(params_obj));
    setProjectData(response.data);
    router.push("/projects");
  } catch (error) {
    console.error("Error during project filtering:", error);
  }
};

  // useEffect(()=>{
  //   handleSubmit();
  // }, []);

  return (
    <>
      <div className={`${showForm ? "show" : ""} fixed-form-container`}>
        <FixedForm resetTrigger={resetTrigger} onSuccess={handleSuccess} />
      </div>
      <div className="position-relative mb-5">
        <div
          className="overflow-hidden"
          style={{ minHeight: "474px !important" }}
        >
          <div className="position-relative overflow-hidden">
            <picture className="position-relative">
              {/* Mobile Image */}
              <source
                srcSet="/mpf-tablet-banner.jpg"
                media="(max-width: 767px)"
              />

              {/* Tablet Image */}
              <source
                srcSet="/mpf-tablet-banner.jpg"
                media="(max-width: 1199px)"
              />

              {/* Default (Desktop) Image */}
              <Image
                src="/mpf-banner.jpg"
                alt="My property fact"
                fill
                priority
                style={{ objectFit: "cover" }}
                className="banner-image position-relative"
              />
            </picture>
          </div>
          {/* <div className="overlay"></div> */}
        </div>
        <div className="bannercontainer">
          <h1 className="text-center text-light fw-bold">
            Find the best property
          </h1>
          <div className="d-flex flex-wrap align-item-center justify-content-center gap-4 my-4">
            {projectTypeList.map((item, index) => (
              <div key={`row-${index}`}>
                <Link
                  href={`projects/${item.slugUrl}`}
                  className="link-btn rounded-5 py-2 px-3 text-white home-property-types font-gotham-light fw-bold"
                >
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
                  <h3 className="m-0">
                    <span>{item.numbers}</span>
                  </h3>
                  <p className="text-center ">{item.text}</p>
                </section>
              </div>
            ))}
          </div>
        </div>
        <div className="position-absolute bottom-25 start-50 translate-middle w-100 home-search-container">
          <div className="container bg-light border rounded-4 custom-shadow">
            <form>
              <div className="d-flex flex-wrap flex-md-row flex-column p-4 gap-3 font-gotham-light">
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
                    <option value="">Select Location</option>
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
                  <button
                    type="submit"
                    className="py-1 px-4 text-light m-0 border rounded-3 btn-background"
                    onClick={handleSubmit}
                    aria-label="Search"
                  >
                    <FontAwesomeIcon icon={faSearch} size="lg" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <button
          className="enquiry-sticky-btn btn-background"
          onClick={openFixedForm}
        >
          <span>
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
            <span>{enquiryButtonName}</span>
          </span>
        </button>
      </div>
    </>
  );
}
