import axios from "axios";
import MultiStepProjectForm from "../components/MultiStepProjectForm";

export const dynamic = "force-dynamic";

// Fetching all required data for the form
const fetchBuilders = async () => {
  const builders = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "builder/get-all"
  );
  return builders.data.builders;
};

const fetchProjectTypes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
  );
  return response.data.filter(
    (item) => item.projectTypeName !== "New Launches"
  );
};

const fetchProjectStatusList = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-status`
  );
  return response.data;
};

const fetchCountryData = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}country/get-all-countries`
  );
  return response.data;
};

const fetchAmenityList = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}amenity/get-all`
  );
  return response.data;
};

const fetchProjectById = async (projectId) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error.response?.data?.message || error.message);
    // Return null to allow form to load in "add new" mode
    return null;
  }
};

export default async function EditProjectPage({ searchParams }) {
  // Await searchParams in Next.js 15+
  const params = await searchParams;
  const projectId = params?.projectId
    ? parseInt(params.projectId)
    : null;

  const [
    builderList,
    typeList,
    countryData,
    projectStatusList,
    amenityList,
    projectData,
  ] = await Promise.all([
    fetchBuilders(),
    fetchProjectTypes(),
    fetchCountryData(),
    fetchProjectStatusList(),
    fetchAmenityList(),
    projectId ? fetchProjectById(projectId) : Promise.resolve(null),
  ]);

  return (
    <MultiStepProjectForm
      projectId={projectId}
      projectData={projectData}
      builderList={builderList}
      typeList={typeList}
      countryData={countryData}
      projectStatusList={projectStatusList}
      amenityList={amenityList}
    />
  );
}

