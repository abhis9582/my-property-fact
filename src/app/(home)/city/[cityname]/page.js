import CityPage from "./citypage";
import axios from "axios";

// Fetch SEO data by city slug
async function fetchSeoData(slug) {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/get/${slug}`);
  return data;
}

// Fetch properties of a particular city
async function fetchProperties(citySlug) {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/${citySlug}`);
  return data;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const cityData = await fetchSeoData(params.cityname);
  return {
    title: cityData.metaTitle,
    description: cityData.metaDescription,
  };
}

// Main page component
export default async function AllCityProjects({ params }) {
  const citySlug = params.cityname;

  // Fetch both in parallel
  const [cityData, projectsList] = await Promise.all([
    fetchSeoData(citySlug),
    fetchProperties(citySlug),
  ]);

  return (
    <CityPage cityData={cityData} projectsList={projectsList} />
  );
}
