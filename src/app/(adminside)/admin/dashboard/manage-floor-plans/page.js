import axios from "axios";
import ManageFloorPlans from "./manageFloorPlans";
export const dynamic = 'force-dynamic';
//Fetching all floor plans from api
const fetchAllFloorPlans = async () => {
  const floorPlans = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}floor-plans/get-all`
  );
  const list = floorPlans.data.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return list;
};

//Fetching all projects list from api
const fetchProjects = async () => {
  const projectResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );

  const sortedProjects = projectResponse.data.sort((a, b) => {
    const nameA = a.projectName.toLowerCase();
    const nameB = b.projectName.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });  
  return sortedProjects;
};

export default async function ManageFloorPlansPage() {
  const [list, projectList] = await Promise.all([
    fetchAllFloorPlans(),
    fetchProjects()
  ]);
  return <ManageFloorPlans list={list} projectsList={projectList} />
}
