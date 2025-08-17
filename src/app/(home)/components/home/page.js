import DreamProject from "./dream-project/page";
import InsightNew from "./insight/page";
import NewsViews from "./new-views/page";
import SocialFeedPage from "./social-feed/page";
import MpfTopPicks from "../mpfTopPick";
import { Suspense } from "react";
import HeroSection from "../_homecomponents/heroSection";
import dynamic from "next/dynamic";
import axios from "axios";
const FeaturedPage = dynamic(() => import("./featured/page"), {
  suspense: true,
});

const fetchProjectsList = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  const projects = response.data.filter(item => item.status === true);
  return projects || [];
};

export default async function HomePage() {
  const projectsList = await fetchProjectsList();
  try {
    return (
      <>
        {/* Pass props to client component if needed */}
        <HeroSection />

        {/* MPF-top pick section  */}
        <MpfTopPicks />

        {/* Static Sections */}
        <div className="position-relative mt-5">
          {/* insight section  */}
          <h2 className="text-center fw-bold">Insights</h2>
          <InsightNew />

          {/* featured projects section  */}
          <h2 className="fw-bold text-center pt-5 pb-3">Featured Projects</h2>
          <Suspense
            fallback={
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "400px" }}
              >
                Loading Featured...
              </div>
            }
          >
            <FeaturedPage autoPlay={false} projectsList={projectsList} />
          </Suspense>
          {/* dream cities section  */}
          <h2 className="fw-bold text-center pt-5">
            Find your dream property in the city you are searching in
          </h2>
          <DreamProject />

          {/* residential projects section  */}
          <h2 className="fw-bold text-center pt-5 pb-3">
            Explore Our Premier Residential Projects
          </h2>
          <FeaturedPage
            url={"residential"}
            autoPlay={true}
            projectsList={projectsList.filter(
              (project) => project.propertyTypeName === "Residential"
            )}
          />

          {/* commertial projects section  */}
          <h2 className="fw-bold text-center pt-5 pb-3">
            Explore Top Commercial Spaces for Growth
          </h2>
          <FeaturedPage
            url={"commercial"}
            autoPlay={true}
            projectsList={projectsList.filter(
              (project) => project.propertyTypeName === "Commercial"
            )}
          />

          {/* web story section  */}
          <h2 className="fw-bold text-center pt-5">Realty Updates</h2>
          <NewsViews />

          {/* blogs section  */}
          <h2 className="fw-bold text-center pt-5">Investor Education </h2>
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
