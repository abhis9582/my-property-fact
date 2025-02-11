"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

export default function Featured() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const goToPropertyDetail = (url) => {
    window.open("/" + url, "_blank");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allFeaturedProperties = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
        );
        setFeaturedProperties(allFeaturedProperties.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1279,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="container mt-4">
        <p className="fs-1 fw-bold text-center">Featured Projects</p>
        <Slider {...settings}>
          {featuredProperties.map((property) => {
            return (
              <aside key={property.id} className="p-4 container">
                <div
                  className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container main-container"
                  onClick={() => goToPropertyDetail(property.slugURL)}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${property.slugURL}/${property.projectThumbnail}`}
                    alt="project image"
                  />
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    <p className="h5 fw-bold">{property.projectName}</p>
                    <p className="h5 fw-bold text-success">{property.projectPrice}*</p>
                  </div>
                  <div className="pb-2 fw-bold">
                    <FontAwesomeIcon
                      icon={faMapMarker}
                      width={8}
                      color="green"
                    />{" "}
                    {property.projectAddress}
                  </div>
                </div>
              </aside>
            );
          })}
        </Slider>
        <div className="text-center">
          <Link className="btn btn-success" href="/projects">
            View all
          </Link>
        </div>
      </div>
    </>
  );
}
