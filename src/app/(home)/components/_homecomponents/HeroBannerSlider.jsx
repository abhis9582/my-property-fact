"use client";

import { useEffect, useCallback } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroBannerSlider = ({ slides = [] }) => {
  const resolveDesktopSrc = (slide) =>
    slide?.desktop || slide?.tablet || slide?.mobile || "/mpf-banner.jpg";

  const updateHeaderBackground = useCallback((slideIndex) => {
    if (typeof document === "undefined") return;
    const slide = slides[slideIndex];
    if (!slide) return;
    const desktopSrc = resolveDesktopSrc(slide);
    document.documentElement.style.setProperty(
      "--hero-header-bg",
      `url("${desktopSrc}")`
    );
  }, [slides]);

  useEffect(() => {
    if (slides.length > 0) {
      updateHeaderBackground(0);
    }
  }, [slides, updateHeaderBackground]);

  if (!slides.length) {
    return null;
  }

  const isSingleSlide = slides.length === 1;

  const settings = {
    dots: !isSingleSlide, // Hide dots for single slide
    arrows: false,
    infinite: !isSingleSlide, // Disable infinite for single slide
    speed: 800,
    autoplay: !isSingleSlide, // Disable autoplay for single slide
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
            priority: slidePriority,
            height = 600,
            link,
            href,
          } = slide;

          // For single slide, always prioritize. Otherwise, prioritize first slide or use slide's priority prop
          const priority = isSingleSlide ? true : (slidePriority !== undefined ? slidePriority : index === 0);

          const desktopSrc = desktop || "/mpf-banner.jpg";
          const tabletSrc = tablet || desktopSrc;
          const mobileSrc = mobile || tabletSrc;
          const navigationLink = link || href;

          const imageContent = (
            <picture className="position-relative home-banner">
              <source srcSet={mobileSrc} media="(max-width: 767px)" />
              <source srcSet={tabletSrc} media="(max-width: 1023px)" />
              <source srcSet={desktopSrc} media="(min-width: 1024px)" />
              <Image
                src={desktopSrc}
                alt={alt}
                width={1920}
                height={height}
                className="img-fluid w-100"
                priority
                fetchPriority={priority ? "high" : "auto"}
                quality={80}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 1920px"
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
