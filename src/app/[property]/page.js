import axios from "axios";
import Property from "./propertypage";

async function fetchSeoData(slug) {
  const data = await axios.get(process.env.NEXT_PUBLIC_API_URL + `projects/get/${slug}`);
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