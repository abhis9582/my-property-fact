import axios from "axios";
import Dashboard from "./dashboard";

//Getting all projects count
const countAllProjects = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  return response.data.length;
};

export default async function DashboardPage() {
  const noOfProjects = await countAllProjects();
  return <Dashboard noOfProjects = {noOfProjects}/>
}
