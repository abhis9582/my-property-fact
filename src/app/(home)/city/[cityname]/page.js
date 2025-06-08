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
  const { cityname } = await params;
  const cityData = await fetchSeoData(cityname);
  return {
    title: cityData.metaTitle,
    description: cityData.metaDescription,
  };
}

// Main page component
export default async function AllCityProjects({ params }) {
  const { cityname } = await params;

  // Fetch both in parallel
  const [cityData, projectsList] = await Promise.all([
    fetchSeoData(cityname),
    fetchProperties(cityname),
  ]);

  return (
    <CityPage cityData={cityData} projectsList={projectsList} />
  );
}
