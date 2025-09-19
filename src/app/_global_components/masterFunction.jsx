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
export const fetchAllProjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

//Fetch all projects with cached
export const getAllProjects = cache(async () => {
  console.log("Fetching projects from backend..."); // runs only once per cache
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects`, {
    next: { revalidate: 60 }, // ISR: refresh every 60s
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
});

//Fetching all cities
export async function fetchCityData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}city/all`, {
    next: { revalidate: 60 }, // revalidate every 60 seconds
  });
  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
}

// Fetching project types
export async function fetchProjectTypes() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch project types");
  return res.json();
}

// Fetching builder data
export async function fetchBuilderData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}builder/get-all`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch builders");
  return res.json();
}

// Fetching project details by slug
export const fetchProjectDetailsBySlug = async (slug) => {
  const projectBySlug = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}projects/get/${slug}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!projectBySlug.ok) throw new Error("Failed to fetch project details");
  return projectBySlug.json();
};

//Fetch all floor plans
export const isFloorTypeUrl = async (slug) => {
  const res = await fetch(`${apiUrl}floor-plans/get-all`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch project details");

  const data = await res.json(); // array of projects

  const uniqueUrls = new Set();

  data.forEach((project) => {
    if (Array.isArray(project.plans)) {
      project.plans.forEach((plan) => {
        if (plan.planType) {
          // convert planType to slug
          const slugified = plan.planType
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-"); // spaces → hyphens

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
  const citySlug = slugParts[slugParts.length - 1].toLowerCase();
  const exists = cities.some(
    (item) =>
      item.cityName.toLowerCase().replace(/\s+/g, "-") === citySlug &&
      !isFloorUrl
  );
  return exists;
};

// fetching blogs list from api
export const fetchBlogs = cache(async (page, size) => {
  console.log("Fetching blogs from backend..."); // runs only once per cache
  const res = await fetch(`${apiUrl}blog/get?page=${page}&size=${size}&from=${'blog'}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
});
