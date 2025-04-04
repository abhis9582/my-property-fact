"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PropertyContainer from "../../common/page";

export default function Featured() {
  const [featuredProperties, setFeaturedProperties] = useState([]);

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
        breakpoint: 768,
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
        {featuredProperties?.length > 0 && (
          <Slider {...settings}>
            {featuredProperties.map((item) => (
              <div key={item.id} className="px-2">
                <PropertyContainer data={item} />
              </div>
            ))}
          </Slider>
        )}

        <div className="text-center mt-5">
          <Link className="btn btn-success" href="/projects">
            View all
          </Link>
        </div>
      </div>
    </>
  );
}
