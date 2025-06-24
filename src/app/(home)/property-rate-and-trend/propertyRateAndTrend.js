"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./page.module.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import CityData from "./tables/citydata";
import Link from "next/link";
import TopGainersLocations from "./tables/topgainerlocations";
import MostActiveLocalitiesByTransaction from "./tables/mostactivelocalitiesbytrans";
import MostActiveLocalitiesByValue from "./tables/mostactivelocalitiesbyvalue";
import TopDevelopersByValue from "./tables/topdevelopersbyvalue";
import TopDevelopersByTransactions from "./tables/topdevelopersbytransactions";
import { useState } from "react";
export default function PropertyRateAndTrend({ cityList, insightData }) {
    const [cityName, setCityName] = useState("");
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
            img: "https://www.squareyards.com/assets/images/transaction-benefit-images/hand-building.svg",
            heading: "For Renters",
            paragraph:
                "Get accurate value of recent lease deeds of the building or society that you are planning to rent. Our users can save 5-10% by referring to actual transactions.",
        },
        {
            id: 3,
            img: "https://www.squareyards.com/assets/images/transaction-benefit-images/fci-calculator.svg",
            heading: "For Owners",
            paragraph:
                "See you building's or project's sale and lease transaction history to get realistic valuation of your property.",
        },
    ];
    return (
        <>
            <div className="mt-5">
                <p className="h1 text-center">Property Rates In India</p>
                <div className={`search-container position-relative`}>
                    <div className={styles.searchContainerChild}>
                        <div className={styles.searchCityContainer}>
                            <select
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                            >
                                <option value="">Select city</option>
                                {/* {cityList.map((item, index) => (
                                    <option key={`${item.id}-${index}`} value={item.name}>
                                        {item.name}
                                    </option>
                                ))} */}
                                {['Ghaziabad', 'Mumbai', 'Noida'].map((item, index) => (
                                    <option key={`${item}-${index}`} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <input type="text" placeholder="Type any city for search" />
                        <FontAwesomeIcon icon={faSearch} width={30} />
                    </div>
                </div>
                <div className="mt-5">
                    <p className="h2 text-center">Property Rates in Cities</p>
                    <div className={styles.propertyRateCityname}>
                        {/* {cityList.map((item, index) => (
                            <Link href={`/property-rate-and-trend/${item.name.toLowerCase()}`} key={index + 1} onClick={() => setCityName(item.name)}>{item.name}</Link>
                        ))} */}
                        {['Ghaziabad', 'Mumbai', 'Noida'].map((item, index) => (
                            <Link href={`/property-rate-and-trend/${item?.toLowerCase()}`} key={index + 1} onClick={() => setCityName(item)}>{item}</Link>
                        ))}
                    </div>
                </div>
                <div className={styles.propertyRateTableContainer}>
                    <div className={styles.propertyRateCityPrice}>
                        <p className="fs-5 fw-bold">City Average Price in India</p>
                        <CityData data={insightData} />

                    </div>
                    <div className={styles.propertyRateCityPrice}>
                        <p className="fs-5 fw-bold">Top Gainer Localities in India</p>
                        <TopGainersLocations data={insightData} />
                    </div>
                </div>
                <div className={styles.propertyRateTableContainer}>
                    <div className={styles.propertyRateCityPrice}>
                        <p className="fs-5 fw-bold">Most Active Localities by Transaction in India</p>
                        <MostActiveLocalitiesByTransaction data={insightData} />
                    </div>
                    <div className={styles.propertyRateCityPrice}>
                        <p className="fs-5 fw-bold">Most Active Localities by Value in India</p>
                        <MostActiveLocalitiesByValue data={insightData} />
                    </div>
                </div>
                <div className={styles.propertyRateTableContainer}>
                    <div className={styles.propertyRateCityPrice}>
                        <p className="fs-5 fw-bold">Top Developers by Transaction in India</p>
                        <TopDevelopersByTransactions data={insightData} />
                    </div>
                    <div className={styles.propertyRateCityPrice}>
                        <p className="fs-5 fw-bold">Top Developers by Value in India</p>
                        <TopDevelopersByValue data={insightData} />
                    </div>
                </div>
                <div>
                    <p className="h1 text-center">In Numbers</p>
                    <div className={styles.propertyRateNumbers}>
                        <div className={styles.propertyRateNumbersChild}>
                            <div className="d-flex justify-content-start align-items-center ">
                                <p className={styles.propertyRateDigit}>8.6</p>
                                <span className={`${styles.propertyRateMn} fw-bold`}>mn+</span>
                            </div>
                            <p className="fs-4 mt-4 fw-normal">Transaction Records</p>
                        </div>
                        <div className={styles.propertyRateNumbersChild}>
                            <div className="d-flex justify-content-start align-items-center ">
                                <p className={styles.propertyRateDigit}>140</p>
                                <span className={`${styles.propertyRateMn} fw-bold`}>k+</span>
                            </div>
                            <p className="fs-4 mt-4 fw-normal">Projects Covered</p>
                        </div>
                        <div className={styles.propertyRateNumbersChild}>
                            <div className="d-flex justify-content-start align-items-center ">
                                <p className={styles.propertyRateDigit}>11</p>
                                <span className={`${styles.propertyRateMn} fw-bold`}>+</span>
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
                <div className="d-flex justify-content-center align-items-center my-3 gap-3 flex-wrap">
                    {data.map((item) => (
                        <div key={item.id} className={`p-3 border rounded-5 ${styles.valueCheckContainer}`}>
                            <div className="d-flex justify-content-center my-3">
                                <img className="w-25" src={item.img} alt={item.img} />
                            </div>
                            <p className="h3 text-center my-3">{item.heading}</p>
                            <p className="text-center fs-5">{item.paragraph}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
