"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import { useEffect } from "react";
import Link from "next/link";
import PropertyContainer from "../../common/page";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { useProjectContext } from "@/app/_global_components/contexts/projectsContext";

export default function Featured({
  url = "",
  allFeaturedProperties = null,
  autoPlay,
  allProjects,
}) {
  const { setProjectData } = useProjectContext();

  useEffect(() => {
    setProjectData(allProjects);
  }, [allProjects]);

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
    <div className="container">
      {false ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "250px" }}
        >
          <LoadingSpinner show={true} />
        </div>
      ) : (
        allFeaturedProperties?.length > 0 && (
          <>
            <Slider {...settings}>
              {allFeaturedProperties.map((item) => (
                <div key={item.id} className="px-2 pb-3">
                  <PropertyContainer data={item} />
                </div>
              ))}
            </Slider>
          </>
        )
      )}

      {autoPlay && (
        <div className="text-center pt-3">
          <Link
            className="btn btn-success btn-background border-0"
            href={`/projects/${url}`}
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
