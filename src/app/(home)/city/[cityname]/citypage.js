"use client";
import "./citypage.css";
import "../../components/home/home.css";
import Link from "next/link";
import PropertyContainer from "@/app/(home)/components/common/page";
import { useEffect, useState } from "react";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import CommonBreadCrum from "../../components/common/breadcrum";
import { LoadingSpinner } from "../../contact-us/page";
export default function CityPage({ cityData, projectsList }) {
  return (
    <>
      <div className="p-0">
        <div className="container-fluid p-0">
          <CommonHeaderBanner
            image={"realestate-bg.jpg"}
            headerText={cityData.name}
          />
        </div>
        <CommonBreadCrum firstPage={"projects"} pageName={cityData.name} />
        <div className="container-fluid mt-4">
          {/* <p className="h1 text-center">Property in {cityData.name}</p> */}
          <div className="container d-flex justify-content-center">
            <p className="text-center">{cityData.cityDisc}</p>
          </div>
          <div className="text-center">
            <Link href="#" className="btn text-white btn-background">
              Read More
            </Link>
          </div>
        </div>
        {false ?
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "250px" }}>
            <LoadingSpinner show={loading} />
          </div>
          :
          <div className="container my-3">
            <div className="row g-3">
              {projectsList.length > 0 ? projectsList.map((item) => (
                <div key={item.id} className="col-12 col-sm-6 col-md-4">
                  <PropertyContainer data={item} />
                </div>
              )) : (<p className="text-center fs-4 fw-bold">No projects found</p>)}
            </div>
          </div>
        }
      </div>
    </>
  );
}
