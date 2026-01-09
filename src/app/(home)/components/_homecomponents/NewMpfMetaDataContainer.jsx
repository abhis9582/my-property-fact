"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faHardHat,
  faFileAlt,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import "./newmpfmetadata.css";
import Image from "next/image";
import Link from "next/link";

export default function NewMpfMetaDataContainer() {
  const [activePropertyType, setActivePropertyType] = useState("Commercial");
  const [statistics, setStatistics] = useState([
    {
      image: "/static/footer/icon1.svg",
      alt: "Cities",
      number: "26",
      label: "Cities",
    },
    {
      image: "/static/footer/icon2.svg",
      alt: "Builders",
      number: "273",
      label: "Builders",
    },
    {
      image: "/static/footer/icon3.svg",
      alt: "Projects",
      number: "687",
      label: "Projects",
    },
    {
      image: "/static/footer/icon4.svg",
      alt: "Units",
      number: "10,030",
      label: "Units",
    },
  ]);
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const observerRef = useRef(null);

  const propertyTypes = [
    { id: "Commercial", label: "Commercial", slugUrl: "/commercial" },
    { id: "New Launches", label: "New Launches", slugUrl: "/new-launches" },
    { id: "Residential", label: "Residential", slugUrl: "/residential" },
  ];

  // Fetch statistics data dynamically
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // You can replace this with your actual API endpoint
        // For now, using the default values as fallback
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Example: If you have a statistics endpoint, uncomment and modify:
        // const response = await fetch(`${apiUrl}statistics`);
        // if (response.ok) {
        //   const data = await response.json();
        //   setStatistics(data);
        //   // Reset animation when new data is fetched
        //   setHasAnimated(false);
        //   setAnimatedValues([0, 0, 0, 0]);
        // }

        // For now, we'll use the existing data structure
        // You can modify this to fetch from your API
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Keep default values on error
      }
    };

    fetchStatistics();
  }, []);

  // Helper function to parse number from string (handles commas)
  const parseNumber = useCallback((value) => {
    if (typeof value === "number") return value;
    return parseInt(value.replace(/,/g, ""), 10) || 0;
  }, []);

  // Helper function to format number with commas
  const formatNumber = useCallback((num) => {
    return num.toLocaleString("en-US");
  }, []);

  // Counter animation function
  const animateCounter = useCallback((targetValue, index, duration = 2000) => {
    const startValue = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (targetValue - startValue) * easeOutQuart
      );

      setAnimatedValues((prev) => {
        const newValues = [...prev];
        newValues[index] = currentValue;
        return newValues;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = targetValue;
          return newValues;
        });
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Intersection Observer to trigger animation when component is visible
  useEffect(() => {
    if (!observerRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            statistics.forEach((stat, index) => {
              const targetValue = parseNumber(stat.number);
              animateCounter(targetValue, index);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasAnimated, statistics, parseNumber, animateCounter]);

  return (
    <div className="mpf-metadata-container container">
      {/* Top Section: Property Search Interface */}
      <div className="property-search-card">
        <div className="illustration-left">
          <div className="left-iilution-container">
            <Image
              src="/static/footer/leftillution.png"
              alt="Left Illustration"
              width={336}
              height={90}
            />
          </div>
        </div>
        <div className="property-search-card-content">
          <h2 className="property-search-title plus-jakarta-sans-bold mt-3 mt-md-0">
            Find The Best Property
          </h2>
          <div className="d-flex flex-wrap align-item-center justify-content-center gap-4 my-4">
            {propertyTypes.map((item, index) => (
              <div key={`row-${index}`}>
                <Link
                  href={`projects/${item.slugUrl}`}
                  className="btn-normal-color rounded-5 py-2 px-3 text-white text-decoration-none"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Right: House with Figures Illustration */}
        <div className="illustration-right">
          <div className="right-illustration-container">
            <Image
              src="/static/footer/rightillution.png"
              alt="Right Illustration"
              width={450}
              height={130}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Statistics */}
      <div className="statistics-section" ref={observerRef}>
        {statistics.map((stat, index) => (
          <div key={index} className="statistics-card">
            <div className="statistics-icon">
              <Image src={stat.image} alt={stat.alt} width={58} height={58} />
            </div>
            <p className="statistics-number">
              {formatNumber(animatedValues[index])}
              <span>+</span>
            </p>
            <div className="statistics-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
