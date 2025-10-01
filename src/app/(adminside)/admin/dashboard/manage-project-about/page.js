import axios from "axios";
import ManageProjectAbout from "./manageProjectAbout";
export const dynamic = "force-dynamic";
//Fetching all projects list
const fetchProjects = async () => {
  const projectResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  const projects = projectResponse.data;
  const projectAbout = await fetchProjectsAbout();
  const aboutProjectIds = projectAbout.map((item) => item.projectId);
  const projectsWithoutAbout = projects.filter(
    (project) => !aboutProjectIds.includes(project.id)
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
    fetchProjects(),
  ]);
  const projectIdsWithAbout = list.map(about => about.projectId);
  return <ManageProjectAbout list={list} projectsList={projectsList} projectIdsWithAbout= {projectIdsWithAbout}/>;
}
