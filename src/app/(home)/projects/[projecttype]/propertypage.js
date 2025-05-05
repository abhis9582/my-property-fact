"use client";
import PropertyContainer from "@/app/(home)/components/common/page";
import axios from "axios";
import { useEffect, useState } from "react";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { LoadingSpinner } from "../../contact-us/page";

export default function PropertyPage({ type }) {
  const [typeData, setTypeData] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
  };
  useEffect(() => {
    fetchTypeData();
    fetchProjects();
  }, []);

  return (
    <>
      <CommonHeaderBanner
        image={"project-banner.jpg"}
        headerText={typeData.projectTypeName}
      />
      <CommonBreadCrum
        firstPage={"projects"}
        pageName={typeData.projectTypeName}
      />
      {loading ?
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: "250px"}}>
          <LoadingSpinner show={loading} />
        </div>
        :
        <div className="container my-3">
          <div className="row g-3">
            {projectList.length > 0 ? projectList.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-4">
                <PropertyContainer data={item} />
              </div>
            )) : (<p className="text-center fs-4 fw-bold">No projects found</p>)}
          </div>
        </div>
      }
    </>
  );
}
