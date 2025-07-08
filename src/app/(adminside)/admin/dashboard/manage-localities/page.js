import axios from "axios";
import ManageLocality from "./manageLocalities";
export const dynamic = 'force-dynamic';
// fetch all cities 
const fetchAllCities = async () => {
    const city = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}city/get-all-cities`);
    return city.data;
}

// fetch all cities 
const fetchAllLocalities = async () => {
    const localities = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}locality/get-all`);
    const res = localities.data.map((item, index) => ({
        ...item,
        index: index + 1
    }));
    return res;
}

// fetch all cities 
const fetchAllProjectTypes = async () => {
    const localities = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`);
    const res = localities.data.map((item, index) => ({
        ...item,
        index: index + 1
    }));
    return res;
}

export default async function ManageLocalityPage() {
    const cityList = await fetchAllCities();
    const localityList = await fetchAllLocalities();
    const typeList = await fetchAllProjectTypes();
    return (
        <>
            <ManageLocality cityList={cityList} localityList={localityList} typeList={typeList}/>
        </>
    )
}