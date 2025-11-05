import axios from "axios";
import MarketAnalysis from "./marketAnalysis";

// fetch all localities
const fetchAllLocalities = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    // Return empty array during build if API URL is not defined
    return [];
  }
  try {
    const localities = await axios.get(`${apiUrl}city/all`);
    const res = localities.data.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    return res;
  } catch (error) {
    // Return empty array on error during build
    return [];
  }
};

export default async function MarketAnalysisPage() {
    const localities = await fetchAllLocalities();
  return (
    <div>
      <MarketAnalysis localities={localities}/>
    </div>
  );
}
