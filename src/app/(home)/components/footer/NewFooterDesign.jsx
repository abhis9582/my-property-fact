"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import PrivacyPolicyModal from "../privacy-policy/PrivacyPolicyModal";
import "./newfooter.css";

export default function NewFooterDesign({ cityList = [] }) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState({
    apartments: 5,
    newProjects: 5,
    commercial: 5,
    flats: 5,
  });
  const [animatingItems, setAnimatingItems] = useState({
    apartments: [],
    newProjects: [],
    commercial: [],
    flats: [],
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Helper function to generate URL slug from prefix
  const generateSlug = (prefix) => {
    return `/${prefix.replace(/ /g, "-").toLowerCase().trim()}`;
  };

  // Load more cities (5 at a time) for each category
  const loadMoreCities = (category, totalCities) => {
    const currentCount = visibleCount[category] || 5;
    const newCount = Math.min(currentCount + 5, totalCities);
    const newItemsStartIndex = currentCount;
    const newItemsEndIndex = newCount;
    
    // Track which items are being animated
    const newItemIndices = [];
    for (let i = newItemsStartIndex; i < newItemsEndIndex; i++) {
      newItemIndices.push(i);
    }
    
    // Set animation state first
    setAnimatingItems(prev => ({
      ...prev,
      [category]: newItemIndices
    }));
    
    // Then update visible count (slight delay for animation trigger)
    setTimeout(() => {
      setVisibleCount(prev => ({
        ...prev,
        [category]: newCount
      }));
    }, 10);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      setAnimatingItems(prev => ({
        ...prev,
        [category]: []
      }));
    }, 600);
  };

  // Reset to initial 5 cities
  const resetCities = (category) => {
    setVisibleCount(prev => ({
      ...prev,
      [category]: 5
    }));
  };

  // Filter cities based on category (same logic as old footer)
  const safeCityList = Array.isArray(cityList) ? cityList : [];
  const apartmentsCities = safeCityList;
  const newProjectsCities = safeCityList.filter(item => item?.cityName && !["Agra"].includes(item.cityName));
  const flatsCities = safeCityList;
  const commercialCities = safeCityList.filter(item => item?.cityName && !["Agra", "Bareilly", "Chennai", "Dehradun", "Kochi", "Thiruvananthapuram", "Vrindavan"].includes(item.cityName));

  // Helper function to render city list with Load More
  const renderCityList = (cities, category, prefix, generateSlugFn) => {
    const currentVisible = visibleCount[category] || 5;
    const visibleCities = cities.slice(0, currentVisible);
    const hasMore = cities.length > currentVisible;
    const isExpanded = currentVisible > 5;
    const animatingIndices = animatingItems[category] || [];

    return (
      <>
        <ul className="footer-links">
          {visibleCities.map((city, index) => {
            const isAnimating = animatingIndices.includes(index);
            const animationIndex = isAnimating ? animatingIndices.indexOf(index) : 0;
            const animationDelay = isAnimating ? animationIndex * 0.05 : 0;
            
            return (
              <li 
                key={`${category}-${city.id || index}`}
                className={isAnimating ? 'city-item-animating' : ''}
                style={isAnimating ? { 
                  animationDelay: `${animationDelay}s`
                } : {}}
              >
                <Link
                  href={`${generateSlugFn(prefix)}${city.slugURL}`}
                  className="footer-link"
                >
                  {prefix}{city.cityName}
                </Link>
              </li>
            );
          })}
        </ul>
        {hasMore && (
          <button
            onClick={() => loadMoreCities(category, cities.length)}
            className="read-more-less-btn"
          >
            <span>Load More</span>
            <FontAwesomeIcon 
              icon={faChevronDown} 
              className="read-more-icon"
            />
          </button>
        )}
        {isExpanded && !hasMore && (
          <button
            onClick={() => resetCities(category)}
            className="read-more-less-btn"
          >
            <span>Show Less</span>
            <FontAwesomeIcon 
              icon={faChevronUp} 
              className="read-more-icon"
            />
          </button>
        )}
      </>
    );
  };

  return (
    <div className="new-footer-design-container-fluid">
      <div className="new-design-container">
        {/* Top Section */}
        <div className="new-design-footer-top">
          {/* Left Section - Company Info */}
          <div className="new-design-footer-top-left">
            <div className="new-design-footer-top-left-content">
              <div className="new-design-footer-top-left-logo">
                <Image
                  src="/logo.png"
                  alt="MPF Logo"
                  width={113}
                  height={103}
                />
              </div>
              <p className="company-description">
                My Property Fact is your trusted platform for discovering the perfect real estate opportunities across India. We bring together verified properties, transparent data,smart tools to help you make informed decisions whether you&apos;re buying or investing.
              </p>
            </div>
            <div className="contact-details">
              <div className="contact-item-footer contact-item-full">
                <span className="contact-label">ADDRESS:</span>
                <span className="contact-value">
                  6th Floor Tower A1, Corporate Park Noida-142, India
                </span>
              </div>
              <div className="contact-item-row">
                <div className="contact-item">
                  <span className="contact-label">PHONE:</span>
                  <span className="contact-value">+91 8920024793</span>
                </div>
                <div className="contact-item">
                  <span className="contact-label">EMAIL:</span>
                  <span className="contact-value">
                    social@mypropertyfact.com
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Section - Newsletter */}
          <div className="new-design-footer-top-right">
            <div className="new-design-footer-top-right-newsletter">
              <h3 className="newsletter-heading plus-jakarta-sans-semi-bold">Newsletter Signup</h3>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="newsletter-input"
                />
                <button className="newsletter-button btn-normal-color">Send</button>
              </div>
            </div>
            <div className="new-design-footer-top-right-content">
              <div className="new-design-footer-top-right-left">
                <h4 className="footer-section-heading">Company info</h4>
                <ul className="footer-links">
                  <li>
                    <Link href="/about-us" className="footer-link">About MPF</Link>
                  </li>
                  <li>
                    <Link href="/projects/commercial" className="footer-link" prefetch={true}>Commercial</Link>
                  </li>
                  <li>
                    <Link href="/projects/new-launches" className="footer-link" prefetch={true}>New Launches</Link>
                  </li>
                  <li>
                    <Link href="/projects/residential" className="footer-link" prefetch={true}>Residential</Link>
                  </li>
                </ul>
              </div>
              <div className="new-design-footer-top-right-right">
                <h4 className="footer-section-heading">Resources</h4>
                <ul className="footer-links">
                  <li>
                    <Link href="/career" className="footer-link">Careers</Link>
                  </li>
                  <li>
                    <Link href="/blog" className="footer-link">Blog</Link>
                  </li>
                  <li>
                    <Link href="/web-stories" className="footer-link">Web Stories</Link>
                  </li>
                  <li>
                    <Link href="/contact-us" className="footer-link">Contact Us</Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="footer-link privacy-policy-btn"
                      style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                    >
                      Privacy Policy
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        {/* <div className="new-design-footer-middle"></div> */}

        {/* Bottom Section - Property Categories */}
        <div className="new-design-footer-bottom">
          <div className="footer-bottom-column">
            <h4 className="footer-section-heading">Apartments in India</h4>
            {renderCityList(apartmentsCities, "apartments", "Apartments in ", generateSlug)}
          </div>
          <div className="footer-bottom-column">
            <h4 className="footer-section-heading">New Projects in India</h4>
            {renderCityList(newProjectsCities, "newProjects", "New Projects in ", generateSlug)}
          </div>
          <div className="footer-bottom-column">
            <h4 className="footer-section-heading">
              Commercial Property in India
            </h4>
            {renderCityList(commercialCities, "commercial", "Commercial Property in ", generateSlug)}
          </div>
          <div className="footer-bottom-column">
            <h4 className="footer-section-heading">Flats in India</h4>
            {renderCityList(flatsCities, "flats", "Flats in ", generateSlug)}
          </div>
        </div>

        {/* Stay Updated Section */}
        <div className="footer-stay-updated">
          <h4 className="stay-updated-heading m-0 p-0">Stay Updated With Us</h4>
          <div className="social-media-icons">
            <a
              href="https://www.facebook.com/mypropertyfact1/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://x.com/my_propertyfact"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FontAwesomeIcon icon={faXTwitter} />
            </a>
            <a
              href="https://www.instagram.com/my.property.fact/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://www.linkedin.com/company/my-property-fact/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a
              href="https://www.youtube.com/@my.propertyfact/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FontAwesomeIcon icon={faYoutube} />
            </a>
          </div>
        </div>
      </div>

      {/* Disclaimer and Copyright */}
      <div className="footer-disclaimer-copyright">
        <p className="disclaimer-text">
          The content and data are for informative purposes only and may be
          prone to inaccuracy and inconsistency. We do not take any
          responsibility for data mismatches and strongly advise the viewers to
          conduct their detailed research before making any investment or
          purchase-related decisions.
        </p>
        <p className="copyright-text">
          © 2026 – mypropertyfact. All rights reserved.
        </p>
      </div>

      {/* Scroll to Top Button */}
      {/* {showScrollTop && (
        <button
          className="scroll-to-top-button btn-normal-color"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )} */}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        show={showPrivacyModal} 
        onHide={() => setShowPrivacyModal(false)} 
      />
    </div>
  );
}
