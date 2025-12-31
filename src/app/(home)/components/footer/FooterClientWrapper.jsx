"use client";
import { useEffect, useState } from "react";
import Footer from "./footer";
import FooterSkeleton from "./FooterSkeleton";
import axios from "axios";

/**
 * Client component wrapper for Footer
 * Fetches data on client side to prevent blocking layout
 */
export default function FooterClientWrapper() {
  const [data, setData] = useState({
    cities: [],
    projectTypes: [],
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const [citiesRes, typesRes] = await Promise.all([
          axios.get(`${apiUrl}city/all`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}project-types/get-all`).catch(() => ({ data: [] })),
        ]);

        setData({
          cities: Array.isArray(citiesRes.data) ? citiesRes.data : citiesRes.data?.data || [],
          projectTypes: Array.isArray(typesRes.data) ? typesRes.data : typesRes.data?.data || [],
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching footer data:", error);
        setData({ cities: [], projectTypes: [], loading: false });
      }
    };

    fetchData();
  }, []);

  if (data.loading) {
    return <FooterSkeleton />;
  }

  return <Footer cityList={data.cities} projectTypes={data.projectTypes} />;
}












