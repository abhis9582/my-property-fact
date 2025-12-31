import axios from "axios";
import LocationBenefit from "./locationBenefit";
export const dynamic = 'force-dynamic';

//Fetching all benefits list
const fetchAllBenefits = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}location-benefit/get-all`
  );
  const res = response.data;
  const list = res.map((item, index) => ({
    ...item,
    index: index + 1,
    id: item.projectId
  }));  
  return list;
};

//Fetching all projects list
const fetchProjects = async () => {
  const projectResponse = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "projects/all-projects"
  );  
  return projectResponse.data;
};
export default async function LocationBenefitPage() {
  const [list, projectsList] = await Promise.all([
    fetchAllBenefits(),
    fetchProjects()
  ]);
  return <LocationBenefit list={list} projectList={projectsList} />
}
