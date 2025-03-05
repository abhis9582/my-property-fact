import axios from "axios";
import BuilderPage from "./builderpage";

async function fetchSeoData(slug) {
  const data = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `builders/get/${slug}`
  );
  return data;
}
export async function generateMetadata({ params }) {
  const url = await params;  
  const response = await fetchSeoData(url.buildername);
  const title = response.data.metaTitle;
  const desc = response.data.metaDescription;
  return { title: title, descritpion: desc };
}

export default async function Builder({ params }) {
  const { buildername } = await params;
  return (
    <>
      <BuilderPage builderName={buildername} />
    </>
  );
}
