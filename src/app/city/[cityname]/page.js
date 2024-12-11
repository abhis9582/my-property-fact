import CityPage from "./citypage";
import axios from "axios";
async function fetchSeoData(slug) {
  const data = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `city/get/${slug}`
  );
  return data;
}
export async function generateMetadata({ params }) {    
  const url = await params;
  console.log("fgd",url);
  const response = await fetchSeoData(url.cityname);  
  const title = response.data.metaTitle;
  const desc = response.data.metaDescription;
  console.log(response);
  return { title: title, descritpion: desc };
}
export default async function AllCityProjects({params}){
    const {cityname} = await params;
    
    return(
        <>
            <CityPage city={cityname}/>
        </>
    )
}