"use client";

import PropertyContainer from "../components/common/page";
import "./project.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CommonBreadCrum from "../components/common/breadcrum";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import YouTube from "@/app/_global_components/skeleton";
import { useProjectContext } from "@/app/_global_components/contexts/projectsContext";
import LoadingProperty from "@/app/[property]/loading";

export default function Projects() {
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [pageName, setPageName] = useState("Projects");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [observerEnabled, setObserverEnabled] = useState(false);
  const { projectData } = useProjectContext();
  const observer = useRef(null);
  const loadMoreRef = useRef(null);
  const [isActive, setIsActive] = useState("");
  const PAGE_LIMIT = 15;
  const { setProjectData } = useProjectContext();
  const [fadeKey, setFadeKey] = useState(0);
  // Setup observer ONLY when enabled
  const fetchParamsData = async (queryP) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget`,
        {
          params: queryP,
        }
      );
      setProjectData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-all-projects-list`
      );
      const raw = await res.json();
      setProjectData(raw.filter((item) => item.status === true));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const searched_querry = JSON.parse(sessionStorage.getItem("mpf-querry"));
    if (!searched_querry) {
      fetchAllProjects();
    } else {
      fetchParamsData(searched_querry);
    }
  }, []);

  useEffect(() => {
    setAllProjectsList(projectData);
    setIsActive("All");
  }, [projectData]);

  useEffect(() => {
    if (!observerEnabled || loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [observerEnabled, loading, hasMore]);

  const filterSectionTab = (tabName) => {
    setIsActive(tabName);
    if (tabName === "All") {
      setAllProjectsList(projectData);
    } else if (tabName === "Commercial") {
      setAllProjectsList(
        projectData.filter((item) => item.propertyTypeName === "Commercial")
      );
    } else if (tabName === "Residential") {
      setAllProjectsList(
        projectData.filter((item) => item.propertyTypeName === "Residential")
      );
    } else if (tabName === "New Launch") {
      setAllProjectsList(
        projectData.filter((item) => item.projectStatusName === "New Launch")
      );
    }
    setFadeKey((prev) => prev + 1);
    window.scrollTo({ top: 260, behavior: "smooth" });
  };

  return (
    <div className="containr-fluid">
      <CommonHeaderBanner image={"project-banner.jpg"} headerText={pageName} />
      <CommonBreadCrum pageName={pageName} />
      <div className="container-fluid my-3">
        <div className="row position-relative">
          <div className="col-12 col-md-2 col-lg-2 col-xl-2 project-page-filter pt-3">
            <p
              className={`cursor-pointer px-3 py-1 ${
                isActive === "All" ? "filter-active" : ""
              }`}
              onClick={() => filterSectionTab("All")}
            >
              All
            </p>
            <p
              className={`cursor-pointer px-3 py-1 ${
                isActive === "Commercial" ? "filter-active" : ""
              }`}
              onClick={() => filterSectionTab("Commercial")}
            >
              Commercial
            </p>
            <p
              className={`cursor-pointer px-3 py-1 ${
                isActive === "Residential" ? "filter-active" : ""
              }`}
              onClick={() => filterSectionTab("Residential")}
            >
              Residential
            </p>
            <p
              className={`cursor-pointer px-3 py-1 ${
                isActive === "New Launch" ? "filter-active" : ""
              }`}
              onClick={() => filterSectionTab("New Launch")}
            >
              New Launch
            </p>
          </div>
          <div key={fadeKey}  className="col-12 col-md-10 fade-list">
            <div className="row g-3">
              {!loading && allProjectsList.length > 0 ? (
                allProjectsList.map((item, index) => (
                  <div
                    key={item.id + "_" + index}
                    className="col-12 col-sm-6 col-md-4"
                  >
                    <PropertyContainer data={item} />
                  </div>
                ))
              ) : (
                <div>No projects found</div>
              )}
              {loading && <LoadingProperty />}
            </div>
          </div>
        </div>
        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="text-center my-3">
            {loading && (
              <div
                style={{
                  height: "400px",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <YouTube show={loading} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
