import Link from "next/link";
import SearchFilter from "./searchFIlter";
import AnimatedCounter from "./AnimatedCounter";
import HeroBannerSlider from "./HeroBannerSlider";
import "../home/home.css";
import {
  fetchAllProjects,
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
} from "@/app/_global_components/masterFunction";
export default async function HeroSection() {
  const totalProjects = await fetchAllProjects();
  const cities = await fetchCityData();
  const builders = await fetchBuilderData();
  //Our facts
  const ourFacts = [
    {
      id: 1,
      numbers: `${cities.length}+`,
      text: "Cities",
    },
    {
      id: 2,
      numbers: `${builders.builders.length}+`,
      text: "Builders",
    },
    {
      id: 3,
      numbers: `${totalProjects.length}+`,
      text: "Projects",
    },
    {
      id: 4,
      numbers: "10,030+",
      text: "Units",
    },
  ];

  const heroSlides = [
    {
      id: "hero-primary",
      desktop: "/static/banners/desktop_banner1.jpeg",
      tablet: "/static/banners/tablet_banner1.jpg",
      mobile: "/static/banners/mobile_banner1.jpg",
      alt: "Find the best property with My Property Fact",
      priority: true,
      href: "/m3m-jacob-and-co-residences",
    },
    {
      id: "hero-secondary",
      desktop: "/static/banners/desktop_banner2.jpg",
      tablet: "/static/banners/tablet_banner2.jpg",
      mobile: "/static/banners/mobile_banner2.jpg",
      alt: "Discover top real estate projects across India",
      href: "#",
    },
    // {
    //   id: "hero-secondary",
    //   desktop: "/static/banners/desktop_banner3.jpg",
    //   tablet: "/static/banners/tablet_banner2.jpg",
    //   mobile: "/static/banners/mobile_banner2.jpg",
    //   alt: "Discover top real estate projects across India",
    // },
    // {
    //   id: "hero-secondary",
    //   desktop: "/static/banners/desktop_banner4.jpg",
    //   tablet: "/static/banners/tablet_banner4.jpg",
    //   mobile: "/static/banners/mobile_banner4.jpg",
    //   alt: "Discover top real estate projects across India",
    // },
  ];

  const [cityList, projectTypeList] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
  ]);
  return (
    <>
      <div className="position-relative mb-5">
        <div className="mpf-hero-banner position-relative">
          <div className="position-relative">
              {/* <SnowEffect /> */}
              {/* <NewYearEffect /> */}
            <HeroBannerSlider slides={heroSlides} />
            <div className="bannercontainer">
              <h1 className="text-center text-light">Find the best property</h1>
              <div className="d-flex flex-wrap align-item-center justify-content-center gap-4 my-4">
                {projectTypeList.map((item, index) => (
                  <div key={`row-${index}`}>
                    <Link
                      href={`projects/${item.slugUrl}`}
                      className="link-btn rounded-5 py-2 px-3 text-white text-decoration-none"
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
                        <span>
                          <AnimatedCounter
                            targetValue={item.numbers}
                            suffix="+"
                          />
                        </span>
                      </h3>
                      <p className="text-center ">{item.text}</p>
                    </section>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="overlay"></div> */}
          <SearchFilter projectTypeList={projectTypeList} cityList={cityList} />
        </div>
      </div>
    </>
  );
}
