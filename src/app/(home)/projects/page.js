"use client";
import Link from "next/link";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import Image from "next/image";
import PropertyContainer from "../components/common/page";
import "./project.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonBreadCrum from "../components/common/breadcrum";

export default function Projects() {
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [pageName, setPageName] = useState("Projects");
  useEffect(() => {
    async function fetchData() {
      const projectResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-all`
      );
      try {
        if (projectResponse.data) {
          setAllProjectsList(projectResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <>
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
        <div className="container-fluid my-3 d-block d-md-flex gap-3 flex-lg-wrap">
          {allProjectsList.map((item, index) => (
            <div key={`${index}-`} className="d-flex">
              <PropertyContainer data={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
