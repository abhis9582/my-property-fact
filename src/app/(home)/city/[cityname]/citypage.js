"use client";
import "./citypage.css";
import "../../components/home/home.css";
import Link from "next/link";
import PropertyContainer from "@/app/(home)/components/common/page";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import CommonBreadCrum from "../../components/common/breadcrum";
import { LoadingSpinner } from "../../contact-us/page";
import Image from "next/image";
export default function CityPage({ cityData }) {
  return (
    <>
      <div className="p-0">
        <div className="container-fluid p-0">
          <CommonHeaderBanner
            image={"realestate-bg.jpg"}
            headerText={cityData.cityName}
            firstPage={"projects"}
            pageName={cityData.cityName}
          />
        </div>
        {/* <div className="container-fluid mt-4">
          <div className="container d-flex justify-content-center">
            <p className="text-center">{cityData.cityDescription}</p>
          </div>
          <div className="text-center">
            <Link href="#" className="btn text-white btn-background">
              Read More
            </Link>
          </div>
        </div> */}
        <div className="about-us-container">
          <div>
            <Image
              src={"/static/about-us-bg-left.png"}
              alt={cityData.cityName}
              width={161}
              height={353}
            />
          </div>
          <div>
            <p>{cityData.cityDescription}</p>
            <div className="text-center">
              <Link href="#" className="btn text-white btn-background about-us-read-more">
                Read More
              </Link>
            </div>
          </div>
          <div>
            <Image
              src={"/static/about-us-bg-right.png"}
              alt={cityData.cityName}
              width={161}
              height={353}
            />
          </div>
        </div>
        {false ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "250px" }}
          >
            <LoadingSpinner show={loading} />
          </div>
        ) : (
          <div className="container my-3">
            <div className="row g-3">
              {cityData.projectList.length > 0 ? (
                cityData.projectList.map((item, index) => (
                  <div key={`${index}`} className="col-12 col-sm-6 col-md-4">
                    <PropertyContainer data={item} />
                  </div>
                ))
              ) : (
                <p className="text-center fs-4 fw-bold">No projects found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
