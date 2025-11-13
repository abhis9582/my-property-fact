import DreamProject from "./dream-project/page";
import InsightNew from "./insight/page";
import NewsViews from "./new-views/page";
import SocialFeedPage from "./social-feed/page";
import MpfTopPicks from "../mpfTopPick";
import HeroSection from "../_homecomponents/heroSection";
import FeaturedPage from "./featured/page";
import InstagramFeed from "./instagram-feed";
import ScrollToTop from "../_homecomponents/ScrollToTop";
import {
  getAllProjects,
  getWeeklyProject,
} from "@/app/_global_components/masterFunction";
import NewInsight from "../_homecomponents/NewInsight";

export default async function HomePage() {
  const projects = await getAllProjects();
  const allowedSlugs = [
    "m3m-jacob-and-co-residences",
    "eldeco-whispers-of-wonder",
    "ace-edit",
  ];
  const featuredProjects = projects.filter((project) => {
    if (!project.slugURL) return false;
    return allowedSlugs.includes(project.slugURL);
  });
  const residentalProjects = projects
    .filter((project) => project.propertyTypeName === "Residential")
    .slice(0, 9);
  const commercialProjects = projects
    .filter((project) => project.propertyTypeName === "Commercial")
    .slice(0, 9);
  const mpfTopPicProject = await getWeeklyProject(projects);
  try {
    return (
      <>
        {/* Pass props to client component if needed */}
        <HeroSection />

        {/* MPF-top pick section  */}
        <MpfTopPicks topProject={mpfTopPicProject} />

        {/* Static Sections */}
        <div className="position-relative">
          {/* insight section  */}
          {/* <h2 className="text-center fw-bold my-5">Insights</h2> */}
          {/* <InsightNew /> */}
          <NewInsight />

          {/* featured projects section  */}
          <h2 className="text-center my-5 fw-bold">Featured Projects</h2>
          <FeaturedPage
            autoPlay={false}
            allFeaturedProperties={featuredProjects}
          />
          {/* dream cities section  */}
          <h2 className="text-center my-5 fw-bold">
            Find your dream property in the city you are searching in
          </h2>
          <DreamProject />

          {/* residential projects section  */}
          <h2 className="text-center mt-4 mb-5 fw-bold">
            Explore Our Premier Residential Projects
          </h2>
          <FeaturedPage
            autoPlay={true}
            allFeaturedProperties={residentalProjects}
          />

          {/* commertial projects section  */}
          <h2 className="text-center my-5 fw-bold">
            Explore Top Commercial Spaces for Growth
          </h2>
          <FeaturedPage
            autoPlay={true}
            allFeaturedProperties={commercialProjects}
          />

          {/* web story section  */}
          <h2 className="text-center my-5 fw-bold">Realty Updates</h2>
          <NewsViews />

          {/* blogs section  */}
          <h2 className="text-center my-5 fw-bold">Investor Education </h2>
          <SocialFeedPage />
          {/* <div className="mb-5">
            <InstagramFeed />
          </div> */}
        </div>
        {/* Scroll to top button */}
        <ScrollToTop />
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
