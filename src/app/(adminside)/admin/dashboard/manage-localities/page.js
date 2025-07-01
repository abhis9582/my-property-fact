import axios from "axios";
import ManageLocality from "./manageLocalities";
export const dynamic = 'force-dynamic';
// fetch all cities 
const fetchAllCities = async () => {
    const city = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/get-all-cities`);
    return city.data;
}

export default async function ManageLocalityPage() {
    const cityList = await fetchAllCities();
    return (
        <>
            <ManageLocality cityList={cityList}/>
        </>
    )
}