"use client";

import { useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBannerSlider = ({ slides = [] }) => {
  if (!slides.length) {
    return null;
  }

  const resolveDesktopSrc = (slide) =>
    slide?.desktop || slide?.tablet || slide?.mobile || "/mpf-banner.jpg";

  const updateHeaderBackground = (slideIndex) => {
    if (typeof document === "undefined") return;
    const slide = slides[slideIndex];
    const desktopSrc = resolveDesktopSrc(slide);
    document.documentElement.style.setProperty(
      "--hero-header-bg",
      `url("${desktopSrc}")`
    );
  };

  useEffect(() => {
    updateHeaderBackground(0);
  }, [slides]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
    pauseOnFocus: false,
    fade: true,
    adaptiveHeight: false,
    afterChange: (current) => updateHeaderBackground(current),
  };

  return (
    <div className="hero-banner-slider">
      <Slider {...settings}>
        {slides.map((slide, index) => {
          const {
            id,
            desktop,
            tablet,
            mobile,
            alt = "Hero banner",
            priority = index === 0,
            height = 600,
            link,
            href,
          } = slide;

          const desktopSrc = desktop || "/mpf-banner.jpg";
          const tabletSrc = tablet || desktopSrc;
          const mobileSrc = mobile || tabletSrc;
          const navigationLink = link || href;

          const imageContent = (
            <picture className="position-relative home-banner">
              <source srcSet={mobileSrc} media="(max-width: 426px)" />
              <source srcSet={desktopSrc} media="(max-width: 1199px)" />
              <Image
                src={desktopSrc}
                alt={alt}
                width={1920}
                height={height}
                className="img-fluid w-100"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                sizes="(max-width: 426px) 100vw, (max-width: 1199px) 100vw, 1920px"
              />
            </picture>
          );

          return (
            <div
              key={id || `hero-slide-${index}`}
              className={`hero-banner-slide ${slide.className || ""}`}
            >
              {navigationLink ? (
                <Link href={navigationLink} className="d-block">
                  {imageContent}
                </Link>
              ) : (
                imageContent
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default HeroBannerSlider;
