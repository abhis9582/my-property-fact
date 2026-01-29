"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./featured.css";
import Image from "next/image";
import Link from "next/link";
import PropertyContainer from "../../common/page";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      type="button"
      className={`${className} custom-featured-arrow custom-featured-arrow-next`}
      style={style}
      onClick={onClick}
      aria-label="Next slide"
    >
      <Image
        src="/icon/arrow-right-s-line.svg"
        alt="Next"
        width={32}
        height={32}
      />
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      type="button"
      className={`${className} custom-featured-arrow custom-featured-arrow-prev`}
      style={style}
      onClick={onClick}
      aria-label="Previous slide"
    >
      <Image
        src="/icon/arrow-left-s-line.svg"
        alt="Previous"
        width={32}
        height={32}
      />
    </button>
  );
}

export default function Featured({
  url = "",
  autoPlay,
  allProjects,
  type,
  badgeVariant = "default",
  title
}) {
  const settings = {
    dots: false,
    infinite: allProjects.length > 1,
    speed: 500,
    autoplay: autoPlay,
    autoplaySpeed: 5000,
    arrows: autoPlay,
    nextArrow: autoPlay ? <NextArrow /> : null,
    prevArrow: autoPlay ? <PrevArrow /> : null,
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
      <h2 className="text-center my-4 my-lg-5 fw-bold plus-jakarta-sans-bold">{title}</h2>
      {allProjects?.length > 0 && (
        <div className="featured-page-slider">
          <Slider {...settings}>
            {allProjects.map((item) => (
              <div key={item.id} className="px-2 pb-3">
                <PropertyContainer data={item} badgeVariant={badgeVariant} />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {autoPlay && type !== 'Similar' && (
        <div className="text-center pt-3">
          <Link
            className="btn text-white btn-normal-color border-0"
            href={`/projects/${url}`}
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
