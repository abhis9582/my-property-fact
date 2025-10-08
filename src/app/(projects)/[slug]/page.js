import Property from "./propertypage";
import Footer from "../../(home)/components/footer/page";
import {
  checkIfProjectSlug,
  fetchAllProjects,
  fetchCityData,
  fetchProjectDetailsBySlug,
  fetchProjectTypes,
  isCityTypeUrl,
  isFloorTypeUrl,
} from "@/app/_global_components/masterFunction";
import MasterBHKProjectsPage from "@/app/_global_components/bhk-components/master-bhk-server-component";
import ProjectListByFloorType from "@/app/_global_components/floor-type/projectListByFloorType";
import NotFound from "@/app/not-found";
import FeaturedPage from "@/app/(home)/components/home/featured/page";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const isProjectSlug = await checkIfProjectSlug(slug);
  if (!isProjectSlug) {
    // Case 1: Master BHK listing page
    return {
      title:
        slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) +
        " Flats in India",
      description:
        "Browse apartments, villas, and plots categorized by BHK type. Get detailed price lists, floor plans, and location maps.",
        keywords: [
        slug.replace(/-/g, " ") + " flats",
        "apartments",
        "villas",
        "plots",
        "BHK flats in India",
      ],
    };
  }

  const response = await fetchProjectDetailsBySlug(slug);
  if (!response.projectAddress) {
    response.projectAddress = "";
  }
  return {
    title:
      response.metaTitle +
      " " +
      response.projectAddress +
      " | Price List & Brochure, Floor Plan, Location Map & Reviews",
    description: response.metaDescription,
    keywords: response.metaKeyword
  };
}

export default async function PropertyPage({ params, searchParams }) {
  const { slug } = await params;
  const [cityList, projectTypesList, projectDetail, featuredProjects] =
    await Promise.all([
      fetchCityData(),
      fetchProjectTypes(),
      fetchProjectDetailsBySlug(slug),
      fetchAllProjects(),
    ]);
  const isFloorTypeSlug = await isFloorTypeUrl(slug);
  console.log("floor type", isFloorTypeSlug);
  const isProjectSlug = await checkIfProjectSlug(slug);
  console.log("project type", isProjectSlug);
  const isCitySlug = await isCityTypeUrl(slug);
  console.log("city type", isCitySlug);

  const similarProject = featuredProjects.filter(
              (item) =>
                item.cityName === projectDetail.cityName &&
                item.propertyTypeName === projectDetail.propertyTypeName
                && item.id !== projectDetail.id                
            );
  if (isCitySlug) {
    return <MasterBHKProjectsPage slug={slug} />;
  } else if (isFloorTypeSlug) {
    {
      return <ProjectListByFloorType slug={slug} />;
    }
  } else if (isProjectSlug) {
    return (
      <>
        <Property projectDetail={projectDetail} />
        <div className="container-fluid mb-3">
          {similarProject.length > 0 && <h2 className="text-center mb-4 fw-bold">Similar Projects</h2> }
          <FeaturedPage
            autoPlay={true}
            allFeaturedProperties={similarProject}
            type={'Similar'}
          />
        </div>
        <Footer cityList={cityList} projectTypes={projectTypesList} />
      </>
    );
  } else {
    return <NotFound />;
  }
}
