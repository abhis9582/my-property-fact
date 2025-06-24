import axios from "axios";
import PropertyRageAndTrend from "./propertyRateAndTrend";
import indiaInsight from "../../_global_components/insight-india-data.json";
// fetching all cities
const fetchAllCities = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/all`);
  return response.data;
}

export default async function PropertyRateAndTrendPage() {
  const allCities = await fetchAllCities();
  return (
    <PropertyRageAndTrend cityList = {allCities} insightData = {indiaInsight}/>
  );
}
