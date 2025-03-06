"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [projectsCount, setProjectCount] = useState(0);
  useEffect(() => {
    const countAllProjects = async () => {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "projects/get-all"
      );
      const count = response.data.length;
      setProjectCount(count);
    };
    countAllProjects();
  }, []);

  return (
    <div className="container-fluid">
      {/* Page Content */}
      <p className="h1">Welcome to Dashboard</p>
      <div className="container d-flex justify-content-center mt-5">
        <p className="mt-5">Total number of Projects: {projectsCount}</p>
      </div>
    </div>
  );
}
