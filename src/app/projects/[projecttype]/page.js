import Header from "@/app/components/header/page";
import PropertyPage from "./propertypage";
import Footer from "@/app/components/footer/page";
import axios from "axios";

async function fetchSeoData(slug) {
  const data = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `project-types/get/${slug}`
  );
  return data;
}
export async function generateMetadata({ params }) {
  const url = await params;  
  const response = await fetchSeoData(url.projecttype);  
  const title = response.data.metaTitle;
  const desc = response.data.metaDesc;
  return { title: title, descritpion: desc };
}

export default async function ProjectType({ params }) {
  const { projecttype } = await params;
  return (
    <>
      <Header />
      <PropertyPage type={projecttype} />
      <Footer />
    </>
  );
}
