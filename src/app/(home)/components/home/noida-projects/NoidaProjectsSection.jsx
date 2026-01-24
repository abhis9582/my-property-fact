"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./NoidaProjectsSection.css";

// Noida projects data with id, title, price, count and image
const projects = [
  {
    id: "noida-extension-1",
    title: "Noida Extension",
    price: "6,380 - ₹43,00,000 per sqft",
    count: "3071 Properties for Sale",
    image: "/static/banners/noidaBuilding1.svg",
  },
  {
    id: "noida-extension-2",
    title: "Noida Extension",
    price: "6,380 - ₹43,00,000 per sqft",
    count: "3071 Properties for Sale",
    image: "/static/banners/NoidaBuilding2.svg",
  },
  {
    id: "noida-extension-3",
    title: "Noida Extension",
    price: "6,380 - ₹43,00,000 per sqft",
    count: "3071 Properties for Sale",
    image: "/static/banners/NoidaBuilding3.svg",
  },
  {
    id: "noida-extension-4",
    title: "Noida Extension",
    price: "6,380 - ₹43,00,000 per sqft",
    count: "3071 Properties for Sale",
    image: "/static/banners/NoidaBuilding3.svg",
  },
  {
    id: "noida-extension-5",
    title: "Noida Extension",
    price: "6,380 - ₹43,00,000 per sqft",
    count: "3071 Properties for Sale",
    image: "/static/banners/NoidaBuilding2.svg",
  },
];

export default function NoidaProjectsSection() {
  return (
    <section className="noida-projects-section">
      <div className="noida-projects-container">
        <h2 className="noida-projects-label">Explore</h2>
        <h2 className="noida-projects-title">
          Popular Projects In Greater Noida
        </h2>
        <div className="noida-projects-slider-wrap">
          <button
            className="noida-projects-nav noida-projects-prev"
            aria-label="Previous projects"
          >
            ‹
          </button>
          <Swiper
            className="noida-projects-slider"
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: ".noida-projects-prev",
              nextEl: ".noida-projects-next",
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={projects.length > 3}
            spaceBetween={24}
            slidesPerView={3}
            breakpoints={{
              0: { slidesPerView: 1.1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <article className="noida-project-card">
                <div className="noida-project-header">
                  <h3 className="noida-project-name">{project.title}</h3>
                  <span className="noida-project-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 3h7v7" />
                      <path d="M10 14L21 3" />
                      <path d="M21 14v7H3V3h7" />
                    </svg>
                  </span>
                </div>
                <p className="noida-project-price">{project.price}</p>
                <Link href="/projects" className="noida-project-link">
                  {project.count} <span aria-hidden="true">→</span>
                </Link>
                <div className="noida-project-image">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={340}
                    height={150}
                  />
                </div>
              </article>
            </SwiperSlide>
          ))}
          </Swiper>
          {/* <button
            className="noida-projects-nav noida-projects-next"
            aria-label="Next projects"
          >
            ›
          </button> */}
        </div>
      </div>
    </section>
  );
}
