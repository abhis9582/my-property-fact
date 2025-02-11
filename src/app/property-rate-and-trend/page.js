"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import "./property_rate.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CityData from "./tables/citydata";
import Link from "next/link";
export default function PropertyRateAndTrend() {
  const city = [
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Navi Mumbai",
    "Gurgaon",
    "Pune",
    "Thane",
    "Noida",
    "Greater Noida",
    "Ghaziabad",
    "Lucknow",
    "Faridabad",
  ];
  const data = [
    {
      id: 1,
      img: "https://www.squareyards.com/assets/images/transaction-benefit-images/transfer-money-buy-smartphone-hands.svg",
      heading: "For Home Buyers",
      paragraph:
        "Pick a building or locality of your interest and see last 10 actual transactions before you negotiate with a broker or a builder.",
    },
    {
      id: 2,
      img: "https://www.squareyards.com/assets/images/transaction-benefit-images/transfer-money-buy-smartphone-hands.svg",
      heading: "For Home Buyers",
      paragraph:
        "Pick a building or locality of your interest and see last 10 actual transactions before you negotiate with a broker or a builder.",
    },
    {
      id: 3,
      img: "https://www.squareyards.com/assets/images/transaction-benefit-images/transfer-money-buy-smartphone-hands.svg",
      heading: "For Home Buyers",
      paragraph:
        "Pick a building or locality of your interest and see last 10 actual transactions before you negotiate with a broker or a builder.",
    },
  ];
  return (
    <>
      <Header />
      <div className="property-rate-container">
        <p className="h1 text-center">Property Rates In India</p>
        <div className="search-container">
          <div className="search-container-child">
            <div className="search-city-container">
              <select>
                <option>Delhi</option>
                <option>Goa</option>
                <option>Noida</option>
              </select>
            </div>
            <input type="text" placeholder="Type any city for search" />
            <FontAwesomeIcon icon={faSearch} width={30} />
          </div>
        </div>
        <div className="mt-5">
          <p className="h2 text-center">Property Rates in Cities</p>
          <div className="property-rate-cityname">
            {city.map((name, index) => (
              <Link href="#" key={index + 1}>{name}</Link>
            ))}
          </div>
        </div>
        <div className="property-rate-table-container">
          <div className="property-rate-city-price">
            <p className="fs-5 fw-bold">City Average Price in India</p>
            <CityData />
          </div>
          <div className="property-rate-city-price">
            <p className="fs-5 fw-bold">Top Gainer Localities in India</p>
            <CityData />
          </div>
        </div>
        <div className="property-rate-table-container">
          <div className="property-rate-city-price">
            <p className="fs-5 fw-bold">Most Active Localities by Transaction in India</p>
            <CityData />
          </div>
          <div className="property-rate-city-price">
            <p className="fs-5 fw-bold">Most Active Localities by Value in India</p>
            <CityData />
          </div>
        </div>
        <div className="property-rate-table-container">
          <div className="property-rate-city-price">
            <p className="fs-5 fw-bold">Top Developers by Transaction in India</p>
            <CityData />
          </div>
          <div className="property-rate-city-price">
            <p className="fs-5 fw-bold">Top Developers by Value in India</p>
            <CityData />
          </div>
        </div>
        <div>
          <p className="h1 text-center">In Numbers</p>
          <div className="property-rate-numbers">
            <div>
              <div className="d-flex justify-content-start align-items-center ">
                <p className="property-rate-digit">8.6</p>
                <span className="property-rate-mn fw-bold">mn+</span>
              </div>
              <p className="fs-4 mt-4 fw-normal">Transaction Records</p>
            </div>
            <div>
              <div className="d-flex justify-content-start align-items-center ">
                <p className="property-rate-digit">140</p>
                <span className="property-rate-mn fw-bold">k+</span>
              </div>
              <p className="fs-4 mt-4 fw-normal">Projects Covered</p>
            </div>
            <div>
              <div className="d-flex justify-content-start align-items-center ">
                <p className="property-rate-digit">11</p>
                <span className="property-rate-mn fw-bold">+</span>
              </div>
              <p className="fs-4 mt-4 fw-normal mx-3">Cities</p>
            </div>
          </div>
        </div>
        <div className="my-5">
          <div className="d-flex justify-content-center">
            <p className="fs-1 text-center w-75">
              Check Current Market Value of any Property Buy, Lease or Sell with
              Confidence
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center my-3 gap-3">
          {data.map((item) => (
            <div key={item.id} className="p-3 w-25 border rounded-5">
              <div className="d-flex justify-content-center my-3">
                <img className="w-25" src={item.img} alt={item.img} />
              </div>
              <p className="h3 text-center my-3">{item.heading}</p>
              <p className="text-center fs-5">{item.paragraph}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
