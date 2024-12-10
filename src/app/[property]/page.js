import axios from "axios";
import Property from "./propertypage";
import "bootstrap/dist/css/bootstrap.min.css";
async function fetchSeoData(slug) {  
  const data = await axios.get(process.env.NEXT_PUBLIC_API_URL + `properties/${slug}`);
  return data;
}
export async function generateMetadata({ params }) {
  const url = await params;  
  const response = await fetchSeoData(url.property);  
  const title = response.data.metaTitle;
  const desc = response.data.metaDescription;
  return { title: title, descritpion: desc };
}
export default async function PropertyPage({ params }) {
  const { property } = params;
  return <Property slug={property} />;
}