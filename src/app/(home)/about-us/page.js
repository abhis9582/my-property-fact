"use client";
import "./aboutus.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
import { Pagination, Navigation } from 'swiper/modules';

export default function AboutUs() {
  //Defining what we offer array
  const whatWeOffer = [
    {
      id: 1,
      heading: "Diverse Property Listings",
      text: "We curate listings from all corners of the real estate spectrum. Residential apartments, commercial showrooms, industrial plots, farmhouses, and everything in between."
    },
    {
      id: 2,
      heading: "Powerful Search & Shortlisting",
      text: "We curate listings from all corners of the real estate spectrum. Residential apartments, commercial showrooms, industrial plots, farmhouses, and everything in between."
    },
    {
      id: 3,
      heading: "Side-by-Side Comparisons",
      text: "We curate listings from all corners of the real estate spectrum. Residential apartments, commercial showrooms, industrial plots, farmhouses, and everything in between."
    },
    {
      id: 4,
      heading: "Direct Connection to Builders & Brokers",
      text: "We curate listings from all corners of the real estate spectrum. Residential apartments, commercial showrooms, industrial plots, farmhouses, and everything in between."
    },
    {
      id: 5,
      heading: "Insights for Every Stakeholder",
      text: "We curate listings from all corners of the real estate spectrum. Residential apartments, commercial showrooms, industrial plots, farmhouses, and everything in between."
    },
  ];

  //Our commitment object
  const ourCommitment = {
    heading: "Our Commitment",
    text: "We’re committed to transparency, innovation, and reliability. By harnessing the power of technology and a dedicated support team, we aim to make the entire real estate journey—from initial search to final closing—as smooth and rewarding as possible."
  };

  //Defining why my property fact array
  const whyMyPropertyFact = [
    {
      id: 1,
      heading: "Holistic Platform",
      text: "Find everything from residential rentals to large-scale commercial investments in one place."
    },
    {
      id: 2,
      heading: "Streamlined Searches",
      text: "Use our intuitive Search and View features to quickly locate the best matches for your requirements."
    },
    {
      id: 3,
      heading: "No Guesswork",
      text: "Our side-by-side comparison feature and detailed project listings remove confusion from the decision-making process."
    },
    {
      id: 4,
      heading: "Trusted Connections",
      text: "We link you directly to builders, brokers, and fellow investors—fostering real conversations and genuine opportunities."
    },
    {
      id: 5,
      heading: "Continuous Growth",
      text: "My Property Fact constantly expands its listings and features so users always have the latest offerings at their fingertips."
    },
  ];
  return (
    <>
      <CommonHeaderBanner image={"about-us.jpg"} headerText={"About Us"}/>
      <CommonBreadCrum pageName={"About Us"} />
      <div className="container">
        <div className="row gap-5 justify-content-center">
          <div className="col-md-5 about-us-container custom-shadow">
            <h1 className="text-center my-5">About Us</h1>
            <p>
              Welcome to My Property Fact, your go-to platform for discovering the perfect real estate opportunities. Whether you’re an investor hunting for the next big project, a business owner scouting commercial space, or a family looking for a new home to call your own. We bring together all types of properties, from high-end apartments and cozy farmhouses to strategic commercial plots and premium office spaces for both buying and renting.
            </p>
          </div>
          <div className="col-md-5 about-us-container custom-shadow">
            <h1 className="text-center my-5">Our Story & Vision</h1>
            <p>
              At My Property Fact, we believe in simplifying real estate decisions for everyone. Navigating the property market can be overwhelming, so we created a comprehensive portal that puts all the critical information right at your fingertips. Our mission is to empower you with transparent, data-driven insights and user-friendly tools so you can explore, compare, and choose the best real estate option for your unique needs.
            </p>
          </div>
        </div>
        <div>
          <h1 className="text-center mt-5">What We Offer</h1>
          <Swiper
            autoplay={{ delay: 3000 }}
            spaceBetween={30}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 10 }, // Mobile (small screens)
              640: { slidesPerView: 2, spaceBetween: 20 }, // Tablets
              1024: { slidesPerView: 3, spaceBetween: 30 }, // Laptops and larger screens
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {whatWeOffer.map((item, index) => (
              <SwiperSlide className="border border-2 p-5 rounded-3 my-5 custom-shadow" key={`${item.id}-${index}`}>
                <h2 className="text-center my-4">{item.heading}</h2>
                <p>{item.text}</p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          <h1 className="text-center">Why My Property Fact?</h1>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {whyMyPropertyFact.map((item, index) => (
              <div key={`${item.id}-${index}`} className="why-mpf-card border rounded-3 custom-shadow">
                <h3 className="my-3">{item.heading}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="my-3">{ourCommitment.heading}</h1>
          <p>{ourCommitment.text}</p>
          <hr />
          <p>
            Join us at www.mypropertyfact.com and discover a new way to explore real estate. Whether you are buying, renting, or investing, My Property Fact is here to help you make your next move with confidence.
          </p>
        </div>
      </div >
    </>
  );
}
