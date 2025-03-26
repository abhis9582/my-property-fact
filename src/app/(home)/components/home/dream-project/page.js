import Image from "next/image";
import Link from "next/link";

export default function DreamProject() {
  const dataArr = [
    {
      id: 1,
      image: "/dream-cities/mumbai.png",
      altTage: "city-mumbai"
    },
  ];
  return (
    <>
      <div className="container my-4">
        <p className="h3 text-center fw-bold">
          Find your dream property in the city you are searching in
        </p>
        <div className="container d-flex flex-wrap gap-3 justify-content-center">
          <div className="my-2">
            <Link href="/city/mumbai">
              <Image
                src="/dream-cities/mumbai.png"
                alt="city-mumbai"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/bangalore">
              <Image
                src="/dream-cities/bangalore.png"
                alt="city-bangalore"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/pune">
              <Image
                src="/dream-cities/pune.png"
                alt="city-mumbai"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/delhi">
              <Image
                src="/dream-cities/delhi.png"
                alt="city-delhi"
                width={300}
                height={180}
              />
            </Link>
          </div>
        </div>
        <div className="container d-flex flex-wrap gap-3 justify-content-center">
          <div className="my-2">
            <Link href="/city/noida">
              <Image
                src="/dream-cities/noida.png"
                alt="city-noida"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/gurugram">
              <Image
                src="/dream-cities/gurugram.png"
                alt="city-gurugram"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/greater-noida">
              <Image
                src="/dream-cities/greater_noida.png"
                alt="city-greater_noida"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="#">
              <Image
                src="/dream-cities/other_city.png"
                alt="city-other_city"
                width={300}
                height={180}
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
