"use client";
import { useEffect, useState } from "react";
import HeaderComponent from "./headerComponent";
import HeaderSkeleton from "./HeaderSkeleton";
import axios from "axios";

/**
 * Client component wrapper for Header
 * Fetches data on client side to prevent blocking layout
 */
export default function HeaderClientWrapper() {
  const [data, setData] = useState({
    cities: [],
    propertyTypes: [],
    builders: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const [citiesRes, typesRes, buildersRes] = await Promise.all([
          axios.get(`${apiUrl}city/all`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}project-types/get-all`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}builder/get-all`).catch(() => ({ data: [] })),
        ]);

        setData({
          cities: Array.isArray(citiesRes.data) ? citiesRes.data : citiesRes.data?.data || [],
          propertyTypes: Array.isArray(typesRes.data) ? typesRes.data : typesRes.data?.data || [],
          builders: Array.isArray(buildersRes.data) 
            ? buildersRes.data 
            : buildersRes.data?.builders || buildersRes.data?.data || [],
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching header data:", error);
        setData({ cities: [], propertyTypes: [], builders: [], loading: false });
      }
    };

    fetchData();
  }, []);

  if (data.loading) {
    return <HeaderSkeleton />;
  }

  return (
    <HeaderComponent
      cityList={data.cities}
      projectTypes={data.propertyTypes}
      builderList={data.builders}
    />
  );
}













