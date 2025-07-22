"use client";

import PropertyContainer from "../components/common/page";
import "./project.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CommonBreadCrum from "../components/common/breadcrum";
import { useSearchParams } from "next/navigation";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import YouTube from "@/app/_global_components/skeleton";

export default function Projects() {
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [pageName, setPageName] = useState("Projects");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [observerEnabled, setObserverEnabled] = useState(false);

  const observer = useRef(null);
  const loadMoreRef = useRef(null);

  const searchParams = useSearchParams();
  const PAGE_LIMIT = 15;

  const searchValues = {
    category: searchParams.get("category"),
    location: searchParams.get("location"),
    projectname: searchParams.get("projectname"),
  };

  const fetchProjects = async () => {
    setLoading(true);

    try {
      let api = `${process.env.NEXT_PUBLIC_API_URL}projects?page=${page}&limit=${PAGE_LIMIT}`;
      const isFilterUsed =
        searchValues.category ||
        searchValues.location ||
        searchValues.projectname;

      if (isFilterUsed) {
        api = `${process.env.NEXT_PUBLIC_API_URL}projects/search-by-type-city-budget?page=${page}&limit=${PAGE_LIMIT}`;
      }

      const res = await axios.get(api, {
        params: {
          page,
          limit: PAGE_LIMIT,
          propertyType: searchValues.category,
          propertyLocation: searchValues.location,
          budget: searchValues.projectname,
        },
      });

      const data = res.data.content || res.data || [];

      setAllProjectsList((prev) => [...prev, ...data]);

      if (data.length < PAGE_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      // Enable the observer only after first data is loaded
      if (page === 1) {
        setObserverEnabled(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page change
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Setup observer ONLY when enabled
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
          {allProjectsList.map((item, index) => (
            <div
              key={item.id + "_" + index}
              className="col-12 col-sm-6 col-md-4"
            >
              <PropertyContainer data={item} />
            </div>
          ))}
        </div>

        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="text-center my-3">
            {loading && (
              <div style={{height: "400px", alignItems: "center", display: "flex", justifyContent: "center"}}>
                <YouTube show={loading} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
