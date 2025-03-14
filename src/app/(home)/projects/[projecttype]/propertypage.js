"use client";
import PropertyContainer from "@/app/(home)/components/common/page";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";

export default function PropertyPage({ type }) {
  const [typeData, setTypeData] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const fetchTypeData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get/${type}`
    );
    if (response) {
      setTypeData(response.data);
    }
  };
  const fetchProjects = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/${type}`
    );
    setProjectList(response.data);
  };
  useEffect(() => {
    fetchTypeData();
    fetchProjects();
  }, []);
  return (
    <>
      <div className="containr-fluid mt-5">
        <CommonHeaderBanner
          image={"project-banner.jpg"}
          headerText={typeData.projectTypeName}
        />
        <CommonBreadCrum
          firstPage={"projects"}
          pageName={typeData.projectTypeName}
        />
        <div className="container-fluid d-block d-md-flex my-5 gap-3">
          {projectList.map((item) => (
            <div key={item.id}>
              <PropertyContainer data={item} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
