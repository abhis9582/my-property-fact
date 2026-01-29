"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "./PopularCitiesComponent.css";
import { RiArrowRightSLine } from "react-icons/ri";

export default function PopularCitiesComponent({ cities = [] }) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Default cities if none provided
  const defaultCities = [
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
      name: "Bareilly",
      link: "/city/bareilly",
      image: "/dream-cities/bareilly_new.png",
      alt: "Bareilly city",
    },
    {
      name: "Chandigarh",
      link: "/city/chandigarh",
      image: "/dream-cities/chandigarh_new.png",
      alt: "Chandigarh city",
    },
    {
      name: "Chennai",
      link: "/city/chennai",
      image: "/dream-cities/chennai_new.png",
      alt: "Chennai city",
    },
    {
      name: "Dehradun",
      link: "/city/dehradun",
      image: "/dream-cities/dehradun_new.png",
      alt: "Dehradun city",
    },
  ];

  const citiesToDisplay = cities.length > 0 ? cities : defaultCities;

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        scrollContainer.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [citiesToDisplay]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="popular-cities-container">
      <div className="popular-cities-wrapper">
        {/* Header Section */}
        <div className="popular-cities-header">
          <h1 className="popular-cities-title">Popular Cities</h1>
          <Link href="/cities" className="explore-more-button">
            Explore More
          </Link>
        </div>

        {/* City Cards with Navigation */}
        <div className="popular-cities-content">
          <button
            className="nav-arrow-button nav-arrow-left"
            onClick={scrollLeft}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <FaArrowLeft />
          </button>

          <div className="popular-cities-scroll" ref={scrollContainerRef}>
            {citiesToDisplay.map((city, index) => (
              <Link
                key={index}
                href={city.link || "#"}
                className="city-card-link"
              >
                <div className="popular-city-card">
                  <div className="city-card-image">
                    <Image
                      src={city.image}
                      alt={city.alt || city.name}
                      fill
                      sizes="(max-width: 768px) 200px, 250px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="city-card-name">{city.name}</div>
                </div>
              </Link>
            ))}
          </div>

          <button
            className="nav-arrow-button nav-arrow-right"
            onClick={scrollRight}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <RiArrowRightSLine />
          </button>
        </div>
      </div>
    </div>
  );
}
