"use client";
import "./newviews.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useState } from "react";
import CommonPopUpform from "../../common/popupform";
export default function NewsViews() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6 news-card my-3 d-flex justify-content-center">
            <Link className="inner" href="#"
              onClick={(e) => {
                e.preventDefault(); // stop scroll-to-top
                setIsOpen(true);      // open popup
              }}>
              <p className="card-title">Highway Construction</p>
              <div className="img-fluid">
                <Image
                  src="/news-views/Highway_const.jpg"
                  alt="highway_construction"
                  className="img-fluid rounded shadow-sm"
                  height={400}
                  width={350}
                  objectFit="cover"
                />
              </div>
              <div className="arrow">
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </div>
            </Link>
          </div>
          <div className="col-lg-3 col-sm-6 news-card my-3 d-flex justify-content-center">
            <Link className="inner" href="#" onClick={(e) => {
              e.preventDefault(); // stop scroll-to-top
              setIsOpen(true);       // open popup
            }}>
              <p className="card-title">News</p>
              <div className="img-fluid">
                <Image
                  src="/news-views/Metro_Station.jpg"
                  alt="Metro_Station"
                  className="img-fluid rounded shadow-sm"
                  height={400}
                  width={350}
                  objectFit="cover"
                />
              </div>
              <div className="arrow">
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </div>
            </Link>
          </div>
          <div className="col-lg-3 col-sm-6 news-card my-3 d-flex justify-content-center">
            <Link className="inner" href="#" onClick={(e) => {
              e.preventDefault(); // stop scroll-to-top
              setIsOpen(true);       // open popup
            }}>
              <p className="card-title">Events</p>
              <div className="img-fluid">
                <Image
                  src="/news-views/mne.jpg"
                  alt="mne"
                  className="img-fluid rounded shadow-sm"
                  height={400}
                  width={350}
                  objectFit="cover"
                />
              </div>
              <div className="arrow">
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </div>
            </Link>
          </div>
          <div className="col-lg-3 col-sm-6 news-card my-3 d-flex justify-content-center">
            <Link className="inner" href="#" onClick={(e) => {
              e.preventDefault(); // stop scroll-to-top
              setIsOpen(true);       // open popup
            }}>
              <p className="card-title">Blogs</p>
              <div className="img-fluid">
                <Image
                  src="/news-views/Money_Distributiuon.jpg"
                  alt="Money_Distributiuon"
                  className="img-fluid"
                  height={400}
                  width={350}
                />
              </div>
              <div className="arrow">
                <FontAwesomeIcon icon={faArrowCircleRight} />
              </div>
            </Link>
          </div>
        </div>
      </div>
      <CommonPopUpform show={isOpen} handleClose={setIsOpen} />
    </>
  );
}
