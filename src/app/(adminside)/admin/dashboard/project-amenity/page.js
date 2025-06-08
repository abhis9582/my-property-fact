import axios from "axios";
import ProjectsAmenity from "./projectAmenity";

//Fetch all project list from api
const fetchProjects = async () => {
  const projectResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  const res = projectResponse.data.map((item, index)=> ({
    ...item,
    index: index + 1,
    amenitiesName: item.amenities.map((item)=> (item.title))
  }))  
  return res;
};

//Fetch all project list from api
const fetchAmenityList = async () => {
  const projectResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}amenity/get-all`
  );
  return projectResponse.data;
};

export default async function ProjectsAmenityPage() {
  const [projectsList, amenityList] = await Promise.all([
    fetchProjects(),
    fetchAmenityList()
  ]);
  return <ProjectsAmenity projectList={projectsList} amenityList={amenityList} />
}
