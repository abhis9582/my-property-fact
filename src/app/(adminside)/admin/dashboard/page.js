import axios from "axios";
import Dashboard from "./dashboard";
export const dynamic = 'force-dynamic';

//Getting all projects count
const countAllProjects = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/projects/get-all-projects-list`
    );
    return response.data.length || 0;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return 0;
  }
};

//Getting all users count
const countAllUsers = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/users`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching users:", error);
    return 0;
  }
};

//Getting all blogs count
const countAllBlogs = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/blog/get-all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return 0;
  }
};

//Getting all enquiries count
const countAllEnquiries = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/enquiry/get-all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return 0;
  }
};

//Getting all cities count
const countAllCities = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/city/all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return 0;
  }
};

//Getting all builders count
const countAllBuilders = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/builder/get-all-builders`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching builders:", error);
    return 0;
  }
};

//Getting all amenities count
const countAllAmenities = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/amenity/get-all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return 0;
  }
};

//Getting all web story categories count
const countAllWebStoryCategories = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/web-story-category/get-all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching web story categories:", error);
    return 0;
  }
};

//Getting all web stories count
const countAllWebStories = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/web-story/get-all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching web stories:", error);
    return 0;
  }
};

//Getting all project types count
const countAllProjectTypes = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || ""}api/v1/project-types/get-all`
    );
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error) {
    console.error("Error fetching project types:", error);
    return 0;
  }
};

export default async function DashboardPage() {
  const [
    noOfProjects, 
    noOfUsers, 
    noOfBlogs, 
    noOfEnquiries, 
    noOfCities,
    noOfBuilders,
    noOfAmenities,
    noOfWebStoryCategories,
    noOfWebStories,
    noOfProjectTypes
  ] = await Promise.all([
    countAllProjects(),
    countAllUsers(),
    countAllBlogs(),
    countAllEnquiries(),
    countAllCities(),
    countAllBuilders(),
    countAllAmenities(),
    countAllWebStoryCategories(),
    countAllWebStories(),
    countAllProjectTypes()
  ]);
  
  return <Dashboard 
    noOfProjects={noOfProjects}
    noOfUsers={noOfUsers}
    noOfBlogs={noOfBlogs}
    noOfEnquiries={noOfEnquiries}
    noOfCities={noOfCities}
    noOfBuilders={noOfBuilders}
    noOfAmenities={noOfAmenities}
    noOfWebStoryCategories={noOfWebStoryCategories}
    noOfWebStories={noOfWebStories}
    noOfProjectTypes={noOfProjectTypes}
  />
}
