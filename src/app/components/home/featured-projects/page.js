import dynamic from "next/dynamic";
import db from "@/db/latest-project.json";
import Image from "next/image";

// Dynamically import Slider without SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function FeaturedProjects() {
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
        {db.testimonial.map((tm, i) => (
          <aside key={i} className="p-4 container">
            <div className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-center container">
              <p className="text-base text-darkGray text-center mt-6 mb-8">
                {tm.message}
              </p>
              <Image
                src={`/${tm.img}`}  // Make sure this path is correct
                alt={tm.name}
                width={400}
                height={400}
                className="rounded-full mb-4"
              />
              <div className="row text-center">
                <div className="col-8">
                  <p className="h4 mb-3">{tm.name}</p>
                </div>
                <div className="col-4 mb-3">{tm.location}</div>
              </div>
            </div>
          </aside>
        ))}
      </Slider>
      <div className="d-flex justify-content-center">
        <button className="mb-4 btn btn-primary border rounded">View All</button>
      </div>
    </>
  );
}
