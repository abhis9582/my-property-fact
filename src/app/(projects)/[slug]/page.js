import axios from "axios";
import Property from "./propertypage";
import Footer from "../../(home)/components/footer/page";
import Featured from "../../(home)/components/home/featured/featured";
import {
  checkIfProjectSlug,
  fetchAllProjects,
  fetchCityData,
  fetchProjectDetailsBySlug,
  fetchProjectTypes,
  isCityTypeUrl,
  isFloorTypeUrl,
} from "@/app/_global_components/masterFunction";
import MasterBHKProjectList from "@/app/_global_components/bhk-components/master-bhk-project-list";
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
  if (isCitySlug) {
    return <MasterBHKProjectsPage slug={slug} />;
  } else if (isFloorTypeSlug) {
    {
      return <ProjectListByFloorType slug={slug} />;
    }
  } else if (isProjectSlug) {
    return (
      <>
        {/* cityName */}
        <Property projectDetail={projectDetail} />
        <div className="container-fluid mb-3">
          <h2 className="text-center mb-4 fw-bold">Similar projects</h2>
          {/* <Featured
            allFeaturedProperties={featuredProjects.filter(
              (item) =>
                item.cityName === projectDetail.cityName &&
                item.propertyTypeName === projectDetail.propertyTypeName
            )}
          /> */}
          <FeaturedPage
            autoPlay={true}
            allFeaturedProperties={featuredProjects.filter(
              (item) =>
                item.cityName === projectDetail.cityName &&
                item.propertyTypeName === projectDetail.propertyTypeName
            )}
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
