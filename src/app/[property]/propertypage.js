"use client";
import Link from "next/link";
import Slider from "react-slick";
import "./property.css";
import "@/app/components/header/header.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/footer/page";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faChartArea, faPlus } from "@fortawesome/free-solid-svg-icons";
import Featured from "../components/home/featured/page";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function Property({ slug }) {
  const [amenities, setAmenities] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  const [isAnswerVisible, setIsAnswerVisible] = useState([false, false]);
  const [floorPlanList, setFloorPlanList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [faqs, setFaqs] = useState([]);
  var [count, setCount] = useState(1);
  const toggleAnswer = (index) => {
    const updatedVisibility = [...isAnswerVisible];
    updatedVisibility[index] = !updatedVisibility[index];
    setIsAnswerVisible(updatedVisibility);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };
  const settings1 = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "0px",
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
  };
  const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${projectDetail.projectThumbnail}`;
  const fetchGallery = async () => {
    const data = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `project-gallery/get/${slug}`
    );
    setGalleryList(data.data);
  };
  const fetchFaqs = async () => {
    const data = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + `project-faqs/get/${slug}`
    );
    setFaqs(data.data);
  };
  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const data = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `properties/${slug}`
        );
        setProjectDetail(data.data);
      } catch (error) {}
    };
    const fetchFloorPlans = async () => {
      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `floor-plans/get/${slug}`
        );
        console.log(response);
        setFloorPlanList(response.data);
      } catch (error) {}
    };
    const fetchData = async () => {
      try {
        const allFeaturedProperties = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + "amenity/get-all"
        );
        setAmenities(allFeaturedProperties.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    const fetchBenifits = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}location-benefit/get/${slug}`
        );
        setBenefitList(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
    fetchProjectDetail();
    fetchFloorPlans();
    fetchGallery();
    fetchFaqs();
    fetchBenifits();
  }, []);
  return (
    <>
      <header className="header bg-light">
        <div className="main-header">
          <div className="container-lg d-flex justify-content-between position-relative align-items-center">
            <div className="logo mt-3">
              <Link href="/">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.projectURL}/${projectDetail.projectLogo}`}
                  alt="logo"
                />
              </Link>
            </div>
            <nav className="navi d-none d-md-flex">
              <div className="menu">
                <ul className="list-inline">
                  <li>
                    <Link href="#overview">Overview</Link>
                  </li>
                  <li>
                    <Link href="#amenities">Amenities</Link>
                  </li>
                  <li>
                    <Link href="#floorplan">Plans &amp; Price</Link>
                  </li>
                  <li>
                    <Link href="#gallery">Gallery</Link>
                  </li>
                  <li>
                    <Link href="#location">Location</Link>
                  </li>
                </ul>
              </div>
            </nav>
            <div className="menuBtn d-flex d-lg-none ">
              <span id="menuLine1"></span>
              <span id="menuLine2"></span>
              <span id="menuLine3"></span>
            </div>
            <div className="logo">
              <Link className="mt-2 text-dark" href="/">
                <img src="/logo.png" alt="logo" style={{ width: "60px" }} />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="container-fluid mt-5 p-0">
        <div className="slick-slider-container banner-container">
          <Slider {...settings}>
            <div>
              <img className="slider-image" src={imageSrc} alt="Slide 1" />
            </div>
          </Slider>
          <div className="banner-form">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="text" placeholder="Name*" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter email*" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control type="text" placeholder="Phone Number*" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
          <div className="short-info">
            <p>{projectDetail.projectName}</p>
          </div>
        </div>
        <div>
          <h1 className="text-center mt-3">About The Project</h1>
          <div className="p-3">
            <p className="text-center">{projectDetail.aboutDesc}</p>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button className="mx-3 bg-dark text-light">READ MORE</button>
          <button className="mx-3 bg-dark text-light">DOWNLOAD BROCHURE</button>
          <button className="mx-3 bg-dark text-light">
            SCHEDULE A SITE VISIT
          </button>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <div className="walkthrough-container">
            <div className="text-center">
              <p className="h1 text-light mt-5">Walkthrough</p>
            </div>
            <div className="text-center p-5">
              <p>{projectDetail.walkthroughDesc}</p>
            </div>
            <div className="text-center">
              <button className="bg-light">View</button>
            </div>
          </div>
        </div>
        <div className="container-fluid bg-dark p-5 mt-5" id="amenities">
          <p className="h1 text-center text-light">Amenities</p>
          <div>
            <p className="text-center text-light">
              {projectDetail.amenityDesc}
            </p>
          </div>
          <div className="row">
            <div className="d-flex flex-wrap justify-content-center">
              {amenities.map((item) => (
                <div key={item.id} className="card mx-3 p-5 mt-3">
                  <img
                    src={process.env.NEXT_PUBLIC_IMAGE_URL+"amenity/" + item.amenityImageUrl}
                    alt={item.altTag}
                    style={{ width: "100px" }}
                  />
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <button className="btn btn-primary">VIEW ALL</button>
            </div>
          </div>
        </div>
        <div className="container-fluid" id="floorplan">
          <div className="p-5">
            <p className="h1 text-center">Floor Plans</p>
            <p className="text-center">{projectDetail.floorPlanDesc}</p>
          </div>
          <div className="d-flex justify-content-center p-2">
            {floorPlanList.map((item) => (
              <div key={count++} className="card mx-2" style={{ width: "30%" }}>
                <div className=" p-3 rounded-sm">
                  <img
                    style={{ width: "100%" }}
                    src="https://www.starestate.com/assets/images/generic-floorplan.jpg"
                    alt="floor plan"
                  />
                </div>
                <div className="border-bottom property-type-detail">
                  <p>
                    <FontAwesomeIcon icon={faBed} width={20} color="green" />{" "}
                    Type
                  </p>
                  <p>{item.planType}</p>
                </div>
                <div className="mt-2 property-type-detail">
                  <p>
                    <FontAwesomeIcon
                      icon={faChartArea}
                      width={20}
                      color="green"
                    />{" "}
                    Area
                  </p>
                  <p>{item.areaSqft} sqft*</p>
                  <p>{item.areaSqmt} sqmt*</p>
                </div>
                <div className="pb-4 ps-2 mt-4">
                  <button className="btn btn-success">PRICE ON REQUEST</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="container-fluid bg-dark p-5 mt-5" id="gallery">
          <p className="text-center h1 text-light">Gallery</p>
          <div>
            <Slider {...settings1}>
              {galleryList.map((item) => (
                <div key={item.id}>
                  <img
                    style={{ height: "400px" }}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.projectName}/${item.image}`}
                    alt="floor plan"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="container-fluid mt-5">
          <div>
            <p className="h1 text-center">Location</p>
          </div>
          <div className="text-center p-5">
            <p>{projectDetail.locationDesc}</p>
          </div>
          <div className="row p-2">
            <div className="col-md-6">
              <div className="row d-flex flex-wrap justify-content-between">
                {benefitList.map((item) => (
                  <div key={item.id} className="col-6">
                    <div className="d-flex location-benifits mx-1 mt-2">
                      <img
                        style={{ width: "40px" }}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}icon/${item.iconImage}`}
                        alt={item.iconImage}
                      />
                      <p className="h6 text-center">{item.benefitName}</p>
                      <div className="distance-value">{item.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row border mt-3 p-3 d-flex justify-content-center">
                <div className="col-md-6">
                  <div className="d-flex">
                    <p className="text-success">Address: </p>
                    <p>{projectDetail.projectLocality}</p>
                  </div>
                  <div className="d-flex">
                    <p className="text-success">State: </p>
                    <p>{projectDetail.state}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex">
                    <p className="text-success">City: </p>
                    <p>{projectDetail.cityLocation}</p>
                  </div>
                  <div className="d-flex">
                    <p className="text-success">Country: </p>
                    <p>{projectDetail.country}</p>
                  </div>
                </div>
                <div className="d-flex">
                  <button className="btn btn-success">View On Map</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 p-3">
              <Link href="#formModal" data-bs-toggle="modal">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.projectName}/${projectDetail.locationMap}`}
                  className="h-100 object-cover"
                  alt="Location Map"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container-fluid mt-3 p-5"
        style={{ background: "#f2f2f2" }}
      >
        <div>
          <p className="h1 text-center">Get in Touch</p>
          <div className="d-flex justify-content-center">
            <div className="w-50 text-center">
              <p>
                If you would like to know more details or something specific,
                feel free to contact us. Our site representative will give you a
                call back.
              </p>
            </div>
          </div>
          <div>
            <div className="touchFormWrapper">
              <form>
                <div className="row ">
                  <div className="col-md-4 form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name*"
                      name="Name"
                      required=""
                      defaultValue=""
                    />
                  </div>
                  <div className="col-md-4 form-group">
                    <div className="phone-container react-tel-input ">
                      <input
                        className="form-control"
                        placeholder="1 (702) 123-4567"
                        type="tel"
                        defaultValue="+91"
                      />
                      <div className="flag-dropdown phone-button">
                        <div
                          className="selected-flag"
                          title="India: + 91"
                          tabIndex="0"
                          role="button"
                          aria-haspopup="listbox"
                        >
                          <div className="flag in">
                            <div className="arrow"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 form-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address*"
                      name="Email"
                      required=""
                      defaultValue=""
                    />
                  </div>
                  <div className="col-12 form-group">
                    <div className="form-check mx-auto d-table ">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="agree_bottom"
                      />
                      <label
                        className="form-check-label m-2 mt-2"
                        htmlFor="agree_bottom"
                      >
                        {" "}
                        I accept the Terms &amp; Conditions.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="readmore d-flex justify-content-center">
                  <button className="btn btn-success" type="submit" disabled="">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className="container-fluid mt-1 pb-5"
        style={{ background: "#f2f2f2" }}
      >
        <p className="h1 text-center pt-5">FAQs</p>
        <div className="container mt-3">
          {faqs.map((item) => (
            <div key={item.id}>
              <div
                className="container questions mt-3 d-flex"
                id="question1"
                onClick={() => toggleAnswer(item.id)}
              >
                <p>Q 1: </p> {item.faqQuestion}
                <span className="plus-icon">+</span>
              </div>
              <div
                className={`container questions ${
                  isAnswerVisible[item.id] ? "" : "d-none"
                } bg-light`}
                id="answer1"
              >
                <p>Ans: </p>
                {item.faqAnswer}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container-fluid">
        <p className="h1 text-center pt-3">Featured projects</p>
        <Featured />
      </div>
      <div
        className="container-fluid d-flex justify-content-center"
        style={{ background: "#68ac78" }}
      >
        <div>
          <img src="/logo.png" alt="logo" style={{ width: "200px" }} />
        </div>
        <div></div>
      </div>
      <Footer />
    </>
  );
}
