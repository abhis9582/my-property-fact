"use client";
import Footer from "@/app/components/footer/page";
import Header from "@/app/components/header/page";
import "./builderpage.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import PropertyContainer from "@/app/components/common/page";
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
      if(projects){
        setPropertyList(projects.data);
      }
    }
  };
  useEffect(() => {
    fetchBuilderData();
  }, []);
  return (
    <>
      <Header />
      <div className="container-fluid p-0 mt-5">
        <img
          src="https://www.starestate.com/assets/images/banner-all-projects.jpg"
          alt="city banner"
        />
        <div className="bannerContainer">
          <div className="container-lg">
            <div className="search-filter text-center">
              <p className="h4 text-dark">{builderData.builderName}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100 mt-3">
        <div className="container-lg">
          <div className="breadcrumbContainer" aria-label="breadcrumb">
            <ol className="breadcrumb p-3">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/projects">Projects</Link>
              </li>
              <li className="breadcrumb-item active">
                {builderData.builderName}
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="container-fluid my-4">
        <p className="h1 text-center">{builderData.builderName}</p>
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
        <div className="container-fluid d-flex justify-content-start my-5">
          {propertyList.map((item) => (
            <div key={item.id} style={{ width: "25%" }} className="mx-3">
              <PropertyContainer data={item} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
