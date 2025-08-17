"use client";
import Link from "next/link";
import Slider from "react-slick";
import "./property.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import './styles.css';

// import required modules
import { Navigation } from "swiper/modules";

import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faChartArea,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "next/image";
import NotFound from "../not-found";
import CommonPopUpform from "../(home)/components/common/popupform";
import { LoadingSpinner } from "../(home)/contact-us/page";
import { toast } from "react-toastify";

export default function Property({ projectDetail }) {
  const [isAnswerVisible, setIsAnswerVisible] = useState([false, false]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [validated, setValidated] = useState(false);
  const [validated1, setValidated1] = useState(false);
  //Defining loading state
  const [loading, setLoading] = useState(true);

  //Handling answer div
  const toggleAnswer = (index) => {
    const updatedVisibility = [...isAnswerVisible];
    updatedVisibility[index] = !updatedVisibility[index];
    setIsAnswerVisible(updatedVisibility);
  };

  //Setting for banner slider
  const settings = {
    dots: false,
    infinite: projectDetail.projectDesktopBannerDtoList.length > 1,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: projectDetail.projectDesktopBannerDtoList.length > 1,
    autoplay: projectDetail.projectDesktopBannerDtoList.length > 1,
    autoplaySpeed: 3000,
  };

  //Setting for gallery slider
  const settings1 = {
    dots: false,
    infinite: projectDetail.projectGalleryImageList.length > 1,
    speed: 500,
    autoplay: projectDetail.projectGalleryImageList.length > 1,
    slidesToShow: 2, // Default for large screens
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // Mobile (Medium screens)
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480, // Small mobile screens
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  //Generating price in lakh & cr
  const generatePrice = (price) => {
    if (/[a-zA-Z]/.test(price)) {
      return price;
    }
    return price < 1
      ? "₹ " + Math.round(parseFloat(price) * 100) + " Lakh* Onwards"
      : "₹ " + parseFloat(price) + " Cr* Onwards";
  };
  //Handle form input data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };

  //Handle submit form
  const handleSubmit = async (e, form_position) => {
    e.preventDefault();
    if (form_position === "bottom_form") {
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated1(true);
        return;
      }
      if (form.checkValidity() === true) {
        try {
          setShowLoading(true);
          // Make API request
          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_URL + "enquiry/post",
            formData
          );
          // Check if response is successful
          if (response.data.isSuccess === 1) {
            setFormData({
              name: "",
              email: "",
              phone: "",
              message: "",
            });
            toast.success(response.data.message);
            setValidated(false);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        } finally {
          setShowLoading(false);
        }
      }
    } else {
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      if (form.checkValidity() === true) {
        try {
          setShowLoading(true);
          // Make API request
          const response = await axios.post(
            process.env.NEXT_PUBLIC_API_URL + "enquiry/post",
            formData
          );
          // Check if response is successful
          if (response.data.isSuccess === 1) {
            setFormData({
              email: "",
              name: "",
              phone: "",
              message: "",
            });
            setValidated(false);
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        } finally {
          setShowLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    //Handle header on scrolling page
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //Handle opening and closing of menu bar
  const openMenu = (e, targetId) => {
    e.preventDefault(); // Prevent default anchor behavior
    const menuButtons = document.querySelectorAll(".menuBtn");
    const menu = document.getElementById("mbdiv");
    const header = document.querySelector(".header");

    if (!menu) return;

    // Toggle menu state
    const isMenuOpen = menu.classList.toggle("active");

    // Toggle menu button classes
    menuButtons.forEach((btn) =>
      btn.classList.toggle("closeMenuBtn", isMenuOpen)
    );

    // Toggle display
    menu.style.display = isMenuOpen ? "block" : "none";

    // Toggle header class
    header?.classList.toggle("notfixed", isMenuOpen);

    // Toggle body scroll lock
    document.body.classList.toggle("overflow-hidden", isMenuOpen);

    // Handle scrolling when clicking a menu link
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          50;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close menu after clicking
        menu.classList.remove("active");
        document.body.classList.remove("overflow-hidden");
      }
    }
  };

  //Generating banner src
  // const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${projectDetail.banners[0].desktopImage}`;
  // const imageSrc = `/properties/${projectDetail.slugURL}/${projectDetail.projectThumbnail}`;

  //Checking If project detail is not available then show not found page
  if (!projectDetail) {
    return <NotFound />;
  }

  return (
    <>
      {/* Header for property detail page */}
      <header
        className={`project-detail-header bg-root-color px-4 ${isScrolled ? "fixed-header" : ""
          }`}
      >
        <div className="main-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-center align-items-center">
              <Link href="/">
                <Image
                  width={198}
                  height={50.75}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${projectDetail.projectLogoImage}`}
                  alt="logo"
                  className="img-fluid"
                />
              </Link>
            </div>
            <nav className="navi d-none d-lg-flex">
              <div className="menu">
                <ul className="list-inline d-flex text-decoration-none gap-5 m-0 align-items-center">
                  <li>
                    <Link
                      className="text-decoration-none text-light fs-5 fw-bold"
                      href="#overview"
                    >
                      Overview
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-decoration-none text-light fs-5 fw-bold"
                      href="#amenities"
                    >
                      Amenities
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-decoration-none text-light fs-5 fw-bold"
                      href="#floorplan"
                    >
                      Plans &amp; Price
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-decoration-none text-light fs-5 fw-bold"
                      href="#gallery"
                    >
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-decoration-none text-light fs-5 fw-bold"
                      href="#location"
                    >
                      Location
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
            {/* Defining header for small devices */}
            <div className="mbMenuContainer" id="mbdiv">
              <ul className="mb-list d-block d-md-none d-flex gap-4">
                <li>
                  <Link
                    href="#"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, "home")}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#overview"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, "overview")}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="#amenities"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, "amenities")}
                  >
                    Amenities
                  </Link>
                </li>
                <li>
                  <Link
                    href="#floorplan"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, "floorplan")}
                  >
                    Plans &amp; Price
                  </Link>
                </li>
                <li>
                  <Link
                    href="#gallery"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, "gallery")}
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="#location"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, "location")}
                  >
                    Location
                  </Link>
                </li>
              </ul>
            </div>
            {/* Defining hamburger button */}
            <div className="menuBtn d-flex d-lg-none " onClick={openMenu}>
              <span id="menuLine1"></span>
              <span id="menuLine2"></span>
              <span id="menuLine3"></span>
            </div>
            {/* Logo container */}
            <div className="logo d-none d-lg-block px-4">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="mpf-logo"
                  width={70}
                  height={70}
                  className="img-fluid"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div id="home" className="container-fluid p-0">
        {/* Banner container for property detail page  */}
        <div className="slick-slider-container">
          <Slider {...settings}>
            {projectDetail.projectDesktopBannerDtoList.map((item, index) => {
              const mobileItem = projectDetail.projectMobileBannerDtoList[index]; // pick same index mobile banner
              return (
                <picture className="image-con" key={`${item.id}-${index}`}>
                  {/* Mobile first */}
                  {mobileItem && (
                    <source
                      srcSet={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${mobileItem.slugURL}/${mobileItem.mobileImage}`}
                      media="(max-width: 640px)" // mobile breakpoint
                    />
                  )}

                  {/* Tablet/Laptop (falls back to desktopImage) */}
                  <source
                    srcSet={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.desktopImage}`}
                    media="(min-width: 641px)" // tablet/laptop/desktop
                  />

                  {/* Default fallback */}
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${item.slugURL}/${item.desktopImage}`}
                    alt={item.altTag || "Property Banner"}
                    className="img-fluid h-100"
                    width={1920}
                    height={600}
                  />
                </picture>
              );
            })}
          </Slider>

          {/* Defining form on banner container  */}
          <div className="banner-form d-none d-lg-block">
            <Form
              noValidate
              validated={validated}
              onSubmit={(e) => handleSubmit(e, "top_form")}
            >
              <Form.Group className="mb-3" controlId="full_name">
                <Form.Control
                  type="text"
                  placeholder="Full name"
                  value={formData.name || ""}
                  onChange={(e) => handleChange(e)}
                  name="name"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="email_id">
                <Form.Control
                  type="email"
                  placeholder="Email id"
                  value={formData.email || ""}
                  onChange={(e) => handleChange(e)}
                  name="email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="phone_number">
                <Form.Control
                  type="number"
                  placeholder="Phone Number"
                  value={formData.phone || ""}
                  onChange={(e) => handleChange(e)}
                  name="phone"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid phone number.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="message">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Message"
                  value={formData.message || ""}
                  onChange={(e) => handleChange(e)}
                  name="message"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid message.
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                className="btn btn-background border-0"
                type="submit"
                disabled={showLoading}
              >
                Submit <LoadingSpinner show={showLoading} />
              </Button>
            </Form>
          </div>
        </div>

        <div className="container py-5 bg-white rounded-3 mt-3 mb-3">
          <div className="row gy-5 align-items-stretch">
            {/* Project Info */}
            <div className="col-lg-4">
              <div className="p-4 p-lg-5 rounded-4 bg-white h-100 d-flex flex-column justify-content-center align-items-center custom-shadow">
                <div>
                  <h1 className="mb-3 text-dark">
                    {projectDetail.projectName}
                  </h1>

                  <p className="fs-5 mb-3 text-muted d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-success me-2 fs-5"
                    />
                    <span>{projectDetail.projectAddress}</span>
                  </p>

                  <p className="fs-5 text-dark mb-2">
                    <strong>
                      Price: {generatePrice(projectDetail.projectPrice)}
                    </strong>
                  </p>

                  <p className="fs-6 text-muted mb-2">
                    {projectDetail.projectConfiguration}
                  </p>

                  <p className="fs-6 text-muted">
                    <strong className="text-dark">RERA:</strong>{" "}
                    {projectDetail.reraNo || "Not found"}
                  </p>
                </div>
                <button
                  className="btn btn-success border-0 btn-background text-white w-100 p-2"
                  onClick={() => setShowPopUp(true)}
                >
                  <h5 className="m-0">Get Detail</h5>
                </button>
              </div>
            </div>
            {/* Walkthrough Description */}
            <div className="col-lg-8">
              <div className="bg-white p-4 p-md-5 rounded-4 custom-shadow h-100">
                <h2 className="text-dark mb-4 text-center text-md-start">
                  Walkthrough
                </h2>

                <div
                  className="text-muted fs-6 lh-lg"
                  dangerouslySetInnerHTML={{
                    __html: projectDetail.projectWalkthroughDescription,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities section */}
        <div
          className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3"
          id="amenities"
        >
          {/* Title */}
          <h2 className="text-center mb-3">Amenities</h2>

          {/* Description */}
          <div
            className="text-center text-muted mb-5 px-2 px-md-5"
            dangerouslySetInnerHTML={{ __html: projectDetail.amenityDescription }}
          ></div>

          {/* Amenities Grid */}
          <div className="row justify-content-center g-3">
            {projectDetail.projectAmenityList.map((item, index) => (
              <div key={index} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <div className="border rounded-4 bg-light h-100 d-flex align-items-center justify-content-around text-center custom-shadow amenity-box p-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}amenity/${item.image}`}
                    height={20}
                    width={20}
                    alt={item.altTag || ""}
                    unoptimized
                  />
                  <p className="m-0 fw-semibold text-dark fs-6">{item.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="mt-5 text-center">
            <button
              className="btn btn-background px-4 py-2 rounded-pill text-white"
              onClick={() => setShowPopUp(true)}
            >
              VIEW ALL
            </button>
          </div>
        </div>

        {/* Floor plans section */}
        <div
          className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3"
          id="floorplan"
        >
          <div className="p-2 p-md-4 p-lg-5">
            <h2 className="text-center">Floor Plans</h2>
            {projectDetail.floorPlanDescription && (
              <div
                dangerouslySetInnerHTML={{
                  __html: projectDetail.floorPlanDescription,
                }}
              ></div>
            )}
          </div>
          {/* <div className="d-flex justify-content-center p-2 d-flex flex-column flex-md-row gap-md-3 flex-wrap flex-lg-nowrap"> */}
          <Swiper
            direction="horizontal"
            navigation={true}
            pagination={{ clickable: true }}
            spaceBetween={20}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              576: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            modules={[Navigation]}
            className="mySwiper"
          >
            {projectDetail.projectFloorPlanList?.map((item, index) => (
              <SwiperSlide key={`${item.planType}-${index}`}>
                <div className="card mt-3 custom-shadow">
                  <div className="p-3 rounded-sm">
                    <Image
                      width={300}
                      height={200}
                      className="img-fluid rounded-3"
                      src="/static/generic-floorplan.jpg"
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
                    <p>{item.areaSqFt} sqft*</p>
                    <p>{parseFloat(item.areaSqMt).toFixed(2)} sqmt*</p>
                  </div>
                  <div className="pb-4 ps-2 mt-4">
                    <button
                      className="btn btn-background text-white"
                      onClick={() => setShowPopUp(true)}
                    >
                      PRICE ON REQUEST
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* </div> */}
        </div>

        {/* Gallery section */}
        <div
          className="container shadow-lg rounded-4 mt-3 py-5 mb-3"
          id="gallery"
        >
          <h2 className="text-center">Gallery</h2>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12">
                <Slider {...settings1} className="gallery-slider">
                  {projectDetail.projectGalleryImageList.map((item, index) => (
                    <div
                      key={`${index}-${item.id}`}
                      className="project-detail-gallery-container "
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${item.galleyImage}`}
                        alt="gallery_image"
                        fill
                        unoptimized
                        className="img-fluid rounded-5 object-fit-cover px-2 "
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
        {/* Location section */}
        <div
          className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3"
          id="location"
        >
          <div>
            <h2 className="text-center">Location</h2>
          </div>
          <div className="text-center p-2 p-md-4 p-lg-5">
            <div
              dangerouslySetInnerHTML={{ __html: projectDetail.locationDescription }}
            ></div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {/* Nearby Benefits Section */}
              <div className="row g-3">
                {projectDetail.projectLocationBenefitList.map((item, index) => (
                  <div key={index} className="col-6">
                    <div className="border rounded-4 p-3 h-100 d-flex align-items-center gap-3 bg-light shadow-sm">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${item.image}`}
                        alt={item.benefitName || ""}
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="mb-1 fw-semibold text-dark">
                          {item.benefitName}
                        </p>
                        <small className="text-muted">{item.distance}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Address Section */}
              <div className="border rounded-4 shadow-sm bg-white mt-4 p-4">
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <p className="mb-1 text-success fw-semibold">Address</p>
                    <p className="mb-0">{projectDetail.projectAddress}</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="mb-1 text-success fw-semibold">State</p>
                    <p className="mb-0">{projectDetail.stateName}</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="mb-1 text-success fw-semibold">City</p>
                    <p className="mb-0">{projectDetail.cityName}</p>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <p className="mb-1 text-success fw-semibold">Country</p>
                    <p className="mb-0">{projectDetail.countryName}</p>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <button
                    className="btn btn-background text-white px-4 py-2 rounded-pill"
                    onClick={() => setShowPopUp(true)}
                  >
                    View On Map
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 p-3">
              <div
                className="position-relative border rounded-4 overflow-hidden shadow-sm"
                style={{ height: "350px" }}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${projectDetail.locationMapImage}`}
                  alt="Project Location Map"
                  fill
                  unoptimized
                  className="object-fit-cover"
                />

                {/* Overlay text */}
                <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-dark bg-opacity-50 text-white text-center">
                  <small className="fw-semibold">Project Location</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About the project */}
      <div
        className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3"
        id="overview"
      >
        {/* Section Heading */}
        <h2 className="text-center mb-4">About The Project</h2>

        {/* Description */}
        <div className="mx-auto" style={{ maxWidth: "800px" }}>
          <div
            className="text-center text-muted fs-6"
            dangerouslySetInnerHTML={{ __html: projectDetail.projectAboutShortDescription }}
          ></div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-4">
          <button
            className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
            onClick={() => setShowPopUp(true)}
          >
            READ MORE
          </button>
          <button
            className="btn btn-outline-success px-4 py-2 rounded-pill shadow-sm"
            onClick={() => setShowPopUp(true)}
          >
            DOWNLOAD BROCHURE
          </button>
          <button
            className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
            onClick={() => setShowPopUp(true)}
          >
            SCHEDULE A SITE VISIT
          </button>
        </div>
      </div>

      {/* Contact us section */}
      <div className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3">
        <div>
          <h2 className="text-center">Get in Touch</h2>
          <div className="d-flex justify-content-center">
            <div className="w-100 w-md-50 w-lg-50 text-center">
              <p>
                If you would like to know more details or something specific,
                feel free to contact us. Our site representative will give you a
                call back.
              </p>
            </div>
          </div>
          <div>
            <div className="container d-flex justify-content-center">
              <Form
                noValidate
                validated={validated1}
                className="w-100 border rounded-3 p-3"
                onSubmit={(e) => handleSubmit(e, "bottom_form")}
              >
                <Form.Group className="mb-3" controlId="full_name">
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    value={formData.name || ""}
                    onChange={(e) => handleChange(e)}
                    name="name"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid name.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email_id">
                  <Form.Control
                    type="email"
                    placeholder="Email id"
                    value={formData.email || ""}
                    onChange={(e) => handleChange(e)}
                    name="email"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="phone_number">
                  <Form.Control
                    type="number"
                    placeholder="Phone Number"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange(e)}
                    name="phone"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid phone number.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="message">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Message"
                    value={formData.message || ""}
                    onChange={(e) => handleChange(e)}
                    name="message"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid message.
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  className="btn btn-background text-white border-0"
                  type="submit"
                  disabled={showLoading}
                >
                  Submit <LoadingSpinner show={showLoading} />
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3">
        <h2 className="text-center pt-5">FAQs</h2>
        <div className="container mt-3">
          {projectDetail.projectFaqList.map((item, index) => (
            <div key={`${item.id}-${index}`}>
              <div
                className="container questions mt-3 d-flex"
                id="question1"
                onClick={() => toggleAnswer(item.id)}
              >
                <h4 className="m-0">Q {index + 1}: </h4>
                <h4 className="ps-2 m-0">{item.question}</h4>
                <span className="plus-icon">
                  {isAnswerVisible[item.id] ? "-" : "+"}
                </span>
              </div>
              <div
                className={`container questions ${isAnswerVisible[item.id] ? "" : "d-none"
                  } bg-light`}
                id="answer1"
              >
                <div className="m-0 text-success">
                  <h4>Ans: </h4>
                </div>
                <p className="ps-2 text-success">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CommonPopUpform show={showPopUp} handleClose={setShowPopUp} />
    </>
  );
}
