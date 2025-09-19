import { fetchAllProjects, getAllProjects } from "@/app/_global_components/masterFunction";
import Featured from "./featured";

export default async function FeaturedPage({
  url,
  autoPlay,
  projectsList = [],
  category
}) {
  const projects = await getAllProjects();
  console.log(projects.filter(item=> item.propertyTypeName === category).length, "featured projects length");
  
  return (
    <>
      <Featured
        // allFeaturedProperties={projects}
        url={url}
        allProjects={category ? projects.filter(item=> item.propertyTypeName === category).slice(0, 20) : projects.slice(0, 3)} // Display only first 6 projects
        autoPlay={autoPlay}
      />
    </>
  );
}
