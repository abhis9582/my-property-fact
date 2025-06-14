import axios from "axios";
import ManageGallery from "./manageGallery";
export const dynamic = 'force-dynamic';
//Fetching all gallery images
const fetchGalleryImage = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-gallery/get-all`
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
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  return projectResponse.data;
};

export default async function ManageGalleryPage() {
  const [list, projectsList] = await Promise.all([
    fetchGalleryImage(),
    fetchProjects()
  ]);
  return <ManageGallery list={list} projectsList={projectsList} />
}