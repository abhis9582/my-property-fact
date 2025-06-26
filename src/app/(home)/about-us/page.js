import CommonBreadCrum from "../components/common/breadcrum";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import AboutUs from "./aboutUs";

export const metadata = {
  title: "About Us | MyPropertyFact – Real Estate Price Trends & Insights",
  description: "Discover the story behind MyPropertyFact – your trusted source for accurate real estate price trends, market insights, and property data across major Indian cities.",
}

export default function AboutUsPage() {
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
      <CommonHeaderBanner image={"about-us.jpg"} headerText={"About Us"} />
      <CommonBreadCrum pageName={"About Us"} />
      <AboutUs
        whyMyPropertyFact={whyMyPropertyFact}
        whatWeOffer={whatWeOffer}
        ourCommitment={ourCommitment}
      />
    </>
  );
}
