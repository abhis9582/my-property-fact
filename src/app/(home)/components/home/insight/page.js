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
      heading: "Property rates & trends",
      sub_heading:
        "market rates, data analytics & registred transactions of top project & localites",
      color: "light-green",
      button_color: "dark-green",
      href: "/property-rate-and-trend",
    },
    {
      id: 2,
      src: "/static/Insight_MPF_2.png",
      alt: "property-rates-heatmap-img",
      heading: "Property Rates Heatmap",
      sub_heading:
        "market rates, data analytics & registred transactions of top project & localites",
      color: "light-pink",
      button_color: "dark-pink",
      href: "#",
    },
    {
      id: 3,
      src: "/static/Insight_MPF_3.png",
      alt: "price-trends-img",
      heading: "Valuation Report",
      sub_heading:
        "Get an instant & comprehensive Valuation Report of any property - downloadable in PDF",
      color: "light-yellow",
      button_color: "dark-yellow",
      href: "#",
    },
    {
      id: 4,
      src: "/static/Insight_MPF_4.png",
      alt: "price-trends-img",
      heading: "Property overviews & Ratings",
      sub_heading: "Don't just take our word for it; see what other residents have to say about us",
      color: "light-blue",
      button_color: "dark-blue",
      href: "#",
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
            <div key={i.id} className={`col-sm-12 col-md-4 col-xl-3`}>
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
                    <p>{i.heading}</p>
                    <p>{i.sub_heading}</p>
                    <div className="d-flex justify-content-center">
                      <Image src={i.src} alt={i.alt} width={200} height={200} className="img-fluid mb-2" />
                    </div>
                  </div>
                  <div className={`bg-light p-3 d-flex justify-content-center`}>
                    <button className="fw-bold text-light btn-background d-flex align-items-center rounded-4 p-2"><p className="text-white mx-5 p-0 m-0">Explore Now </p>
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
