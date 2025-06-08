import axios from "axios";
import ManageProjectWalkthrough from "./manageProjectWalkthrough";

//fetch data for this component
const fetchProjects = async () => {
  const apis = [
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}projects/get-all`),
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/get`),
  ];
  const [projectsRes, walkthroughRes] = await Promise.all(apis);
  const list = walkthroughRes.data.map((item, index) => ({
    ...item,
    index: index + 1,
    projectName: item.slugURL.replace(/-/g, " "),
  }));
  return [list, projectsRes.data];
};
export default async function ManageProjectWalkthroughPage() {
  const [list, projectsList] = await fetchProjects();
  return <ManageProjectWalkthrough list={list} projectList={projectsList}/>
}
