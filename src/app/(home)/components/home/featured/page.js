import axios from "axios";
import Featured from "./featured";
export const dynamic = 'force-dynamic';
//Fetching all projects
const fetchAllProjects = async () => {
  const allFeaturedProperties = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );  
  return allFeaturedProperties.data;
};

export default async function FeaturedPage() {
  const projectsList = await fetchAllProjects();
  return (
    <Featured allFeaturedProperties={projectsList} />
  )
}
