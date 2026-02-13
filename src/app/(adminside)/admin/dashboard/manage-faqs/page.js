import axios from "axios";
import ManageFaqs from "./manageFaq";
import { fetchAllProjects } from "@/app/_global_components/masterFunction";
//fetching all projects list
export const dynamic = 'force-dynamic';
const fetchProjects = async () => {
  const projectResponse = await fetchAllProjects();
  return projectResponse;
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
    id: item.projectId,
    noOfFaqs: item.projectFaq.length
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
