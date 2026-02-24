import Image from "next/image";
import dynamic from "next/dynamic";
import SearchFilter from "./searchFIlter";
import "../home/home.css";

const HeroBannerSlider = dynamic(() => import("./HeroBannerSlider"), {
  ssr: true,
  loading: () => (
    <div className="hero-banner-slider hero-lcp-fallback" aria-busy="true">
      <div className="position-relative home-banner hero-banner-responsive-images">
        <Image
          src="/static/banners/Irish_phone.jpg"
          alt="Irish - Laying Foundation For Tomorrow"
          width={768}
          height={430}
          className="img-fluid w-100 d-md-none"
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
        />
        <Image
          src="/static/banners/Irish_tablet.jpg"
          alt="Irish - Laying Foundation For Tomorrow"
          width={1024}
          height={576}
          className="img-fluid w-100 d-none d-md-block d-lg-none"
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
        />
        <Image
          src="/static/banners/Irish_desktop.jpg"
          alt="Irish - Laying Foundation For Tomorrow"
          width={1920}
          height={600}
          className="img-fluid w-100 d-none d-lg-block"
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
        />
      </div>
    </div>
  ),
});

export default async function HeroSection({ projectTypeList, cityList }) {
  const heroSlides = [
    {
      id: "hero-irish",
      desktop: "/static/banners/Irish_desktop.jpg",
      tablet: "/static/banners/Irish_tablet.jpg",
      mobile: "/static/banners/Irish_phone.jpg",
      alt: "Irish - Laying Foundation For Tomorrow",
      href: `${process.env.NEXT_PUBLIC_UI_URL}/irish-platinum`,
    },
    {
      id: "hero-eldeco",
      desktop: "/static/banners/new_eldeco_desktop.jpg",
      tablet: "/static/banners/eldeco_tablet.jpg",
      mobile: "/static/banners/eldeco_phone.jpg",
      alt: "Eldeco",
      href: `${process.env.NEXT_PUBLIC_UI_URL}/eldeco-7-peaks-residences`,
    },
    {
      id: "hero-ghd",
      desktop: "/static/banners/ghd_laptop.jpg",
      tablet: "/static/banners/ghd_tablet.jpg",
      mobile: "/static/banners/ghd_phone.jpg",
      alt: "GHD Group - Velvet Vista",
      href: `${process.env.NEXT_PUBLIC_UI_URL}/ghd-velvet-vista`,
    },
    {
      id: "hero-saya",
      desktop: "/static/banners/new_saya_dekstop.jpg",
      tablet: "/static/banners/saya_tablet.jpg",
      mobile: "/static/banners/new_saya_mobile.jpg",
      alt: "Saya - Relationships Forever",
      href: `${process.env.NEXT_PUBLIC_UI_URL}/saya-gold-avenue`,
    },
  ];

  return (
    <>
      <div className="position-relative hero-section-wrapper">
        <div className="mpf-hero-banner position-relative">
          <div className="position-relative">
            {/* LCP: first slide rendered as priority image; slider loads after */}
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
