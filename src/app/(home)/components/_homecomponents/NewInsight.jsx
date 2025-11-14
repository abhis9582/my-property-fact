"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./newinsight.css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";
import {
  faBarsProgress,
  faCalculator,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NewInsight() {
  const insights = [
    {
      id: 1,
      src: "/static/icon/Growth_Tracker.jpg",
      alt: "price-trends-img",
      heading: "Property Growth Tracker",
      sub_heading:
        "Monitor property value, rental yields, neighbourhood upgrades; visual graphs track appreciation, send alerts, suggest reinvestment or exit timing decisions smartly.",
      color: "light-green",
      button_color: "dark-green",
      href: "/property-rate-and-trend",
      icon: faChartLine,
    },
    {
      id: 2,
      src: "/static/icon/Loan_calculator.jpg",
      alt: "property-rates-heatmap-img",
      heading: "EMI Calculator",
      sub_heading:
        "Compute monthly EMI, total interest, lifetime cost instantly; adjust loan amount, tenure, rate to secure stress‑free financing decisions for buyers.",
      color: "light-pink",
      button_color: "dark-pink",
      href: "/emi-calculator",
      icon: faCalculator,
    },
    {
      id: 3,
      src: "/static/icon/Market_Analysis.jpg",
      alt: "price-trends-img",
      heading: "Market Analysis",
      sub_heading:
        "We deliver price trends, policy updates, infrastructure news, enabling investors, developers, and lenders to recalibrate the market strategies regularly.",
      color: "light-yellow",
      button_color: "dark-yellow",
      // href: "/market-analysis",
      href: "/market-analysis",
      icon: faBarsProgress,
    },
    {
      id: 4,
      src: "/static/icon/LOCATE_Score.jpg",
      alt: "price-trends-img",
      heading: "LOCATE Score",
      sub_heading:
        "This converts economy, projects, connectivity, amenities, trends, supply data into one 1000‑point LOCATE rating guiding smart investments with clarity.",
      color: "light-blue",
      button_color: "dark-blue",
      href: "/locate-score",
      icon: faChartLine,
    },
  ];

  return (
    <div className="container-fluid bg-white new-insight-container">
      <div className="container insight-content-wrapper">
        <div className="insight-header">
          <h2>Insight</h2>
          <div className="insight-navigation-buttons">
            <button className="insight-button-prev" aria-label="Previous slide">
              {/* <HiArrowLeft /> */}
              <Image
                src="/static/icon/left_arrow.png"
                alt="Previous slide"
                width={16}
                height={16}
              />
            </button>
            <button className="insight-button-next" aria-label="Next slide">
              <Image
                src="/static/icon/right_arrow.png"
                alt="Previous slide"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
        <div className="insight-swiper-wrapper">
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".insight-button-next",
              prevEl: ".insight-button-prev",
            }}
            loop={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            {insights.map((insight, index) => (
              <SwiperSlide key={`${index}-${insight.id}`}>
                <div className="insight-card-new">
                  <div className="insight-card-left">
                    <div>
                      <div className="insight-icon-wrapper">
                        {/* <Image
                          src="/static/icon/home_icon.png"
                          alt="chart"
                          width={55}
                          height={55}
                          className="img-fluid"
                        /> */}
                        <FontAwesomeIcon
                          icon={insight.icon}
                          className="insight-icon"
                          style={{ color: "#9b8755" }}
                        />
                      </div>
                    </div>
                    <div className="insight-content">
                      <h3 className="insight-title">{insight.heading}</h3>
                      <p className="insight-description">
                        {insight.sub_heading}
                      </p>
                      <div className="d-flex align-items-center gap-2 insight-button-wrapper">
                        <div className="d-flex align-items-center gap-2 insight-button">
                          <Link
                            className="text-decoration-none"
                            href={insight.href}
                          >
                            <p className="p-0 m-0">Explore Now</p>
                          </Link>
                          <div className="icon-container">
                            <Image
                              src="/static/icon/explore_arrow.png"
                              alt="Previous slide"
                              width={13.2}
                              height={13.2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="insight-card-right">
                    <Image
                      src={insight.src}
                      alt="chart"
                      width={496}
                      height={228}
                      quality={100}
                      className="insight-card-image"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
