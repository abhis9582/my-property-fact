"use client";
import "./builderpage.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import PropertyContainer from "@/app/(home)/components/common/page";
import Image from "next/image";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
export default function BuilderPage({ builderName }) {
  const [builderData, setBuilderData] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
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
          <Link href="#" className="btn btn-dark">
            Read More
          </Link>
        </div>
      </div>
      <div className="container-fluid flex-wrap my-3 gap-3">
        {propertyList.map((item) => (
          <div key={item.id}>
            <PropertyContainer data={item} />
          </div>
        ))}
      </div>
    </>
  );
}
