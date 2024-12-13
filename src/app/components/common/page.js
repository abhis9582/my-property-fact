"use client";
import { useEffect } from "react";
import "./common.css";

export default function PropertyContainer(props) {
  const goToPropertyDetail = (url) => {
    window.open("/" + url, "_blank");
  };
  // Ensure props.data is defined before accessing its properties
  if (!props.data) {
    return <div>Loading...</div>; // or any fallback content
  }
  return (
    <>
      <div
        className="p-8 rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container main-container"
        onClick={() => goToPropertyDetail(props.data.slugUrl)}
      >
        <p className="text-base text-darkGray text-center mt-6 mb-8">
          {props.data.projectName}
        </p>
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${props.data.projectURL}/${props.data.image}`}
          alt="project image"
        />
        <div className="row pb-1">
          <div className="col-8 text-start">
            <h5>{props.data.projectName}</h5>
          </div>
          <div className="col-4 text-end">
            <p>{props.data.price}</p>
          </div>
        </div>
      </div>
    </>
  );
}
