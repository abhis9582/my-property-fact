import axios from "axios";
import Property from "./propertypage";
import FeaturedPage from "../(home)/components/home/featured/page";
import Footer from "../(home)/components/footer/page";

async function fetchSeoData(slug) {
  const data = await axios.get(process.env.NEXT_PUBLIC_API_URL + `projects/get/${slug}`);
  return data;
}

const fetchAllData = async () => {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  // Creating an array of API promises
  const apiCalls = [
    axios.get(`${apiBase}projects/get/${slug}`),
    axios.get(`${apiBase}floor-plans/get/${slug}`),
    axios.get(`${apiBase}project-amenity/get/${slug}`),
    axios.get(`${apiBase}location-benefit/get/${slug}`),
    axios.get(`${apiBase}project-gallery/get/${slug}`),
    axios.get(`${apiBase}project-walkthrough/get/${slug}`),
    axios.get(`${apiBase}project-faqs/get/${slug}`),
    axios.get(`${apiBase}project-about/get/${slug}`),
    axios.get(`${apiBase}project-banner/get/${slug}`),
  ];

  // Await all API responses
  const [
    projectRes,
    floorPlansRes,
    amenitiesRes,
    benefitsRes,
    galleryRes,
    walkthroughRes,
    faqsRes,
    aboutRes,
    bannerRes,
  ] = await Promise.all(apiCalls);

  // Set state after fetching all data
  setProjectDetail(projectRes.data);
  setFloorPlanList(floorPlansRes.data);
  setAmenities(amenitiesRes.data);
  setBenefitList(benefitsRes.data);
  setGalleryList(galleryRes.data);
  setWalkthrough(walkthroughRes.data);
  setFaqs(faqsRes.data);
  setAboutData(aboutRes.data);
  setBannerData(bannerRes.data);
};

export async function generateMetadata({ params }) {
  const response = await fetchSeoData(params.property);
  return {
    title: response.data.metaTitle,
    description: response.data.metaDescription
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
  const { property } = params;
  const [list, typesList] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes()
  ]);
  return (
    <>
      <Property slug={property} />
      <div className="container shadow-lg bg-white rounded-4 mt-3 py-5 mb-3">
        <h2 className="text-center">Similar projects</h2>
        <FeaturedPage />
      </div>
      <Footer cityList={list} projectTypes={typesList} />
    </>
  );
}