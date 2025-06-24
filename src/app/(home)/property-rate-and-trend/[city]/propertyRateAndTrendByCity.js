"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../page.module.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import CommonTableForInsight from "../tables/commonTable";

export default function PropertyRateAndTrendByCity({ cityList, insightArray, cityName }) {
    const [name, setName] = useState("");
    useEffect(() => {
        setName(cityName);
    }, []);
    return (
        <>
            <div className="mt-5">
                <p className="h1 text-center">Property Rates In {cityName}</p>
                <div className={`search-container position-relative`}>
                    <div className={styles.searchContainerChild}>
                        <div className={styles.searchCityContainer}>
                            <select
                                value={name.toLowerCase()}
                                onChange={(e) => setName(e.target.value)}
                            >
                                <option value="">Select city</option>
                                {/* {cityList?.map((item, index) => (
                                    <option key={`${item.id}-${index}`} value={item.name.toLowerCase()}>
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
                    <p className="h2 text-center">Property Rates in cities of {cityName}</p>
                    <div className={`d-flex flex-wrap gap-3 ${styles.propertyRateCityname}`}>
                        {/* {cityList.map((item, index) => (
                            <Link href={`/property-rate-and-trend/${item.name.toLowerCase()}`} key={index + 1}>{item.name}</Link>
                        ))} */}
                        {['Ghaziabad', 'Mumbai', 'Noida'].map((item, index) => (
                            <Link href={`/property-rate-and-trend/${item.toLowerCase()}`} key={index + 1}>{item}</Link>
                        ))}
                    </div>
                </div>
                <div className={styles.propertyRateTableContainer}>
                    {insightArray.map((insightData, index) => (
                        <div key={index} className={styles.propertyRateCityPrice}>
                            <p className="fs-5 fw-bold">{insightData.title}</p>
                            <CommonTableForInsight insightData={insightData.data} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}