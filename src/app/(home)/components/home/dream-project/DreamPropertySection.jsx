"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import "./DreamPropertySection.css";

const DreamPropertySection = () => {
  const cityCardsRef = useRef(null);
  // Scroll to cities function
  const scrollToCities = () => {
    if (cityCardsRef.current) {
      cityCardsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  // Cities data matching the image with name, link, image and alt text
  const cities = [
    {
      name: "Agra",
      link: "/city/agra",
      image: "/dream-cities/agra_new.png",
      alt: "Agra city",
    },
    {
      name: "Bangalore",
      link: "/city/bangalore",
      image: "/dream-cities/bangalore_new.png",
      alt: "Bangalore city",
    },
    {
      name: "Noida",
      link: "/city/noida",
      image: "/dream-cities/noida_new.png",
      alt: "Noida city",
    },
    {
      name: "Delhi",
      link: "/city/delhi",
      image: "/dream-cities/delhi_new.png",
      alt: "Delhi city",
    },
    {
      name: "Ghaziabad",
      link: "/city/ghaziabad",
      image: "/dream-cities/ghaziabad_new.png",
      alt: "Ghaziabad city",
    },
    {
      name: "Jaipur",
      link: "/city/jaipur",
      image: "/dream-cities/jaipur_new.png",
      alt: "Jaipur city",
    },
    {
      name: "Mumbai",
      link: "/city/mumbai",
      image: "/dream-cities/mumbai_new.png",
      alt: "Mumbai city",
    },
    {
      name: "Gurugram",
      link: "/city/gurugram",
      image: "/dream-cities/gurugram_new.png",
      alt: "Gurugram city",
    },
  ];

  // Returning the dream property section
  return (
    <section className="dream-property-section my-4 my-lg-5">
      <div className="dream-property-container">
        {/* Header Section */}
        <div className="container dream-property-header">
          <div className="header-left">
            <h2 className="dream-property-title plus-jakarta-sans-semi-bold">
              Find Your Dream Property In The City<br/> You Are Searching In
              <Link href='/projects' >
              <button
                
                className="nav-arrow-button"
                aria-label="Navigate to cities"
                
              >
                <FaArrowRight />
              </button>
              </Link>
            </h2>
          </div>
          <Link href="/projects" className="see-all-button text-white btn-normal-color">
            See All Properties
          </Link>
        </div>

        {/* City Cards Grid */}
        <div className="city-cards-grid" ref={cityCardsRef}>
          {cities.map((city, index) => (
            <div key={index} className="city-card">
              <div className="city-image-wrapper">
                <Image
                  src={city.image}
                  alt={city.alt}
                  height={90}
                  width={105}
                />
              </div>
              <div className="city-content">
                <h3 className="city-name">{city.name}</h3>
                <Link href={city.link} className="explore-details-button">
                  Explore Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DreamPropertySection;
