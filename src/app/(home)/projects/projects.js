"use client";
import PropertyContainer from "../components/common/page";
import "./project.css";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import CommonBreadCrum from "../components/common/breadcrum";
import { useSearchParams } from "next/navigation";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import { LoadingSpinner } from "../contact-us/page";

export default function Projects() {
    const [allProjectsList, setAllProjectsList] = useState([]);
    const [pageName, setPageName] = useState("Projects");
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);

    const searchValues = {
        category: searchParams.get("category"),
        location: searchParams.get("location"),
        projectname: searchParams.get("projectname"),
    };

    useEffect(() => {
        var api = "projects/get-all";
        var data = {};

        if (
            searchValues.category !== null &&
            searchValues.location !== null &&
            searchValues.projectname !== null
        ) {
            api = "projects/search-by-type-city-budget";
            data = searchValues;
        }

        async function fetchData() {
            try {
                const projectResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}${api}`,
                    {
                        params: {
                            propertyType: searchValues.category,
                            propertyLocation: searchValues.location,
                            budget: searchValues.projectname,
                        },
                    }
                );

                if (projectResponse.data) {
                    setAllProjectsList(projectResponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <LoadingSpinner show={loading} />
            </div>
        );
    }

    return (
        <div className="containr-fluid">
            <CommonHeaderBanner image={"project-banner.jpg"} headerText={pageName} />
            <CommonBreadCrum pageName={pageName} />
            <div className="container my-3">
                <div className="row g-3">
                    {allProjectsList.map((item) => (
                        <div key={item.id} className="col-12 col-sm-6 col-md-4">
                            <PropertyContainer data={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}