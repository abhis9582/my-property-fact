"use client";
import Image from "next/image";
import db from "@/db/latest-project.json";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Featured() {
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
        {db.testimonial.map((tm, i) => {
          return (
            <aside key={i} className="p-4 container">
              <div className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container">
                <p className="text-base text-darkGray text-center mt-6 mb-8">
                  {tm.message}
                </p>
                <Image
                  src={`/${tm.img}`}
                  alt={tm.name}
                  width={400}
                  height={400}
                  className="rounded-full mb-4"
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
        })}
      </Slider>
    </>
  );
}
