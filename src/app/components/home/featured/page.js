"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faLocationCrosshairs, faLocationDot, faMap, faMapLocation, faMapMarked, faMapMarker } from "@fortawesome/free-solid-svg-icons";

export default function Featured() {
  const route = useRouter();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const goToPropertyDetail = (url) => {
    window.open("/"+url, "_blank");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allFeaturedProperties = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}properties/get-brief-detail`
        );
        setFeaturedProperties(allFeaturedProperties.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
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
      <Slider {...settings}>
        {featuredProperties.map((property) => {
          return (
            <aside key={property.id} className="p-4 container">
              <div
                className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container main-container"
                onClick={()=>goToPropertyDetail(property.slugURL)}
              >
                {/* <Image
                  src={`/${tm.img}`}
                  alt={tm.name}
                  width={400}
                  height={400}
                  className="rounded-full mb-4 "
                /> */}
                <img
                  // style={{ width: "100%" }}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${property.projectURL}/${property.image}`}
                  alt="project image"
                />
                <div className="row pb-1">
                  <div className="col-8 text-start">
                    <h5>{property.projectName}</h5>
                  </div>
                  <div className="col-4 text-end">
                    <p>{property.price}</p>
                  </div>
                </div>
                <div>
                  <p><FontAwesomeIcon icon={faMapMarker} width={8} color="green"/> {property.location}</p>
                </div>
              </div>
            </aside>
          );
        })}
        {/* {db.testimonial.map((tm, i) => {
          return (
            <aside key={i} className="p-4 container">
              <div
                className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container main-container"
                onClick={goToPropertyDetail}
              >
                <p className="text-base text-darkGray text-center mt-6 mb-8">
                  {tm.message}
                </p>
                <Image
                  src={`/${tm.img}`}
                  alt={tm.name}
                  width={400}
                  height={400}
                  className="rounded-full mb-4 "
                />
                <div className="row pb-1">
                  <div className="col-8 text-start">
                    <h5>{tm.name}</h5>
                  </div>
                  <div className="col-4 text-end">
                    <p>{tm.location}</p>
                  </div>
                </div>
              </div>
            </aside>
          );
        })} */}
      </Slider>
    </>
  );
}
