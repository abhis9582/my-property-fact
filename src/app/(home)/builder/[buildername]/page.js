import axios from "axios";
import BuilderPage from "./builderpage";

//Fetching all details of builder
async function fetchBuilderDetails(slug) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}builders/get/${slug}`
  );
  return response.data;
}

//Fetching all projects of the builder
const fetchProjectsListOfBuilder = async (id) => {
  const projects = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/builder/${id}`
  );
  return projects.data;
};

//Generating metatitle and meta description
export async function generateMetadata({ params }) {
  const response = await fetchBuilderDetails(params.buildername);
  return {
    title: response.metaTitle,
    descritpion: response.metaDescription
  };
}

export default async function Builder({ params }) {
  const { buildername } = await params;
  const builderDetails = await fetchBuilderDetails(buildername);
  const projectsList = await fetchProjectsListOfBuilder(builderDetails.id);

  return <BuilderPage builderDetails={builderDetails} projectsList={projectsList} />

}
