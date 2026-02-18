import Image from "next/image";
import SearchFilter from "./searchFIlter";
import HeroBannerSlider from "./HeroBannerSlider";
import "../home/home.css";
export default async function HeroSection({ projectTypeList, cityList }) {
  // Hero banners sliders meta data (desktop / tablet / mobile per slide)
  const heroSlides = [
    {
      id: "hero-irish",
      desktop: "/static/banners/Irish_desktop.jpg",
      tablet: "/static/banners/Irish_tablet.jpg",
      mobile: "/static/banners/Irish_phone.jpg",
      alt: "Irish - Laying Foundation For Tomorrow",
      href: "https://mypropertyfact.in/irish-platinum",
    },
    {
      id: "hero-eldeco",
      desktop: "/static/banners/new_eldeco_desktop.jpg",
      tablet: "/static/banners/eldeco_tablet.jpg",
      mobile: "/static/banners/eldeco_phone.jpg",
      alt: "Eldeco",
      href: "https://mypropertyfact.in/eldeco-7-peaks-residences",
    },
    {
      id: "hero-ghd",
      desktop: "/static/banners/ghd_laptop.jpg",
      tablet: "/static/banners/ghd_tablet.jpg",
      mobile: "/static/banners/ghd_phone.jpg",
      alt: "GHD Group - Velvet Vista",
      href: "https://mypropertyfact.in/ghd-velvet-vista",
    },
    {
      id: "hero-saya",
      desktop: "/static/banners/new_saya_dekstop.jpg",
      tablet: "/static/banners/saya_tablet.jpg",
      mobile: "/static/banners/new_saya_mobile.jpg",
      alt: "Saya - Relationships Forever",
      href: "https://mypropertyfact.in/saya-gold-avenue",
    },
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
            {/* <div className="hero-center-emblem">
              <Image
                src="/static/banners/ch.svg"
                alt="Republic Day emblem"
                width={280}
                height={280}
                priority
              />
            </div> */}
          </div>

          {/* Search filter component  */}
          <SearchFilter projectTypeList={projectTypeList} cityList={cityList} />
        </div>
      </div>
    </>
  );
}
