"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "./NoidaProjectsSection.css";

// Static city data (10 cards)
const CITY_CARDS = [
  {
    id: "ludhiana",
    name: "Ludhiana",
    priceRange: "6,380 – ₹ 43,00,000 per sqft",
    totalProperties: 3071,
    href: "/city/ludhiana",
    imageSrc: "/agi-sky.webp",
  },
  {
    id: "maria-one",
    name: "Kochi",
    priceRange: "6,380 – ₹ 43,00,000 per sqft",
    totalProperties: 3071,
    href: "/city/kochi",
    imageSrc: "/marina.webp",
  },
  {
    id: "ajmera-marina",
    name: "Banglore",
    priceRange: "6,380 – ₹ 43,00,000 per sqft",
    totalProperties: 3071,
    href: "/city/bangalore",
    imageSrc: "/ajmer.webp",
  },
  {
    id: "galaxy-sawasdee",
    name: "Delhi",
    priceRange: "5,900 – ₹ 32,00,000 per sqft",
    totalProperties: 2145,
    href: "/city/delhi",
    imageSrc: "/NewDelhi.webp",
  },
  {
    id: "adani-9-pbr",
    name: "Mumbai",
    priceRange: "7,200 – ₹ 55,00,000 per sqft",
    totalProperties: 1120,
    href: "/city/mumbai",
    imageSrc: "/adani.webp",
  },
  
  {
    id: "sector-153",
    name: "Sector 153, Noida",
    priceRange: "10,200 – ₹ 1,10,00,000 per sqft",
    totalProperties: 540,
    href: "/city/noida",
    imageSrc: "/ace-153.webp",
  },
  // {
  //   id: "yamuna-expressway",
  //   name: "Yamuna Expressway",
  //   priceRange: "4,800 – ₹ 28,00,000 per sqft",
  //   totalProperties: 1760,
  //   href: "/city/yamuna-expressway",
  //   imageSrc: "/noida/yamuna-expressway.jpg",
  // },
  // {
  //   id: "sector-137",
  //   name: "Sector 137",
  //   priceRange: "6,900 – ₹ 47,00,000 per sqft",
  //   totalProperties: 1325,
  //   href: "/city/sector-137",
  //   imageSrc: "/noida/sector-137.jpg",
  // },
  // {
  //   id: "sector-76",
  //   name: "Sector 76",
  //   priceRange: "5,600 – ₹ 36,00,000 per sqft",
  //   totalProperties: 980,
  //   href: "/city/sector-76",
  //   imageSrc: "/noida/sector-76.jpg",
  // },
];

export default function NoidaProjectsSection() {

  return (
    <section className="noida-projects-section">
      <div className="noida-projects-container">
        <div className="noida-projects-content">
          <div className="noida-projects-header">
            <p className="noida-projects-eyebrow">Most</p>
            <h2 className="noida-projects-title">
              Popular Real Estate Destinations
            </h2>
          </div>
          <div className="city-cards-slider-wrapper">
            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={CITY_CARDS.length > 3}
              spaceBetween={8}
              slidesPerView={1}
              breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 8 },
                480: { slidesPerView: 1.2, spaceBetween: 8 },
                640: { slidesPerView: 1.5, spaceBetween: 8 },
                768: { slidesPerView: 2, spaceBetween: 8 },
                992: { slidesPerView: 2.9, spaceBetween: 8 },
                1200: { slidesPerView: 2.9, spaceBetween: 8 },
                1440: { slidesPerView: 2.9, spaceBetween: 8 },
              }}
              // watchOverflow={true}
              preventClicks={true}
              preventClicksPropagation={true}
              className="city-cards-swiper"
            >
              {CITY_CARDS.map((city) => (
                <SwiperSlide key={city.id}>
                  <CityCard
                    city={city}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

// City Card Component
function CityCard({ city }) {
  return (
    <Link 
      href={city.href}
      className="city-card city-card-link"
    >
      {/* City Header */}
      <div className="city-card-header">
        <div className="city-header-row">
          <h3 className="city-name">{city.name}</h3>
          <span className="city-external-icon" aria-hidden="true">
            <Image
              src="/icon/navigate.svg"
              alt=""
              width={18}
              height={18}
              className="navigate-icon"
            />
          </span>
        </div>
      </div>

      {/* Price Range */}
      <div className="city-price-range">
        <span className="price-text">{city.priceRange}</span>
      </div>

      {/* Total Properties Count */}
      <div className="city-properties-count">
        <span className="count-text">
          {city.totalProperties}{" "}
          {city.totalProperties === 1 ? "Property for Sale" : "Properties for Sale"}
          <Image
            src="/icon/arrow.svg"
            alt=""
            width={16}
            height={16}
            className="count-arrow-icon"
          />
        </span>
      </div>

      {/* Static City Image */}
      <div className="city-projects-slider-container">
        <div className="project-image-wrapper">
          <Image
            src={city.imageSrc}
            alt={city.name}
            fill
            className="project-slider-image"
            unoptimized
          />
        </div>
      </div>
    </Link>
  );
}
