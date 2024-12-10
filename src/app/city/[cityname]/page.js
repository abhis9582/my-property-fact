import CityPage from "./citypage";

export default async function AllCityProjects({params}){
    const {cityname} = await params;
    
    return(
        <>
            <CityPage city={cityname}/>
        </>
    )
}