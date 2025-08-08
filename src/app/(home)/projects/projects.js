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
  const PAGE_LIMIT = 15;
  const { setProjectData } = useProjectContext();
  // Setup observer ONLY when enabled
  const fetchParamsData = async (queryP) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget`,
        {
          params: queryP,
        }
      );
      setProjectData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}projects`);
      const raw = await res.json();
      setProjectData(raw);
    } catch (error) {
      console.log(error);
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

  return (
    <div className="containr-fluid">
      <CommonHeaderBanner image={"project-banner.jpg"} headerText={pageName} />
      <CommonBreadCrum pageName={pageName} />
      <div className="container my-3">
        <div className="row g-3">
          {projectData.map((item, index) => (
            <div
              key={item.id + "_" + index}
              className="col-12 col-sm-6 col-md-4"
            >
              <PropertyContainer data={item} />
            </div>
          ))}
          {projectData.length < 1 && <LoadingProperty />}
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
