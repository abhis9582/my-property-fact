"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./newinsight.css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import Image from "next/image";

export default function NewInsight() {
  const insights = [
    {
        id: 1,
        src: "/static/Insight_MPF_1.png",
        alt: "price-trends-img",
        heading: "Property Growth Tracker",
        sub_heading:
          "Monitor property value, rental yields, neighbourhood upgrades; visual graphs track appreciation, send alerts, suggest reinvestment or exit timing decisions smartly.",
        color: "light-green",
        button_color: "dark-green",
        href: "/property-rate-and-trend",
      },
      {
        id: 2,
        src: "/static/Insight_MPF_2.png",
        alt: "property-rates-heatmap-img",
        heading: "EMI Calculator",
        sub_heading:
          "Compute monthly EMI, total interest, lifetime cost instantly; adjust loan amount, tenure, rate to secure stress‑free financing decisions for buyers.",
        color: "light-pink",
        button_color: "dark-pink",
        href: "/emi-calculator",
      },
      {
        id: 3,
        src: "/static/Insight_MPF_3.png",
        alt: "price-trends-img",
        heading: "Market Analysis",
        sub_heading:
          "We deliver price trends, policy updates, infrastructure news, enabling investors, developers, and lenders to recalibrate the market strategies regularly.",
        color: "light-yellow",
        button_color: "dark-yellow",
        // href: "/market-analysis",
        href: "/market-analysis",
      },
      {
        id: 4,
        src: "/static/Insight_MPF_4.png",
        alt: "price-trends-img",
        heading: "LOCATE Score",
        sub_heading:
          "This converts economy, projects, connectivity, amenities, trends, supply data into one 1000‑point LOCATE rating guiding smart investments with clarity.",
        color: "light-blue",
        button_color: "dark-blue",
        href: "/locate-score",
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
                    <div className="insight-icon-wrapper">
                      <Image
                        src="/static/icon/home_icon.png"
                        alt="chart"
                        width={55}
                        height={55}
                        className="img-fluid"
                      />
                    </div>
                    <div className="insight-content">
                      <h3 className="insight-title">{insight.heading}</h3>
                      <p className="insight-description">
                        {insight.sub_heading}
                      </p>
                    </div>
                  </div>
                  <div className="insight-card-right">
                    <Image
                      src="/static/icon/insight2.png"
                      alt="chart"
                      width={633}
                      height={292}
                      className="img-fluid"
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
