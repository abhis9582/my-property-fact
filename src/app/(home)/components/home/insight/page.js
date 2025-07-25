"use client";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./insight.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CommonPopUpform from "../../common/popupform";
export default function InsightNew() {
  const [isOpen, setIsOpen] = useState(false);
  const data = [
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
        "We deliver price trends, policy updates, infrastructure news, enabling investors, developers, and lenders to recalibrate market strategies regularly.",
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
      sub_heading: "This converts economy, projects, connectivity, amenities, trends, supply data into one 1000‑point LOCATE rating guiding smart investments with clarity.",
      color: "light-blue",
      button_color: "dark-blue",
      href: "/locate-score",
    },
  ];
  //opeaning pop
  const openPopup = (data) => {
    if (data.href.length < 3) {
      setIsOpen(true);
    }
  }
  return (
    <>
      <div className="container">
        <div className="row">
          {data.map((i) => (
            <div key={i.id} className={`col-sm-12 col-md-6 col-xl-3`}>
              <Link
                href={i.href}
                onClick={(e) => {
                  if (i.href === '#') {
                    e.preventDefault(); // stop scroll-to-top
                    openPopup(i);       // open popup
                  }
                }}
                className="text-dark d-flex justify-content-center"
              >
                <div className="text-dark bg-light rounded-4 overflow-hidden my-3 transition transform hover-scale custom-shadow insight-card">
                  <div className="p-3">
                    <h5 className="text-golden">{i.heading}</h5>
                    <p>{i.sub_heading}</p>
                    <div className="d-flex justify-content-center">
                      <Image
                        src={i.src}
                        alt={i.alt}
                        width={250}
                        height={120}
                      />
                    </div>
                  </div>
                  <div className={`bg-light p-3 d-flex justify-content-center`}>
                    <button className="fw-bold text-light btn-background d-flex align-items-center rounded-4 p-2 border-0">
                      <p className="text-white mx-5 p-0 m-0">Explore Now </p>
                      <FontAwesomeIcon color="white" icon={faArrowRight} width={15} />
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <CommonPopUpform show={isOpen} handleClose={setIsOpen} />
    </>
  );
}
