import axios from "axios";
import ManageProjectWalkthrough from "./manageProjectWalkthrough";
export const dynamic = 'force-dynamic';
//fetch data for this component
const fetchProjects = async () => {
  const apis = [
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}projects/all-projects`),
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/get`),
  ];
  const [projectsRes, walkthroughRes] = await Promise.all(apis);
  const list = walkthroughRes.data.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return [list, projectsRes.data];
};
export default async function ManageProjectWalkthroughPage() {
  const [list, projectsList] = await fetchProjects();
  const projectWithWalkthrough = list.map(item => item.projectId);
  return <ManageProjectWalkthrough list={list} projectList={projectsList} projectWithWalkthrough={projectWithWalkthrough}/>
}
