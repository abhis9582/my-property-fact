"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

const SiteDataContext = createContext({
  cityList: [],
  builderList: [],
  projectTypes: [],
  projectList: [],
  loading: true,
  error: null,
  searchProjects: () => Promise.resolve([]),
});

export function SiteDataProvider({ children }) {
  const [cityList, setCityList] = useState([]);
  const [builderList, setBuilderList] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      if (!apiBase) {
        setError("NEXT_PUBLIC_API_URL is not defined");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const [citiesRes, buildersRes, typesRes, projectsRes] = await Promise.all([
          fetch(`${apiBase}city/all`),
          fetch(`${apiBase}builder/get-all`),
          fetch(`${apiBase}project-types/get-all`),
          fetch(`${apiBase}projects`),
        ]);

        if (cancelled) return;

        if (!citiesRes.ok) throw new Error("Failed to fetch cities");
        if (!buildersRes.ok) throw new Error("Failed to fetch builders");
        if (!typesRes.ok) throw new Error("Failed to fetch project types");
        if (!projectsRes.ok) throw new Error("Failed to fetch projects");

        const [cities, buildersData, typesData, projectsData] = await Promise.all([
          citiesRes.json(),
          buildersRes.json(),
          typesRes.json(),
          projectsRes.json(),
        ]);

        if (cancelled) return;

        setCityList(Array.isArray(cities) ? cities : []);
        setBuilderList(
          Array.isArray(buildersData?.builders) ? buildersData.builders : []
        );
        setProjectTypes(Array.isArray(typesData) ? typesData : typesData?.data || []);
        setProjectList(Array.isArray(projectsData) ? projectsData : []);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load site data");
          setCityList([]);
          setBuilderList([]);
          setProjectTypes([]);
          setProjectList([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const searchProjects = useCallback(async (query) => {
    const q = (query || "").trim().toLowerCase();
    if (q.length < 2) return [];
    const list = projectList || [];
    return list
      .filter((project) => {
        const name = (project.projectName || project.name || "").toLowerCase();
        const city = (project.cityName || "").toLowerCase();
        return name.includes(q) || city.includes(q);
      })
      .slice(0, 50);
  }, [projectList]);

  const value = {
    cityList,
    builderList,
    projectTypes,
    projectList,
    loading,
    error,
    searchProjects,
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return ctx;
}
