import axios from "axios";
import Property from "./propertypage";
import Footer from "../(home)/components/footer/page";
import Featured from "../(home)/components/home/featured/featured";
export const dynamic = "force-dynamic";
const fetchProjectDetail = async (slug) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get/${slug}`
  );
  return response.data;
};

export async function generateMetadata({ params }) {
  const { property } = await params;
  const response = await fetchProjectDetail(property);
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
//Fetching all list from api
const fetchCityData = async () => {
  const cityResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}city/all`
  );
  return cityResponse.data;
};

// Fetching project type
const fetchProjectTypes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
  );
  return response.data;
};

//Fetching all projects
const fetchAllProjects = async () => {
  const allFeaturedProperties = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  return allFeaturedProperties.data;
};
export default async function PropertyPage({ params }) {
  const { property } = await params;
  const [cityList, projectTypesList, projectDetail, featuredProjects] =
    await Promise.all([
      fetchCityData(),
      fetchProjectTypes(),
      fetchProjectDetail(property),
      fetchAllProjects(),
    ]);
  return (
    <>
      <Property projectDetail={projectDetail} />
      <div className="container-fluid mb-3">
        <h2 className="text-center mb-4 fw-bold">Similar projects</h2>
        <Featured allFeaturedProperties={featuredProjects} />
      </div>
      <Footer cityList={cityList} projectTypes={projectTypesList} />
    </>
  );
}