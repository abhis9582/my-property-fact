import PropertyPage from "./propertypage";
import axios from "axios";
export const dynamic = 'force-dynamic';
//Fetching details of project type 
const fetchProjectTypeDetails = async (slug) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get/${slug}`
  );
  return response.data;
}

//Generating metatitle and meta description
export async function generateMetadata({ params }) {
  const { projecttype } = await params;
  const response = await fetchProjectTypeDetails(projecttype);
  return {
    title: response.metaTitle,
    descritpion: response.metaDesc,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_ROOT_URL}${projecttype}`,
    },
  };
}

export default async function ProjectType({ params }) {
  const { projecttype } = await params;
  const [projectTypeDetail] = await Promise.all([
    fetchProjectTypeDetails(projecttype)
  ]);  
  return <PropertyPage projectTypeDetails={projectTypeDetail} />
}
