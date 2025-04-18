"use client";
import Link from "next/link";
import Slider from "react-slick";
import "./property.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import './styles.css';

// import required modules
import { Navigation } from 'swiper/modules';

import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faChartArea,
  faLocation,
  faLocationDot,
  faMarker,
} from "@fortawesome/free-solid-svg-icons";
import Featured from "../(home)/components/home/featured/page";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "next/image";
import Footer from "../(home)/components/footer/page";
import { Spinner } from "react-bootstrap";
import NotFound from "../not-found";
import CommonPopUpform from "../(home)/components/common/popupform";
import { LoadingSpinner } from "../(home)/contact-us/page";
import { toast, ToastContainer } from "react-toastify";

export default function Property({ slug }) {
  const [amenities, setAmenities] = useState([]);
  const [projectDetail, setProjectDetail] = useState([]);
  const [isAnswerVisible, setIsAnswerVisible] = useState([false, false]);
  const [floorPlanList, setFloorPlanList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [benefitList, setBenefitList] = useState([]);
  const [aboutData, setAboutData] = useState([]);
  const [walkthrough, setWalkthrough] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
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
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };

  //Setting for gallery slider
  const settings1 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Default for large screens
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
    // Check if price contains any alphabetic character
    if (/[a-zA-Z]/.test(price)) {
      return price; // Return the original string if it contains letters
    }

    // Convert price to a number
    const numericPrice = parseFloat(price);

    // Check if conversion is successful
    if (isNaN(numericPrice)) {
      return price; // Return original string if it's not a valid number
    }

    // Format price
    return numericPrice > 1
      ? numericPrice + " Cr"
      : (numericPrice * 100) + " Lakh";
  };
  //Handle form input data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value
    }));
  }

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
              message: ""
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
              message: ""
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
  }

  useEffect(() => {
    // calling all apis for getting data for page
    const fetchAllData = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL;

        // Creating an array of API promises
        const apiCalls = [
          axios.get(`${apiBase}projects/get/${slug}`),
          axios.get(`${apiBase}floor-plans/get/${slug}`),
          axios.get(`${apiBase}project-amenity/get/${slug}`),
          axios.get(`${apiBase}location-benefit/get/${slug}`),
          axios.get(`${apiBase}project-gallery/get/${slug}`),
          axios.get(`${apiBase}project-walkthrough/get/${slug}`),
          axios.get(`${apiBase}project-faqs/get/${slug}`),
          axios.get(`${apiBase}project-about/get/${slug}`),
          axios.get(`${apiBase}project-banner/get/${slug}`),
        ];

        // Await all API responses
        const [
          projectRes,
          floorPlansRes,
          amenitiesRes,
          benefitsRes,
          galleryRes,
          walkthroughRes,
          faqsRes,
          aboutRes,
          bannerRes,
        ] = await Promise.all(apiCalls);

        // Set state after fetching all data
        setProjectDetail(projectRes.data);
        setFloorPlanList(floorPlansRes.data);
        setAmenities(amenitiesRes.data);
        setBenefitList(benefitsRes.data);
        setGalleryList(galleryRes.data);
        setWalkthrough(walkthroughRes.data);
        setFaqs(faqsRes.data);
        setAboutData(aboutRes.data);
        setBannerData(bannerRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
          targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 50;

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


  //If loading state show loading 
  if (loading) {
    return (
      <div className="project-loader">
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="secondary" />
        <Spinner animation="grow" variant="success" />
        <Spinner animation="grow" variant="danger" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="info" />
        {/* <Spinner animation="grow" variant="light" /> */}
        <Spinner animation="grow" variant="dark" />
      </div>
    );
  }

  //Generating banner src
  const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${bannerData.slugURL}/${bannerData.desktopBanner}`;
  // const imageSrc = `/properties/${projectDetail.slugURL}/${projectDetail.projectThumbnail}`;

  //Checking If project detail is not available then show not found page
  if (!projectDetail) {
    return <NotFound />
  }

  return (
    <>
      {/* Header for property detail page */}
      <header className={`ps-3 pe-3 bg-root-color header ${isScrolled ? "fixed-header" : ""}`}>
        <div className="main-header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-center align-items-center">
              <Link href="/">
                <Image
                  width={180}
                  height={50}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${projectDetail.projectLogo}`}
                  alt="logo"
                  unoptimized
                />
              </Link>
            </div>
            <nav className="navi d-none d-lg-flex">
              <div className="menu">
                <ul className="list-inline d-flex text-decoration-none gap-5 m-0 align-items-center">
                  <li>
                    <Link
                      className="text-decoration-none text-light fs-5 fw-bold"
                      href="#"
                    >
                      Home
                    </Link>
                  </li>
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
                    onClick={(e) => openMenu(e, 'home')}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#overview"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, 'overview')}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="#amenities"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, 'amenities')}
                  >
                    Amenities
                  </Link>
                </li>
                <li>
                  <Link
                    href="#floorplan"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, 'floorplan')}
                  >
                    Plans &amp; Price
                  </Link>
                </li>
                <li>
                  <Link
                    href="#gallery"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, 'gallery')}
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="#location"
                    className="text-decoration-none text-light fs-5 fw-bold"
                    onClick={(e) => openMenu(e, 'location')}
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
            <div className="logo d-none d-lg-block">
              <Link href="/">
                <Image src="/logo.png" alt="mpf-logo" width={60} height={60} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div id="home" className="container-fluid p-0">
        {/* Banner container for property detail page  */}
        <div className="slick-slider-container banner-container">
          <Slider {...settings}>
            <picture className="project-detail-banner">
              <source
                srcSet={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${bannerData.slugURL}/${bannerData.mobileBanner}`}
                media="(max-width: 640px)"
              />
              <source srcSet={imageSrc} media="(max-width: 1024px)" />
              <Image
                src={imageSrc}
                alt="banner-image"
                className="img-fluid shadow-sm mb-4"
                width={1800}
                height={700}
                unoptimized
              />
            </picture>
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
              <Button className="btn btn-success" type="submit" disabled={showLoading}>
                Submit <LoadingSpinner show={showLoading} />
              </Button>
            </Form>
          </div>
          {/* Short info section */}
          <div className="short-info d-none d-md-flex justify-content-center ">
            <div>
              <p className="project-name fs-2 fw-bold m-0 text-white">{projectDetail.projectName}</p>
              <p className="project-address fs-5 font-bold text-white m-0">
                <FontAwesomeIcon icon={faLocationDot} className="text-success me-2" size="sm" />
                {projectDetail.projectAddress}
              </p>
              <p className="fs-6 text-white">
                {generatePrice(projectDetail.projectPrice)}* |{" "}
                {projectDetail.projectConfiguration}
              </p>
              <div className="btn btn-success mt-3 w-100" onClick={() => setShowPopUp(true)}>
                Get Details
              </div>
            </div>
          </div>
        </div>
        {/* About the project */}
        <div className="container" id="overview">
          <h1 className="text-center mt-3 fw-bold">About The Project</h1>
          <div className="p-3">
            <p
              className="text-center"
              dangerouslySetInnerHTML={{ __html: aboutData.shortDesc }}
            ></p>
          </div>

          {/* About buttons section */}
          <div className="d-flex flex-column flex-md-row justify-content-center gap-2 gap-md-5">
            <button className="btn btn-success" onClick={() => setShowPopUp(true)}>READ MORE</button>
            <button className="btn btn-success" onClick={() => setShowPopUp(true)}>DOWNLOAD BROCHURE</button>
            <button className="btn btn-success" onClick={() => setShowPopUp(true)}>SCHEDULE A SITE VISIT</button>
          </div>
        </div>
        {/* walkthrough section */}
        <div className="d-flex justify-content-center mt-5">
          <div className="walkthrough-container">
            <div className="text-center">
              <p className="h1 fw-bold text-light mt-5">Walkthrough</p>
            </div>
            <div className="text-center p-3 p-lg-5">
              <p
                dangerouslySetInnerHTML={{
                  __html: walkthrough.walkthroughDesc,
                }}
              ></p>
            </div>
            <div className="text-center">
              <button className="btn btn-success mb-5" onClick={() => setShowPopUp(true)}>View</button>
            </div>
          </div>
        </div>

        {/* Amenities section */}
        <div
          className="container-fluid bg-dark p-3 p-md-4 p-lg-5 mt-5"
          id="amenities"
        >
          <div className="container">
            <p className="h1 fw-bold text-center text-light">Amenities</p>
            <p
              className="text-center text-light"
              dangerouslySetInnerHTML={{ __html: projectDetail.amenityDesc }}
            ></p>
            <div className="container">
              <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                {amenities.map((item) => (
                  <div key={item.id} className="amenity-card">
                    <div className="d-flex bg-light gap-4 p-2 border rounded-2  align-items-center">
                      <Image
                        src={
                          "/amenity/" +
                          item.amenityImageUrl
                        }
                        height={30}
                        width={30}
                        alt={item.altTag}
                      />
                      <p className="m-0 fw-bold">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center">
                <button className="btn btn-success" onClick={() => setShowPopUp(true)}>VIEW ALL</button>
              </div>
            </div>
          </div>
        </div>

        {/* Floor plans section */}
        <div className="container mt-3" id="floorplan">
          <div className="p-2 p-md-4 p-lg-5">
            <p className="h1 text-center fw-bold">Floor Plans</p>
            <p
              className="text-center"
              dangerouslySetInnerHTML={{ __html: projectDetail.floorPlanDesc }}
            ></p>
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
            {floorPlanList?.map((item, index) => (
              <SwiperSlide key={`${item.planType}-${index}`}>
                <div className="card mt-3">
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
                      <FontAwesomeIcon icon={faBed} width={20} color="green" /> Type
                    </p>
                    <p>{item.planType}</p>
                  </div>
                  <div className="mt-2 property-type-detail">
                    <p>
                      <FontAwesomeIcon icon={faChartArea} width={20} color="green" /> Area
                    </p>
                    <p>{item.areaSqft} sqft*</p>
                    <p>{parseFloat(item.areaSqmt).toFixed(2)} sqmt*</p>
                  </div>
                  <div className="pb-4 ps-2 mt-4">
                    <button className="btn btn-success" onClick={() => setShowPopUp(true)}>
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
          className="container-fluid bg-dark p-2 p-md-4 p-lg-5 mt-5 gallery-container"
          id="gallery"
        >
          <p className="text-center h1 text-light fw-bold">Gallery</p>
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12">
                <Slider {...settings1} className="gallery-slider">
                  {galleryList.map((item) => (
                    <div key={item.id} className="project-detail-gallery-container">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${item.image}`}
                        alt="floor plan"
                        fill
                        unoptimized
                        className="gallery-image"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
        {/* Location section */}
        <div className="container-fluid mt-5" id="location">
          <div>
            <p className="h1 text-center fw-bold">Location</p>
          </div>
          <div className="text-center p-2 p-md-4 p-lg-5">
            <p
              dangerouslySetInnerHTML={{ __html: projectDetail.locationDesc }}
            ></p>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="row d-flex justify-content-between">
                {benefitList.map((item) => (
                  <div key={item.id} className="col-md-6">
                    <div className="d-flex location-benifits mx-1 mt-2 px-2">
                      <Image
                        src={`/icon/${item.iconImage}`}
                        alt={item.iconImage}
                        width={40}
                        height={40}
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
                    <p>India</p>
                  </div>
                </div>
                <div className="d-flex">
                  <button className="btn btn-success" onClick={() => setShowPopUp(true)}>View On Map</button>
                </div>
              </div>
            </div>
            <div className="col-md-6 p-3 position-relative">
              {/* <Link href="#formModal" data-bs-toggle="modal"> */}
              <div className="project-detail-location-image-container">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectDetail.slugURL}/${projectDetail.locationMap}`}
                  alt="location-image"
                  fill
                  unoptimized
                />
              </div>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Contact us section */}
      <div className="container-fluid mt-3 p-2 p-md-3 p-lg-5">
        <div>
          <p className="h1 text-center fw-bold">Get in Touch</p>
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
                className="w-50 border rounded-3 p-3"
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
                <Button className="btn btn-success" type="submit" disabled={showLoading}>Submit <LoadingSpinner show={showLoading} /></Button>
              </Form>
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
          {faqs.map((item, index) => (
            <div key={`${item.id}-${index}`}>
              <div
                className="container questions mt-3 d-flex"
                id="question1"
                onClick={() => toggleAnswer(item.id)}
              >
                <p>Q {index + 1}: </p> {item.faqQuestion}
                <span className="plus-icon">+</span>
              </div>
              <div
                className={`container questions ${isAnswerVisible[item.id] ? "" : "d-none"
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
      <div className="container-fluid mb-4">
        <Featured />
      </div>
      <div className="container-fluid" style={{ background: "#68ac78" }}>
        <div className="d-flex justify-content-center">
          <Image width={100} height={100} src="/logo.png" alt="mpf-logo" />
        </div>
      </div>
      <Footer />
      <CommonPopUpform show={showPopUp} handleClose={setShowPopUp} />
      <ToastContainer />
    </>
  );
}