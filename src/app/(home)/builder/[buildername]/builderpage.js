"use client";
import "./builderpage.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import PropertyContainer from "@/app/(home)/components/common/page";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { LoadingSpinner } from "../../contact-us/page";
export default function BuilderPage({ builderName }) {
  const [builderData, setBuilderData] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBuilderData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}builders/get/${builderName}`
    );
    if (response) {
      setBuilderData(response.data);
      const projects = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/builder/${response.data.id}`
      );
      if (projects) {
        setPropertyList(projects.data);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchBuilderData();
  }, []);
  return (
    <>
      <CommonHeaderBanner
        image={"builder-banner.jpg"}
        headerText={builderData.builderName}
      />
      <CommonBreadCrum
        firstPage={"projects"}
        pageName={builderData.builderName}
      />
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="w-80">
            <p className="text-center">{builderData.builderDesc}</p>
          </div>
        </div>
        <div className="text-center">
          <Link href="#" className="btn btn-background text-white">
            Read More
          </Link>
        </div>
      </div>
      {loading ?
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: "250px"}}>
          <LoadingSpinner show={loading} />
        </div>
        :
        <div className="container my-3">
          <div className="row g-3">
            {propertyList.length > 0 ? propertyList.map((item) => (
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
