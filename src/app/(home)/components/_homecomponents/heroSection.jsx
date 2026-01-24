import Image from "next/image";
import SearchFilter from "./searchFIlter";
import HeroBannerSlider from "./HeroBannerSlider";
import "../home/home.css";
export default async function HeroSection({ projectTypeList, cityList }) {
  // Hero banners sliders meta data
  const heroSlides = [
    {
      id: "hero-primary",
      className: "hero-republic-26",
      desktop: "/static/banners/26_republic.png",
      tablet: "/static/banners/republic_new_tablet.png",
      mobile: "/static/banners/new_repu.jpg",
      alt: "Find the best property with My Property Fact",
      priority: true,
      href: "#",
    },
    // {
    //   id: "hero-secondary",
    //   desktop: "/static/banners/desktop_banner2.jpg",
    //   tablet: "/static/banners/tablet_banner2.jpg",
    //   mobile: "/static/banners/mobile_banner2.jpg",
    //   alt: "Discover top real estate projects across India",
    //   href: "#",
    // },
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

  return (
    <>
      <div className="position-relative">
        <div className="mpf-hero-banner position-relative">
          <div className="position-relative">
            {/* Snow effect component on hero banner   */}
            {/* <SnowEffect /> */}
            {/* New year effect component on hero banner  */}
            {/* <NewYearEffect /> */}
            {/* Banners conatiner component on hero section*/}
            <HeroBannerSlider slides={heroSlides} />
            {/* Republic day emblem component on hero section*/}
            <div className="hero-center-emblem">
              <Image
                src="/static/banners/ch.svg"
                alt="Republic Day emblem"
                width={280}
                height={280}
                priority
              />
            </div>
          </div>

          {/* Search filter component  */}
          <SearchFilter projectTypeList={projectTypeList} cityList={cityList} />
        </div>
      </div>
    </>
  );
}
