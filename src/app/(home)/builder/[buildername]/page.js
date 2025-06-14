import axios from "axios";
import BuilderPage from "./builderpage";

//Fetching all details of builder
async function fetchBuilderDetail(slug) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}builder/get/${slug}`
  );
  return response.data;
}

//Generating metatitle and meta description
export async function generateMetadata({ params }) {
  const { buildername } = await params;
  const response = await fetchBuilderDetail(buildername);
  return {
    title: response.metaTitle,
    descritpion: response.metaDescription
  };
}

export default async function Builder({ params }) {
  const { buildername } = await params;
  const builderDetail = await fetchBuilderDetail(buildername);  
  return <BuilderPage builderDetail={builderDetail} />
}
