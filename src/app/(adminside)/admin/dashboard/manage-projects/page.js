import axios from "axios";
import ManageProjects from "./manageProjects";

export const dynamic = 'force-dynamic';

//Fetching all builder list from api
const fetchBuilders = async () => {
  const builders = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "builders/get-all"
  );
  return builders.data.builders;
};

//Fetching all types of projects
const fetchProjectTypes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
  );
  return response.data;
};
export default async function ManageProjectsPage() {
  const [builderList, typeList] = await Promise.all([
    fetchBuilders(),
    fetchProjectTypes()
  ]);
  return <ManageProjects builderList={builderList} />
}
