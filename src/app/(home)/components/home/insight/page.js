"use client";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./insight.css";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import CommonPopUpform from "../../common/popupform";
import { ToastContainer } from "react-toastify";
export default function InsightNew() {
  const [isOpen, setIsOpen] = useState(false);
  const data = [
    {
      id: 1,
      src: "/static/insight.png",
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
      src: "/static/insight.png",
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
      src: "/static/insight.png",
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
      src: "/static/insight.png",
      alt: "price-trends-img",
      heading: "Property overviews & Ratings",
      sub_heading: "Don't just take our word for it; See what other residents",
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
      <p className="h1 text-center fw-bold">Insights</p>
      <div className="container my-5">
        <div className="d-flex justify-content-center gap-4 my-3 flex-wrap flex-column flex-md-row">
          {data.map((i) => (
            <div key={i.id} className={`bg-light insight-container mx-auto`}>
              <Link
                href={i.href}
                onClick={(e) => {
                  if (i.href === '#') {
                    e.preventDefault(); // stop scroll-to-top
                    openPopup(i);       // open popup
                  }
                }}
              >
                <div className="insight-container-child">
                  <p>{i.heading}</p>
                  <p>{i.sub_heading}</p>
                  <Image src={i.src} alt={i.alt} width={200} height={150} />
                </div>
                <div className={` insight-explore-button`}>
                  <button className="fw-bold text-light">Explore Now</button>
                  <FontAwesomeIcon color="white" icon={faArrowRight} width={15} />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <CommonPopUpform show={isOpen} handleClose={setIsOpen} />
      <ToastContainer />
    </>
  );
}
