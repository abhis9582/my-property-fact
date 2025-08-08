import axios from "axios";
import Footer from "./footer";

const fetchCityData = async () => {
  try {
    const cityResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    return cityResponse.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Fetching project type
const fetchProjectTypes = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function FooterPage() {
  const [cityList, projectTypes] = await Promise.all([
    fetchCityData(),
    fetchProjectTypes(),
  ]);
  return <Footer cityList={cityList} projectTypes={projectTypes} />;
}
