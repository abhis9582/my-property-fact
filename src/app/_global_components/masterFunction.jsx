import axios from "axios";
import { cache } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Function to check if a given slug corresponds to a valid project
export async function checkIfProjectSlug(slug) {
  const projects = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get/${slug}`
  );
  if (projects.data.slugURL === slug) {
    return true;
  } else {
    return false;
  }
}

//Fetching all projects
export const fetchAllProjects = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const res = await fetch(`${apiUrl}projects`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data;
});

//Fetch all projects with cached
export const getAllProjects = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const res = await fetch(`${apiUrl}projects`, {
    next: { revalidate: 60 }, // ISR: refresh every 60s
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  const data = await res.json();
  return data;
});

//Fetching all cities
export const fetchCityData = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }
  const res = await fetch(`${apiUrl}city/all`, {
    next: { revalidate: 60 }, // revalidate every 60 seconds
  });
  if (!res.ok) throw new Error("Failed to fetch cities");
  const data = await res.json();
  return data;
});

// Fetching project types
export const fetchProjectTypes = cache(async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch project types");
    return res.json();
  } catch (error) {
    console.error("Error fetching project types:", error);
    return {
      success: false,
      message: "Error fetching project types",
      data: [],
    };
  }
});

// Fetching builder data
export const fetchBuilderData = cache(async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}builder/get-all`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch builders");
  return res.json();
});

// Fetching project details by slug
export const fetchProjectDetailsBySlug = cache(async (slug) => {
  const projectBySlug = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!projectBySlug.ok) throw new Error("Failed to fetch project details");
  return projectBySlug.json();
});

//Fetch all floor plans
export const isFloorTypeUrl = async (slug) => {
  const res = await fetch(`${apiUrl}floor-plans/get-all`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch project details");
  const data = await res.json(); // array of projects'
  const uniqueUrls = new Set();
  data.forEach((project) => {
    if (Array.isArray(project.plans)) {
      project.plans.forEach((plan) => {
        if (plan.planType) {
          const slugified = plan.planType
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
          uniqueUrls.add(slugified);
        }
      });
    }
  });
  const floorType = slug.split("-in-")[0];
  return uniqueUrls.has(floorType.toLowerCase());
};

//Checking is ctiy slug
export const isCityTypeUrl = async (slug) => {
  const cities = await fetchCityData();
  const slugParts = slug.split("-in-");
  const isFloorUrl = await isFloorTypeUrl(slug);
  const citySlug = slugParts[slugParts.length - 1]
    .replace("%20", "-")
    .toLowerCase();
  const exists = cities.some(
    (item) =>
      item.cityName.toLowerCase().replace(/\s+/g, "-") === citySlug &&
      !isFloorUrl
  );
  return exists;
};

// fetching blogs list from api
export const fetchBlogs = cache(async (page, size) => {
  const res = await fetch(
    `${apiUrl}blog/get?page=${page}&size=${size}&from=${"blog"}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch blogs");
  const blogsData = await res.json();
  // Handle different response structures: could be array, object with data array, or object with total
  const blogsArray = Array.isArray(blogsData) ? blogsData : (blogsData?.data || blogsData?.blogs || []);
  const total = blogsData?.total || blogsData?.totalCount || blogsArray.length;
  return blogsData;
});

//Get projects in parts
export const getProjectsInPart = cache(async (page, size, category = "All") => {
  const project = await fetch(
    `${apiUrl}projects/get-projects-in-parts?page=${page}&size=${size}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!project.ok) throw new Error("Failed to fetch blogs");
  const projectPartData = await project.json();
  switch (category) {
    case "Commercial":
      projectPartData.filter((item) => item.propertyTypeName === category);
      break;
    case "Residential":
      projectPartData.filter((item) => item.propertyTypeName === category);
      break;
    case "New Launch":
      projectPartData.filter((item) => item.propertyTypeName === category);
      break;
    default:
      projectPartData;
      break;
  }
  return projectPartData;
});

//Fetch all benefits from server
export const fetchAllBenefits = cache(async () => {
  const benefits = await fetch(`${process.env.NEXT_PUBLIC_API_URL}benefit`, {
    method: "Get",
  });
  if (!benefits.ok) throw new Error("Failed to fetch benefits");
  const benefitData = await benefits.json();
  return benefitData;
});

//Fetch all webstories from server
export const fetchAllStories = cache(async () => {
  const stories = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}web-story-category/get-all`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!stories.ok) throw new Error("Failed to fetch stories");
  const storiesData = await stories.json();
  return storiesData.reverse();
});

// Getting top project
export const getWeeklyProject = async (projects) => {
  const now = new Date();
  const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
  const index = weekNumber % projects.length;
  return projects[index];
};

// Getting top project
export const fetchProjectStatus = cache(async () => {
  try {
    const res = await fetch(
      `${apiUrl}project-status`,
      {
        method: "GET",
      },
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch project status");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching project status:", error);
    return {
      success: false,
      message: "Error fetching project status",
      data: [],
    };
  }
});

// Fetching all projects by project type
export const fetchAllProjectsByProjectType = cache(async (projectType) => {
  const projects = await fetch(`${apiUrl}project-types/get/${projectType}`, {
    next: { revalidate: 60 },
  });
  if (!projects.ok) throw new Error("Failed to fetch projects");
  const projectsData = await projects.json();
  return projectsData;
});
