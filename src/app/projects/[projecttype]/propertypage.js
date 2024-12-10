"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PropertyPage({type}) {
  const [typeData, setTypeData] = useState([]);
  const fetchTypeData = async () =>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}project-types/get/${type}`);
    if(response){
      setTypeData(response.data);
    }
  }
  useEffect(()=>{
      fetchTypeData();
  }, [])
  return (
    <>
      <div className="containr-fluid mt-5">
        <div className="container-fluid p-0 mt-5">
          <img
            src="https://www.starestate.com/assets/images/banner-all-projects.jpg"
            alt="city banner"
          />
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
                  {typeData.projectTypeName}
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="container-fluid mt-3">
            <p className="h2 text-center">{typeData.projectTypeName}</p>
        </div>
      </div>
    </>
  );
}
