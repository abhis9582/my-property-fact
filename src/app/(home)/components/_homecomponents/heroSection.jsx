import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import SearchFilter from "./searchFIlter";
import "../home/home.css";
//Fetching all projects type
const projectTypes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
  );
  return response.data;
};

//Fetching all cities type
const allCitis = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}city/all`
  );
  return response.data;
};

export default async function HeroSection() {
  //Our facts
  const ourFacts = [
    {
      id: 1,
      numbers: "50+",
      text: "Cities",
    },
    {
      id: 2,
      numbers: "80+",
      text: "Builders",
    },
    {
      id: 3,
      numbers: "500+",
      text: "Projects",
    },
    {
      id: 4,
      numbers: "10,000+",
      text: "Units",
    },
  ];

  const [cityList, projectTypeList] = await Promise.all([
    allCitis(),
    projectTypes(),
  ]);
  return (
    <>
      <div className="position-relative mb-5">
        <div
          className="overflow-hidden"
          style={{ minHeight: "474px !important" }}
        >
          <div className="position-relative overflow-hidden">
            <picture className="position-relative home-banner">
              {/* Mobile Image */}
              <source
                srcSet="/mpf-mobile-banner.jpg"
                media="(max-width: 426px)"
              />

              {/* Tablet Image */}
              <source
                srcSet="/mpf-tablet-banner.jpg"
                media="(max-width: 1199px)"
              />

              {/* Default (Desktop) Image */}
              <Image
                src="/mpf-banner.jpg"
                alt="My property fact"
                width={1920}
                height={600}
                className="img-fluid"
                priority
              />
            </picture>
          </div>
          {/* <div className="overlay"></div> */}
        </div>
        <div className="bannercontainer">
          <h1 className="text-center text-light fw-bold">
            Find the best property
          </h1>
          <div className="d-flex flex-wrap align-item-center justify-content-center gap-4 my-4">
            {projectTypeList.map((item, index) => (
              <div key={`row-${index}`}>
                <Link
                  href={`projects/${item.slugUrl}`}
                  className="link-btn rounded-5 py-2 px-3 text-white home-property-types font-gotham-light fw-bold"
                >
                  {item.projectTypeName}
                </Link>
              </div>
            ))}
          </div>
          <div className="data-container">
            {ourFacts.map((item, index) => (
              <div
                key={`${item.text}-${index}`}
                className="data-container-child"
              >
                <section>
                  <h3 className="m-0">
                    <span>{item.numbers}</span>
                  </h3>
                  <p className="text-center ">{item.text}</p>
                </section>
              </div>
            ))}
          </div>
        </div>
        <div className="position-relative">
          <SearchFilter projectTypeList={projectTypeList} cityList={cityList} />
        </div>
      </div>
    </>
  );
}
