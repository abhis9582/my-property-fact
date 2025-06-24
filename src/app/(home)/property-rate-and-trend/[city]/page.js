import axios from "axios";
import PropertyRateAndTrendByCity from "./propertyRateAndTrendByCity";
import indiaInsight from "../../../_global_components/insight-india-data.json";
// fetching all cities
const fetchAllCities = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/all`);
    return response.data;
}
export default async function PropertyRateAndTrendByCityPage({ params }) {
    const allCities = await fetchAllCities();
    const { city } = await params;
    const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const insightsArray = [
        {
            title: `Micromarket Average Price in ${capitalizeFirst(city)}`,
            data: indiaInsight[`microMarketAveragePriceForCity${capitalizeFirst(city)}`],
        },
        {
            title: `Most Active Localities in ${capitalizeFirst(city)}`,
            data: indiaInsight[`mostActiveLocalitiesForCity${capitalizeFirst(city)}`],
        },
        {
            title: `Top Selling Projects by Transactions in ${capitalizeFirst(city)}`,
            data: indiaInsight[`topSellingProjectsByTransactionsForCity${capitalizeFirst(city)}`],
        },
        {
            title: `Top Selling Projects by Value in ${capitalizeFirst(city)}`,
            data: indiaInsight[`topSellingProjectsByValueForCity${capitalizeFirst(city)}`],
        },
        {
            title: `Top Developers by Transactions in ${capitalizeFirst(city)}`,
            data: indiaInsight[`topDevelopersByTransactionsForCity${capitalizeFirst(city)}`],
        },
        {
            title: `Top Developers by Value in ${capitalizeFirst(city)}`,
            data: indiaInsight[`topDevelopersByValueForCity${capitalizeFirst(city)}`],
        },
    ];    
    return (
        <PropertyRateAndTrendByCity cityList={allCities}
            insightArray={insightsArray}
            cityName={capitalizeFirst(city)}
        />
    )
}