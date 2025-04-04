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
        <div className="container d-flex flex-wrap gap-3 justify-content-center">
          <div className="my-2">
            <Link href="/city/agra">
              <Image
                src="/dream-cities/agra.jpg"
                alt="city-mumbai"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/bangalore">
              <Image
                src="/dream-cities/bangalore.jpg"
                alt="city-bangalore"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/pune">
              <Image
                src="/dream-cities/kochi.jpg"
                alt="city-mumbai"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/delhi">
              <Image
                src="/dream-cities/delhi_ncr.jpg"
                alt="city-delhi"
                width={300}
                height={180}
              />
            </Link>
          </div>
        </div>
        <div className="container d-flex flex-wrap gap-3 justify-content-center">
          <div className="my-2">
            <Link href="#">
              <Image
                src="/dream-cities/hyderabad.jpg"
                alt="city-noida"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/gurugram">
              <Image
                src="/dream-cities/jaipur.jpg"
                alt="city-gurugram"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="/city/mumbai">
              <Image
                src="/dream-cities/mumbai.jpg"
                alt="city-greater_noida"
                width={300}
                height={180}
              />
            </Link>
          </div>
          <div className="my-2">
            <Link href="#">
              <Image
                src="/dream-cities/chennai.jpg"
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
