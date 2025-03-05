"use client";
import { faAlignJustify, faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const route = useRouter();
  // useEffect(() => {
  //     console.log(localStorage.getItem("token"));
      
  //     if (!localStorage.getItem("token")) {
  //       route.push("/admin");
  //     }
  // }, [route]);

  return (
    <div className="container-fluid">
      {/* Page Content */}
      <p className="h1">Welcome to Dashboard</p>
      <div className="container d-flex justify-content-center mt-5">
        <p className="mt-5">Total number of Projects: 10</p>
      </div>
    </div>
  );
}
