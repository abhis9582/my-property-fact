"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./PopularCitiesSection.css";

// Defining popular cities data with name, link, image and alt text
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

// Returning the popular cities section
export default function PopularCitiesSection() {
  return (
    <section className="popular-cities-section">
      <div className="popular-cities-wrap">
        <div className="popular-cities-container">
          <div className="popular-cities-header">
            <h2 className="popular-cities-title">Popular Cities</h2>
            <Link href="/projects" className="popular-cities-cta">
              Explore More
            </Link>
          </div>

          <div className="popular-cities-slider-wrap">
            <button
              className="popular-cities-nav popular-cities-prev"
              aria-label="Previous cities"
            >
              ‹
            </button>
            <Swiper
              className="popular-cities-slider"
              modules={[Navigation]}
              navigation={{
                prevEl: ".popular-cities-prev",
                nextEl: ".popular-cities-next",
              }}
              spaceBetween={24}
              slidesPerView={6}
              breakpoints={{
                0: { slidesPerView: 1.1, spaceBetween: 12 },
                375: { slidesPerView: 1.2, spaceBetween: 14 },
                480: { slidesPerView: 1.5, spaceBetween: 16 },
                576: { slidesPerView: 1.8, spaceBetween: 18 },
                768: { slidesPerView: 2.5, spaceBetween: 20 },
                992: { slidesPerView: 3.5, spaceBetween: 22 },
                1200: { slidesPerView: 5, spaceBetween: 24 },
                1440: { slidesPerView: 6, spaceBetween: 24 },
              }}
            >
              {cities.map((city) => (
                <SwiperSlide key={city.name}>
                  <Link href={city.link} className="popular-city-card">
                    <div className="popular-city-image">
                      <Image
                        src={city.image}
                        alt={city.alt}
                        width={210}
                        height={140}
                      />
                    </div>
                    <div className="popular-city-name">{city.name}</div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              className="popular-cities-nav popular-cities-next"
              aria-label="Next cities"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
