import axios from "axios";
import ManageFaqs from "./manageFaq";
//fetching all projects list
const fetchProjects = async () => {
  const projectResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
  );
  return projectResponse.data;
};
//Fetch all faq list
const fetchFaqs = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-faqs/get-all`
  );
  const res = response.data;
  const list = res.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return list;
};
export default async function ManageFaqsPage() {
  const [list, projectsList] = await Promise.all([
    fetchFaqs(),
    fetchProjects()
  ]);
  return <ManageFaqs list={list} projectsList={projectsList} />
}
