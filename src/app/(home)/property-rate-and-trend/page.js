import axios from "axios";
import PropertyRageAndTrend from "./propertyRateAndTrend";
import indiaInsight from "../../_global_components/insight-india-data.json";
// fetching all cities
const fetchAllCities = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/all`);
  return response.data;
}
const insightsArray = [
  {
    title: `City average price in India`,
    data: indiaInsight.cityAveragePriceInIndia,
  },
  {
    title: `Top gainer localities in India`,
    data: indiaInsight.highestPriceAppreciationInIndia,
  },
  {
    title: `Most active localities by transaction in India`,
    data: indiaInsight.mostActiveLocalitiesInIndia,
  },
  {
    title: `Most active localities by value in India`,
    data: indiaInsight.mostActiveLocalitiesByValue,
  },
  {
    title: `Top developers by transaction in India`,
    data: indiaInsight.topDevelopersByTransactionsInIndia,
  },
  {
    title: `Top developers by value in India`,
    data: indiaInsight.topDevelopersByValueInIndia,
  },
];

export default async function PropertyRateAndTrendPage() {
  const allCities = await fetchAllCities();
  return (
    <PropertyRageAndTrend cityList={allCities} insightsArray={insightsArray} />
  );
}
