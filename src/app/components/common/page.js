"use client";
import { useEffect } from "react";
import "./common.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";

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
        onClick={() => goToPropertyDetail(props.data.slugURL)}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${props.data.slugURL}/${props.data.projectThumbnail}`}
          alt="project image"
        />
        <div className="row pb-1 mt-2 mb-0">
          <div className="col-8 text-start">
            <h5>{props.data.projectName}</h5>
          </div>
          <div className="col-4 text-end">
            <p>{props.data.projectPrice}</p>
          </div>
        </div>
        <div className="m-0">
          <p>
            <FontAwesomeIcon icon={faMapMarker} width={8} color="green" />{" "}
            {props.data.projectAddress}
          </p>
        </div>
      </div>
    </>
  );
}
