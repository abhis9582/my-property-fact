import ClientSideHomePage from "./homepage";
import DreamProject from "./dream-project/page";
import InsightNew from "./insight/page";
import NewsViews from "./new-views/page";
import Featured from "./featured/featured";
import SocialFeedPage from "./social-feed/page";
import MpfTopPicks from "../mpfTopPick";

export default async function HomePage() {
  try {
    //calling apis
    const [projectTypeListRes, cityListRes, projectsList] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`, {
        cache: "force-cache",
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}city/all`, {
        cache: "force-cache",
      }),
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`,
        { cache: "force-cache" }
      ),
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
          <Featured allFeaturedProperties={list} />

          {/* dream cities section  */}
          <h2 className="fw-bold text-center pt-5">
            Find your dream property in the city you are searching in
          </h2>
          <DreamProject />

          {/* residential projects section  */}
          <h2 className="fw-bold text-center pt-5 pb-3">
            Explore Our Premier Residential Projects
          </h2>
          <Featured type={1} url={"residential"} allFeaturedProperties={list} />

          {/* commertial projects section  */}
          <h2 className="fw-bold text-center pt-5 pb-3">
            Explore Top Commercial Spaces for Growth
          </h2>
          <Featured type={2} url={"commercial"} allFeaturedProperties={list} />

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
