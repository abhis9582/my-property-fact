import NewsViews from "./new-views/page";
import SocialFeedPage from "./social-feed/page";
import TopPicksWithRotation from "../TopPicksWithRotation";
import HeroSection from "../_homecomponents/heroSection";
import FeaturedPage from "./featured/page";
import {
  fetchCityData,
  fetchProjectTypes,
  getAllProjects,
  fetchTopPicksProject,
  fetchBuilderData,
} from "@/app/_global_components/masterFunction";
import NewInsight from "../_homecomponents/NewInsight";
import DreamPropertySection from "./dream-project/DreamPropertySection";
import NewMpfMetaDataContainer from "../_homecomponents/NewMpfMetaDataContainer";
import SocialFeedsOfMPF from "../_homecomponents/SocialFeedsOfMPF";
import PopularCitiesSection from "./popular-cities/PopularCitiesSection";
import NoidaProjectsSection from "./noida-projects/NoidaProjectsSection";
// import NoidaProjectsSection from "./noida-projects/NoidaProjectsSection";

export default async function HomePage() {
  // Fetching all projects with short details
  const projects = await getAllProjects();

  // Allowed slugs for featured projects
  const allowedSlugs = [
    "eldeco-7-peaks-residences",
    "eldeco-whispers-of-wonder",
    "eldeco-camelot",
  ];

  // Residential project slugs for "Explore Our Premier Residential Projects"
  const residentialSlugs = [
    "saya-gold-avenue",
    "eldeco-7-peaks-residences",
    "ghd-velvet-vista",
    "irish-platinum",
  ];

  // Commercial project slugs for "Explore Top Commercial Spaces"
  const commercialSlugs = [
    "saya-piazza",
    "gulshan-one29",
    "exotica-132",
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

  // Residential: slug-ordered first, then rest from getAllProjects (Residential type)
  const residentialFirst = residentialSlugs
    .map((slug) => projects.find((p) => p.slugURL === slug))
    .filter(Boolean);
  const residentialRest = projects.filter(
    (p) =>
      p.propertyTypeName === "Residential" &&
      p.slugURL &&
      !residentialSlugs.includes(p.slugURL)
  );
  const residentialProjects = [...residentialFirst, ...residentialRest];

  // Commercial: slug-ordered first, then rest from getAllProjects (Commercial type)
  const commercialFirst = commercialSlugs
    .map((slug) => projects.find((p) => p.slugURL === slug))
    .filter(Boolean);
  const commercialRest = projects.filter(
    (p) =>
      p.propertyTypeName === "Commercial" &&
      p.slugURL &&
      !commercialSlugs.includes(p.slugURL)
  );
  const commercialProjects = [...commercialFirst, ...commercialRest];

  // Top Picks: projects from selected builders only, rotates every 30s (testing)
  const mpfTopPicProject = await fetchTopPicksProject();

  try {
    return (
      <>
        {/* Hero section component  */}
        <HeroSection projectTypeList={projectTypeList} cityList={cityList} />

        {/* My property fact meta data container component */}
        <NewMpfMetaDataContainer
          propertyTypes={projectTypeList}
          projects={projects}
          builders={builders.builders}
          cities={cityList}
        />

        {/* MPF-top pick section (refreshes every 30s on client) */}
        <TopPicksWithRotation initialProject={mpfTopPicProject} />

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

          {/* Residential + Commercial in one section with tabs */}
          <div className="container">
            <FeaturedPage
              title="Explore Our Premier Residential Projects"
              autoPlay={true}
              allFeaturedProperties={[]}
              residentialProjects={residentialProjects}
              commercialProjects={commercialProjects}
            />
          </div>

          {/* web story section  */}
          <NewsViews title="Realty Updates Web Stories" />

          {/* Top projects container on home page */}
          <NoidaProjectsSection cities={cityList} />

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
