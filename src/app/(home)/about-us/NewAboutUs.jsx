"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import "./aboutus.css";
import WhyMyPropertyFact from "./WhyMyPropertyFact";

const slidesData = [
  {
    id: 1,
    title: "DIVERSE PROPERTY LISTINGS",
    text: "We curate listings from all corners of the real estate spectrum. Residential apartments, commercial showrooms, industrial plots, farmhouses, and everything in between.",
  },
  {
    id: 2,
    title: "ADVANCED SEARCH FILTERS",
    text: "Find exactly what you're looking for with our comprehensive search filters. Filter by price, location, property type, size, amenities, and more to narrow down your perfect match.",
  },
  {
    id: 3,
    title: "TRANSPARENT DATA & INSIGHTS",
    text: "Access detailed property information, market trends, pricing history, and neighborhood insights. Make informed decisions with data-driven transparency at every step.",
  },
  {
    id: 4,
    title: "EXPERT CONSULTATION SERVICES",
    text: "Connect with our team of real estate experts who can guide you through every stage of your property journey, from initial search to final closing.",
  },
  {
    id: 5,
    title: "VIRTUAL TOURS & MEDIA",
    text: "Explore properties from anywhere with our high-quality photos, virtual tours, 360-degree views, and detailed floor plans. Get a complete picture before visiting in person.",
  },
  {
    id: 6,
    title: "SECURE TRANSACTION PLATFORM",
    text: "Enjoy a safe and secure platform for all your real estate transactions. Our verified listings and secure payment processing ensure your peace of mind throughout the process.",
  },
];

export default function NewAboutUs() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [windowWidth, setWindowWidth] = useState(0);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width <= 480) {
        setCardsPerView(1);
      } else if (width <= 768) {
        setCardsPerView(1);
      } else if (width <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate total slides based on responsive cardsPerView
  const totalSlides = Math.max(
    1,
    Math.ceil((slidesData.length - cardsPerView) / cardsPerView) + 1
  );

  // Reset slide when cardsPerView changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [cardsPerView]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } 
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.7, delay: 0.2, ease: "easeOut" } 
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.6, delay: 0.3, ease: "easeOut" } 
    },
  };

  const bounceIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.4,
      },
    },
  };

  const cardStagger = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const textFadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, delay: 0.3 } 
    },
  };

  const headingFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, delay: 0.2 } 
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = totalSlides - 1;
      return prev < maxSlide ? prev + 1 : prev;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      return prev > 0 ? prev - 1 : prev;
    });
  };

  const isPrevDisabled = currentSlide === 0;
  const isNextDisabled = currentSlide >= totalSlides - 1;
  return (
    <>
      <div className="container-fluid">
        <motion.div
          className="new-about-us-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div
            className="new-about-us-container-image-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            <Image
              src="/static/about-us/about_section.png"
              alt="About Us"
              width={441}
              height={515}
              className="img-fluid"
            />
          </motion.div>
          <motion.div
            className="new-about-us-container-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <motion.h2 
              className="new-about-us-container-content-heading plus-jakarta-sans-bold"
              variants={headingFadeIn}
            >
              About Us
            </motion.h2>
            <motion.p 
              className="new-about-us-container-content-text1"
              variants={textFadeIn}
            >
              Welcome to My Property Fact, your go-to platform for discovering
              the perfect real estate opportunities. Whether you're an investor
              hunting for the next big project, a business owner scouting
              commercial space, or a family looking for a new home to call your
              own. We bring together all types of properties, from high-end
              apartments and cozy farmhouses to strategic commercial plots and
              premium office spaces for both buying and renting.
            </motion.p>
            <motion.p 
              className="new-about-us-container-content-text2"
              variants={textFadeIn}
            >
              Welcome to My Property Fact, your go-to platform for discovering
              the perfect real estate opportunities. Whethe
            </motion.p>
            <motion.div variants={bounceIn}>
              <motion.button
                className="new-about-us-container-content-button"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read More
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <div className="container-fluid d-flex justify-content-center">
        <motion.div
          className="new-about-us-section-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2 
            className="new-about-us-section-2-heading text-center plus-jakarta-sans-bold pt-5"
            variants={headingFadeIn}
          >
            Our Story & Vision
          </motion.h2>
          <motion.p 
            className="new-about-us-section-2-text"
            variants={textFadeIn}
          >
            At My Property Fact, we believe in simplifying real estate decisions
            for everyone. Navigating the property market can be overwhelming, so
            we created a comprehensive portal that puts all the critical
            information right at your fingertips. Our mission is to empower you
            with transparent, data-driven insights and user-friendly tools so
            you can explore, compare, and choose the best real estate option for
            your unique needs.
          </motion.p>
          <motion.div
            className="new-about-us-section-2-image-container"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={scaleIn}
          >
            <motion.div 
              className="new-about-us-section-2-orange-banner"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            ></motion.div>
            {/* <Image
              src="/static/about-us/vision_and_mission.png"
              alt="Vision and Mission"
              width={1040}
              height={492}
              className="img-fluid"
            /> */}
            <video 
              src="/static/about-us/mission.mp4" 
              autoPlay 
              muted 
              loop 
              playsInline
              className="new-about-us-video"
            />
          </motion.div>
        </motion.div>
      </div>
      <div
        className="container-fluid position-relative"
        style={{ background: "#EDF4FF", minHeight: "570px", padding: "64px 0" }}
      >
        <motion.div 
          className="new-about-us-section-3-container-bg-image"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/static/about-us/about-us-background.png"
            alt="What We Offer"
            width={561}
            height={373}
            className="img-fluid"
          />
        </motion.div>
        <motion.div
          className="new-about-us-section-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2 
            className="new-about-us-section-3-heading text-center plus-jakarta-sans-bold pt-5"
            variants={headingFadeIn}
          >
            What We Offer
          </motion.h2>

          <div className="new-about-us-section-3-cards-wrapper">
            <motion.div
              className="new-about-us-section-3-cards"
              animate={{
                x: windowWidth > 768 
                  ? `-${currentSlide * (100 / cardsPerView)}%`
                  : `-${currentSlide * 100}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              {slidesData.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className="new-about-us-section-3-card"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={cardStagger}
                  whileHover={{ y: windowWidth > 768 ? -4 : 0, transition: { duration: 0.2 } }}
                  style={{
                    flex: `0 0 calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
                    minWidth: `calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
                    maxWidth: `calc((100% - ${(cardsPerView - 1) * 24}px) / ${cardsPerView})`,
                  }}
                >
                  <h3 className="new-about-us-section-3-card-title text-center plus-jakarta-sans-bold pt-5">
                    {slide.title}
                  </h3>
                  <p className="new-about-us-section-3-card-text">
                    {slide.text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="new-about-us-section-3-navigation"
            variants={bounceIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.button
              className="new-about-us-section-3-nav-button"
              onClick={prevSlide}
              disabled={isPrevDisabled}
              aria-label="Previous slide"
              whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IoIosArrowBack />
            </motion.button>
            <motion.button
              className="new-about-us-section-3-nav-button"
              onClick={nextSlide}
              disabled={isNextDisabled}
              aria-label="Next slide"
              whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <IoIosArrowForward />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      <WhyMyPropertyFact />
    </>
  );
}
