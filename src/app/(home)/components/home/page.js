import ClientSideHomePage from "./homepage";
import DreamProject from "./dream-project/page";
import InsightNew from "./insight/page";
import NewsViews from "./new-views/page";
import SocialFeedPage from "./social-feed/page";
import MpfTopPicks from "../mpfTopPick";
import { Suspense } from "react";
import FeaturedPage from "./featured/page";

export default async function HomePage() {
  try {
    //calling apis
    const [projectTypeListRes, cityListRes, projectsList] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}city/all`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`),
    ]);

    const projectTypeList = await projectTypeListRes.json();
    const cityList = await cityListRes.json();
    const list = await projectsList.json();
    return (
      <>
        {/* Pass props to client component if needed */}
        <ClientSideHomePage
          projectTypeList={projectTypeList}
          cityList={cityList}
        />

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
            <FeaturedPage
              allFeaturedProperties={list.filter(
                (item) => item.status != false
              )}
              autoPlay={false}
            />
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
            type={1}
            url={"residential"}
            allFeaturedProperties={list.filter((item) => item.status != false)}
            autoPlay={true}
          />

          {/* commertial projects section  */}
          <h2 className="fw-bold text-center pt-5 pb-3">
            Explore Top Commercial Spaces for Growth
          </h2>
          <FeaturedPage
            type={2}
            url={"commercial"}
            allFeaturedProperties={list.filter((item) => item.status != false)}
            autoPlay={true}
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
