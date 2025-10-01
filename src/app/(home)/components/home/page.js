import DreamProject from "./dream-project/page";
import InsightNew from "./insight/page";
import NewsViews from "./new-views/page";
import SocialFeedPage from "./social-feed/page";
import MpfTopPicks from "../mpfTopPick";
import HeroSection from "../_homecomponents/heroSection";
import FeaturedPage from "./featured/page";

export default function HomePage() {
  try {
    return (
      <>
        {/* Pass props to client component if needed */}
        <HeroSection />

        {/* MPF-top pick section  */}
        <MpfTopPicks />

        {/* Static Sections */}
        <div className="position-relative">
          {/* insight section  */}
          <h2 className="text-center fw-bold my-4">Insights</h2>
          <InsightNew />

          {/* featured projects section  */}
          <h2 className="text-center my-4 fw-bold">Featured Projects</h2>
          <FeaturedPage autoPlay={false}/>
          {/* dream cities section  */}
          <h2 className="text-center my-4 fw-bold">
            Find your dream property in the city you are searching in
          </h2>
          <DreamProject />

          {/* residential projects section  */}
          <h2 className="text-center my-1 mb-4 fw-bold">
            Explore Our Premier Residential Projects
          </h2>
          <FeaturedPage autoPlay={true} category={'Residential'}/>

          {/* commertial projects section  */}
          <h2 className="text-center my-4 fw-bold">
            Explore Top Commercial Spaces for Growth
          </h2>
          <FeaturedPage autoPlay={true} category={'Commercial'}/>

          {/* web story section  */}
          <h2 className="text-center my-4 fw-bold">Realty Updates</h2>
          <NewsViews />

          {/* blogs section  */}
          <h2 className="text-center my-4 fw-bold">Investor Education </h2>
          <SocialFeedPage />
        </div>
      </>
    );
  } catch (error) {
    return (
      <div>
        <h1>Failed to load data</h1>
        <p>The server might be down or unreachable.</p>
      </div>
    );
  }
}
