import axios from "axios";
import ManageProjectWalkthrough from "./manageProjectWalkthrough";
import { fetchAllProjects } from "@/app/_global_components/masterFunction";
export const dynamic = "force-dynamic";
//fetch data for this component
const fetchProjects = async () => {
  const projectResponse = await fetchAllProjects();
  const walkthroughResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/get`,
  );
  const list = walkthroughResponse.data.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return [list, projectResponse];
};
export default async function ManageProjectWalkthroughPage() {
  const [list, projectsList] = await fetchProjects();
  const projectWithWalkthrough = list.map((item) => item.projectId);
  return (
    <ManageProjectWalkthrough
      list={list}
      projectList={projectsList}
      projectWithWalkthrough={projectWithWalkthrough}
    />
  );
}
