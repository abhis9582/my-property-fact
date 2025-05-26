import axios from "axios";
import ManageProjectAbout from "./manageProjectAbout";

//Fetching all projects list
const fetchProjects = async () => {
  const projectResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
  );
  return projectResponse.data;
};

//Fetching all project's about list
const fetchProjectsAbout = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-about/get`
  );
  const res = response.data;
  const list = res.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return list;
};
export default async function ManageProjectAboutPage() {
  const [list, projectsList] = await Promise.all([
    fetchProjectsAbout(),
    fetchProjects()
  ]);
  return <ManageProjectAbout list={list} projectsList={projectsList} />
}
