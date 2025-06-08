import PropertyPage from "./propertypage";
import axios from "axios";

//Fetching details of project type 
const fetchProjectTypeDetail = async (slug) => {
  const data = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `project-types/get/${slug}`
  );
  return data.data;
}

//Fetching projects list from project type
const fetchProjectsList = async (type) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/${type}`
  );
  return response.data;
};

//Generating metatitle and meta description
export async function generateMetadata({ params }) {
  const { projecttype } = await params;
  const response = await fetchProjectTypeDetail(projecttype);
  return {
    title: response.metaTitle,
    descritpion: response.metaDesc
  };
}

export default async function ProjectType({ params }) {
  const { projecttype } = await params;
  const [projectTypeDetail, projectsList] = await Promise.all([
    fetchProjectTypeDetail(projecttype),
    fetchProjectsList(projecttype)
  ]);

  return <PropertyPage projectTypeDetails={projectTypeDetail} projectsList={projectsList} />
}
