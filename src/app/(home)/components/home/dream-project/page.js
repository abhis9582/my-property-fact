"use client";
import Image from "next/image";
import Link from "next/link";
import "./dreamcity.css";
export default function DreamProject() {

  //Cities json data
  const cities = [
    {
      name: "Agra",
      link: "/city/agra",
      image: "/dream-cities/agra.jpg",
      alt: "city-agra"
    },
    {
      name: "Bangalore",
      link: "/city/bangalore",
      image: "/dream-cities/bangalore.jpg",
      alt: "city-bangalore"
    },
    {
      name: "Noida",
      link: "/city/noida",
      image: "/dream-cities/noida.jpg",
      alt: "city-noida"
    },
    {
      name: "Delhi",
      link: "/city/delhi",
      image: "/dream-cities/delhi.jpg",
      alt: "city-delhi"
    },
    {
      name: "Ghaziabad",
      link: "/city/ghaziabad",
      image: "/dream-cities/ghaziabad.jpg",
      alt: "city-ghaziabad"
    },
    {
      name: "Jaipur",
      link: "/city/jaipur",
      image: "/dream-cities/jaipur.jpg",
      alt: "city-jaipur"
    },
    {
      name: "Mumbai",
      link: "/city/mumbai",
      image: "/dream-cities/mumbai.jpg",
      alt: "city-mumbai"
    },
    {
      name: "Gurugram",
      link: "/city/gurugram",
      image: "/dream-cities/gurugram.jpg",
      alt: "city-gurugram"
    }
  ];
  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          {cities.map((city, index) => (
            <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 py-3 d-flex justify-content-center">
              <div className="city-flip-container">
                <div className="city-flip-inner">
                  <div className="city-flip-front">
                    <Link href={city.link}>
                      <Image
                        src={city.image}
                        alt={city.alt}
                        width={300}
                        height={180}
                        className="img-fluid rounded shadow-sm"
                      />
                    </Link>
                  </div>
                  <div className="city-flip-back">
                    <Link href={city.link}>
                      <Image
                        src={city.image} // Add backImage to your city object
                        alt={`Back of ${city.alt}`}
                        width={300}
                        height={180}
                        className="img-fluid rounded shadow-sm"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
