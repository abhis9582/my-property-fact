"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PropertyContainer from "../../common/page";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";

export default function Featured({ type = null, url= "" }) {
  const [allFeaturedProperties, setAllFeaturedProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allFeaturedProperties = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
        );
        setAllFeaturedProperties(allFeaturedProperties.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  // Filter based on type prop
  useEffect(() => {
    if (type === "1" || type === "2") {
      const filtered = allFeaturedProperties.filter(
        (p) => p.propertyType === type
      );
      setFeaturedProperties(filtered);
    } else {
      setFeaturedProperties(allFeaturedProperties);
    }
  }, [type, allFeaturedProperties]);

  const settings = {
    dots: false,
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
      <div className="container">
        {loading ? <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}><LoadingSpinner show={loading} /></div> : featuredProperties &&
          <>{featuredProperties?.length > 0 && (
            <Slider {...settings}>
              {featuredProperties.map((item) => (
                <div key={item.id} className="px-2 pb-3">
                  <PropertyContainer data={item} />
                </div>
              ))}
            </Slider>
          )}</>
        }

        <div className="text-center pt-3">
          <Link className="btn btn-success btn-background border-0" href={`/projects/${url}`}>
            View all
          </Link>
        </div>
      </div>
    </>
  );
}
