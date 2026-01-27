import NewsViews from "./new-views/page";
import SocialFeedPage from "./social-feed/page";
import MpfTopPicks from "../mpfTopPick";
import HeroSection from "../_homecomponents/heroSection";
import FeaturedPage from "./featured/page";
import {
  fetchCityData,
  fetchProjectTypes,
  getAllProjects,
  getWeeklyProject,
  fetchBuilderData,
} from "@/app/_global_components/masterFunction";
import NewInsight from "../_homecomponents/NewInsight";
import DreamPropertySection from "./dream-project/DreamPropertySection";
import NewMpfMetaDataContainer from "../_homecomponents/NewMpfMetaDataContainer";
import SocialFeedsOfMPF from "../_homecomponents/SocialFeedsOfMPF";
import PopularCitiesSection from "./popular-cities/PopularCitiesSection";
import NoidaProjectsSection from "./noida-projects/NoidaProjectsSection";

export default async function HomePage() {
  // Fetching all projects with short details
  const projects = await getAllProjects();

  // Allowed slugs for featured projects
  const allowedSlugs = [
    "m3m-jacob-and-co-residences",
    "eldeco-whispers-of-wonder",
    "ace-edit",
  ];

  // Fetching citylist and project types and storing in variables
  const [cityList, projectTypeList, builders] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
    fetchBuilderData(),
  ]);

  // Filtering only featured projects from projects list
  const featuredProjects = projects.filter((project) => {
    if (!project.slugURL) return false;
    return allowedSlugs.includes(project.slugURL);
  });

  // Filtering residential projects from projects list
  const residentalProjects = projects
    .filter((project) => project.propertyTypeName === "Residential")
    .slice(0, 9);

  // Filtering commercial projects from projects list
  const commercialProjects = projects
    .filter((project) => project.propertyTypeName === "Commercial")
    .slice(0, 9);

  // Getting weekly project from projects list
  const mpfTopPicProject = await getWeeklyProject(projects);

  try {
    return (
      <>
        {/* Hero section component  */}
        <HeroSection projectTypeList={projectTypeList} cityList={cityList} />

        {/* My property fact meta data container component */}
        <NewMpfMetaDataContainer propertyTypes={projectTypeList} projects={projects} builders={builders.builders} cities={cityList} />

        {/* MPF-top pick section  */}
        <MpfTopPicks topProject={mpfTopPicProject} />

        {/* Static Sections */}
        <div className="position-relative">
          {/* Insight section  */}
          <NewInsight />

          {/* featured projects section  */}
          <FeaturedPage
            title="Featured Projects"
            type="Featured"
            autoPlay={false}
            allFeaturedProperties={featuredProjects}
          />
          {/* dream cities section  */}
          <DreamPropertySection />

          {/* residential projects section  */}
          <FeaturedPage
            title="Explore Our Premier Residential Projects"
            autoPlay={true}
            allFeaturedProperties={residentalProjects}
          />

          {/* commertial projects section  */}
          <FeaturedPage
            title="Explore Top Commercial Spaces for Growth"
            autoPlay={true}
            allFeaturedProperties={commercialProjects}
          />

          {/* web story section  */}
          <NewsViews title="Realty Updates Web Stories" />

          {/* Top projects container on home page */}
          <NoidaProjectsSection />

          {/* Latest blogs from our blog section */}
          <SocialFeedPage />

          {/* Social feeds from instagram and facebook */}
          <SocialFeedsOfMPF />

          {/* Popular cities section on home page  */}
          <PopularCitiesSection />
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
