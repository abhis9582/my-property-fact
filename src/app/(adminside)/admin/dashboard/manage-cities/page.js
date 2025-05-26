import axios from "axios";
import City from "./manageCity";

//Fetching all cities from api
const fetchCities = async () => {
  const cityList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}city/get-all-cities`
  );
  const response = cityList.data.map((item, index) => ({
    ...item,
    index: index + 1
  }));  
  return response;
}

export default async function CityPage() {
  const cityList = await fetchCities();
  return <City list={cityList} />
}
