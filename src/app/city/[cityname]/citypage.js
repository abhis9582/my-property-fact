"use client";
import Header from "@/app/components/header/page";
import "./citypage.css";
import Link from "next/link";
import PropertyContainer from "@/app/components/common/page";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "@/app/components/footer/page";
export default function CityPage({ city }) {
  const [propertyList, setPropertyList] = useState([]);
  const [cityData, setCityData] = useState([]);
  const fetchCityData = async () => {
    const cityData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/get/${city}`
    );
    setCityData(cityData.data);
  };
  const fetchProperties = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/${city}`
    );
    setPropertyList(response.data);
  };  
  useEffect(() => {
    fetchCityData();
    fetchProperties();
  }, []);
  return (
    <>
      <div className="p-0">
        <Header />
        <div className="container-fluid p-0 mt-5">
          <img
            src="https://www.starestate.com/assets/images/banner-all-projects.jpg"
            alt="city banner"
          />
          <div className="bannerContainer">
            <div className="container-lg">
              <div className="search-filter">
                <div className="filter-form">
                  <form id="categoryfilter" encType="multipart/form-data">
                    <div className="row gx-2 gap-form-row">
                      <div className="col-md-10">
                        <div className="inner">
                          <div className="row g-0">
                            <div className="col mb-0 form-group">
                              <select
                                name="cityLocation"
                                id="cityLocation"
                                className="form-control bg-white my-0"
                              >
                                <option value="">Project Location</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="pune">Pune</option>
                                <option value="bangalore">Bangalore </option>
                                <option value="delhi">Delhi</option>
                                <option value="noida">Noida</option>
                                <option value="gurugram">Gurugram</option>
                                <option value="greater-noida">
                                  Greater Noida
                                </option>
                                <option value="agra">Agra</option>
                                <option value="ahmedabad">Ahmedabad</option>
                                <option value="mathura">Mathura</option>
                                <option value="ghaziabad">Ghaziabad</option>
                                <option value="faridabad">Faridabad</option>
                                <option value="chennai">Chennai</option>
                                <option value="ayodhya">Ayodhya</option>
                                <option value="hyderabad">Hyderabad</option>
                                <option value="lucknow">Lucknow</option>
                              </select>
                            </div>
                            <div className="col mb-0 form-group">
                              <select
                                name="projectPrice"
                                id="projectPrice"
                                className="form-control bg-white my-0"
                              >
                                <option value="">Budget</option>
                                <option value="10000000">UpTo 1 Cr.</option>
                                <option value="10000000-30000000">
                                  1 - 3 Cr.
                                </option>
                                <option value="30000000-50000000">
                                  3 - 5 Cr.
                                </option>
                                <option value="50000000">Above 5 Cr.</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2 readmore w-auto mt-0">
                        <input
                          type="hidden"
                          name="projectfltr"
                          value="active"
                        />
                        <button className="button w-100 h-100" type="submit">
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
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
                <li className="breadcrumb-item active">{cityData.name}</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="container-fluid mt-4">
          <p className="h1 text-center">Property in {cityData.name}</p>
          <div className="d-flex justify-content-center">
            <div className="w-80">
              <p className="text-center">{cityData.cityDisc}</p>
            </div>
          </div>
          <div className="text-center">
            <Link href="#" className="btn btn-dark">
              Read More
            </Link>
          </div>
        </div>
        <div className="container-fluid d-flex justify-content-start my-5">
          {propertyList.map((item) => (
            <div key={item.id} style={{width: "25%"}} className="mx-3">
              <PropertyContainer data={item} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
