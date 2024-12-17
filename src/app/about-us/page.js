"use client";
import Link from "next/link";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import "./aboutus.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// import required modules
import { EffectCoverflow, Pagination } from "swiper/modules";

export default function AboutUs() {
  return (
    <>
      <Header />
      <div className="container-fluid mt-5 p-0 m-0">
        <div>
          <img
            src="https://www.starestate.com/assets/images/about-us.jpg"
            alt="about-us-banner"
          />
        </div>
        <div className="w-100 mt-3">
          <div className="container-lg">
            <div className="breadcrumbContainer" aria-label="breadcrumb">
              <ol className="breadcrumb p-3">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">About Us</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="container">
          <div className="row mt-3">
            <div className="col-md-8">
              <p className="mt-5">
                When an artist creates a masterpiece, a writer pens a novel, an
                actor takes center stage, and a sculptor chisels a statue, a
                sublime story unfolds with time and admiration. Similarly, in
                the realm of Mr. Ritesh Malik, we embarked on a journey in 2012
                to curate India's most exceptional real estate investments. We
                understand the aspirations of the new-age royals, thus, we
                assist them with handpicked bouquets of premium properties to
                accomplish a regal lifestyle. For us, contented clients are the
                biggest testaments as we sense accomplishment in unlocking the
                right real estate asset via the client-centric work approach.
                Our in-house group of experts streamlines promising practices to
                ascend performance in the competitive market to maintain the
                benchmark work standard. With real estate giants and investors
                counting on us, we are elated to be a catalyst of refined real
                estate investment experience provider across India. With
                passionate real estate professionals from top B-schools as the
                backbone, we are becoming more ambitious and are zestful to push
                boundaries leaving no stone unturned to establish a benchmark in
                the Indian property market.
              </p>
            </div>
            <div className="col-md-4">
              <div className="overview-stats">
                <div className="inner position-relative overflow-hidden h-100">
                  <div className="row gap-row">
                    <div className="col-xl-12 overview-logo">
                      <span className="h6 fw-bolder text-uppercase">
                        Every result tells a unique story.
                      </span>
                    </div>
                    <div className="col-xl-12 col-lg-3 col-sm-6 col-6 statBox">
                      <div className="stats-in">
                        <span className="h2 text-texture">
                          <span className="counter">12</span>
                          <small>+</small>
                        </span>
                        <p>Years of Experience</p>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-3 col-sm-6 col-6 statBox">
                      <div className="stats-in">
                        <span className="h2 text-texture">
                          <span className="counter">40000</span>
                          <small>+</small>
                        </span>
                        <p>Units Booked</p>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-3 col-sm-6 col-6 statBox">
                      <div className="stats-in">
                        <span className="h2 text-texture">
                          <span className="counter">100000</span>
                          <small>+</small>
                        </span>
                        <p>Happy Faces</p>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-3 col-sm-6 col-6 statBox">
                      <div className="stats-in">
                        <span className="h2 text-texture">
                          <span className="counter">100</span>
                          <small>mln+</small>
                        </span>
                        <p>Area Sold (Sq.ft)</p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="https://www.starestate.com/assets/images/card-bg.jpg"
                    className="h-100 object-cover stats-bg"
                    alt="bg image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-4" />
      <div className="container-fluid">
        <div className="container p-3">
          <p className="text-center h2">Vision</p>
          <p className="mt-3 text-center">
            For us, the sky is not the limit. Our next milestone is global
            expansion, which we are working to achieve in the coming years. From
            our Indian roots to global property market expansion across
            continents, we confidently envision a seamless growth journey.
          </p>
        </div>
      </div>
      <div className="container-fluid mt-5 bg-light">
        <p className="text-center h2 pt-4">From Director's Desk</p>
        <div className="container">
          <div className="row">
            <div className="col-4 p-4">
              <img
                src="https://ritzmediaworld.in/wp-content/uploads/2024/12/2-8.png"
                alt="director image"
                width={100}
              />
            </div>
            <div className="col-8 mt-5">
              Mr. Ritesh Malik is a visionary leader with the fortitude to make
              the real estate experience fantastic for every investor. His
              intuitive understanding of evolving demands in the property market
              attributable to diverse reasons is the secret to fulfilling
              promises. He is the pillar of strength, inspiration, and a guiding
              light for the entire organisation which has a mammoth presence
              across India. Our go-getter approach paves the way to win against
              all the odds to overcome opportunities and set a benchmark of
              success in the market. Mr. Ritesh Malik's empathetic leadership
              inspires achievers and serves as a guiding light for our team. We
              are thankful to our stakeholders, employees, and clients for
              believing in us and being a part of our growth story. Over the
              decade-long journey, we won many accolades that propel us to be
              more determined and disciplined to delivering real estate services
              while adhering to our uncompromising values.
              <p className="h5 mt-4">
                Mr. Ritesh Malik <br /> Managing Director, My Property Fact
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid bg-dark p-5">
        <p className="h2 text-center text-light mb-3">Awards</p>
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          loop={true} // Add this line to enable infinite looping
          modules={[EffectCoverflow, Pagination]}
        >
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
          </SwiperSlide>
        </Swiper>
      </div>
      <Footer />
    </>
  );
}
