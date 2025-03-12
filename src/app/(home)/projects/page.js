"use client";
import Image from "next/image";
import PropertyContainer from "../components/common/page";
import "./project.css";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import CommonBreadCrum from "../components/common/breadcrum";
import { useSearchParams } from "next/navigation";
import { Spinner } from "react-bootstrap";

function ProjectsContent() {
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [pageName, setPageName] = useState("Projects");
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const searchValues = {
    category: searchParams.get("category"),
    location: searchParams.get("location"),
    projectname: searchParams.get("projectname"),
  };

  useEffect(() => {
    var api = "projects/get-all";
    var data = {};    

    if (
      searchValues.category !== null &&
      searchValues.location !== null &&
      searchValues.projectname !== null
    ) {
      api = "projects/search-by-type-city-budget";
      data = searchValues;
    }

    async function fetchData() {
      try {
        const projectResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}${api}`,
          {
            params: {
              propertyType: searchValues.category,
              propertyLocation: searchValues.location,
              budget: searchValues.projectname,
            },
          }
        );

        if (projectResponse.data) {
          setAllProjectsList(projectResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="secondary" />
        <Spinner animation="grow" variant="success" />
        <Spinner animation="grow" variant="danger" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="info" />
        <Spinner animation="grow" variant="light" />
        <Spinner animation="grow" variant="dark" />
      </div>
    );
  }

  return (
    <div className="containr-fluid mt-5">
      <div className="projects-heading-image container-fluid p-0 mt-5">
        <Image
          src="/static/project-banner.jpg"
          width={1899}
          height={500}
          layout="responsive"
          alt="project-banner"
        />
        <p className="projects-heading fs-1">{pageName}</p>
      </div>
      <CommonBreadCrum pageName={pageName} />
      <div className="container-fluid my-3 justify-content-center d-block d-md-flex gap-3 flex-lg-wrap">
        {allProjectsList.map((item, index) => (
          <div key={`${index}-`} className="d-flex">
            <PropertyContainer data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Wrap `ProjectsContent` inside Suspense
export default function Projects() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
