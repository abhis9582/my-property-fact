import axios from "axios";
import ManageProjects from "./manageProjects";

export const dynamic = 'force-dynamic';

//fetching all project list details
const fetchProjectsWithDetail = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
  );
  const res = response.data;
  const list = res.map((item, index) => ({
    ...item,
    index: index + 1,
  }));
  return list;
};

//Fetching all builder list from api
const fetchBuilders = async () => {
  const builders = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "builder/get-all"
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

//Fetch all country with state and cities
const fetchCountryData = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}country/get-all`
  );
  return response.data;
}
export default async function ManageProjectsPage() {
  const [builderList, typeList, countryData, projectDetailList] = await Promise.all([
    fetchBuilders(),
    fetchProjectTypes(),
    fetchCountryData(),
    fetchProjectsWithDetail()
  ]);
  return <ManageProjects
    builderList={builderList}
    typeList={typeList}
    countryData={countryData}
    projectDetailList={projectDetailList}
  />
}
