import axios from "axios";
import Property from "./propertypage";
import FeaturedPage from "../(home)/components/home/featured/page";
import Footer from "../(home)/components/footer/page";

const fetchProjectDetail = async (slug) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}projects/get/${slug}`);
  return response.data;
};

export async function generateMetadata({ params }) {
  const {property} = await params;
  const response = await fetchProjectDetail(property);
  if (!response.projectAddress) {
    response.projectAddress = "";
  }
  return {
    title: response.metaTitle + " " + response.projectAddress + " | Price List & Brochure, Floor Plan, Location Map & Reviews",
    description: response.metaDescription
  }
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

export default async function PropertyPage({ params }) {
  const { property } = await params;
  const [cityList, projectTypesList, projectDetail] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
    fetchProjectDetail(property)
  ]);
  return (
    <>
      <Property projectDetail={projectDetail} />
      <div className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3">
        <h2 className="text-center">Similar projects</h2>
        <FeaturedPage />
      </div>
      <Footer cityList={cityList} projectTypes={projectTypesList} />
    </>
  );
}