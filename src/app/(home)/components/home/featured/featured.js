"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import PropertyContainer from "../../common/page";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { useProjectContext } from "@/app/_global_components/contexts/projectsContext";

export default function Featured({
  type = null,
  url = "",
  allFeaturedProperties = null,
  autoPlay
}) {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const { setProjectData } = useProjectContext();
  // Filter based on type prop
  useEffect(() => {
    if (type === 1 || type === 2) {
      const filtered = Array.isArray(allFeaturedProperties)
        ? allFeaturedProperties.filter((p) => p.propertyType === type)
        : [];
      setFeaturedProperties(filtered);
    } else {
      setFeaturedProperties(
        Array.isArray(allFeaturedProperties) ? allFeaturedProperties : []
      );
    }
    setProjectData(allFeaturedProperties);
  }, [type, allFeaturedProperties]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: autoPlay,
    autoplaySpeed: 5000,
    arrows: autoPlay,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
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
        {false ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "250px" }}
          >
            <LoadingSpinner show={true} />
          </div>
        ) : (
          featuredProperties && (
            <>
              {featuredProperties?.length > 0 && (
                <Slider {...settings}>
                  {featuredProperties.map((item) => (
                    <div key={item.id} className="px-2 pb-3">
                      <PropertyContainer data={item} />
                    </div>
                  ))}
                </Slider>
              )}
            </>
          )
        )}

        {autoPlay && <div className="text-center pt-3">
          <Link
            className="btn btn-success btn-background border-0"
            href={`/projects/${url}`}
          >
            View all
          </Link>
        </div>}
      </div>
    </>
  );
}
