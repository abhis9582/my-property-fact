import Slider from "react-slick";
import db from "@/db/latest-project.json";
import Image from "next/image";

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
        {db.testimonial.map((tm, i) => {
          return (
            <aside key={i} className="p-4 container">
              <div className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container">
                {/* <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 559.27 546.15"
                  className="w-10 h-10 fill-green"
                >
                  <path d="M336.63,250.54V33.44H553.71v217.1S587.7,503,364.37,512.71V392s85.76,35.63,74.55-141.49Z" />
                  <path d="M3.71,250.54V33.44H220.79v217.1S254.78,503,31.46,512.71V392S117.21,427.66,106,250.54Z" />
                </svg> */}
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
                <div className="row text-center">
                  <div className="col-8">
                    <p className="h4 mb-3">{tm.name}</p>
                  </div>
                  <div className="col-4 mb-3">{tm.location}</div>
                </div>
              </div>
            </aside>
          );
        })}
      </Slider>
      <div className="d-flex justify-content-center">
            <button className="mb-4 btn btn-primary border border-radius">View All</button>
      </div>
    </>
  );
}
