"use client";
import "../home/featured/featured.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

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
        className="rounded-lg bg-darkGray bg-opacity-10 shadow-md flex flex-col items-center justify-content-center container cursor-pointer featured-projects-container"
        onClick={() => goToPropertyDetail(props.data.slugURL)}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${props.data.slugURL}/${props.data.projectThumbnail}`}
          alt="featured image"
          width={400} // This acts as the aspect ratio, not fixed pixels
          height={300} // Adjust for desired aspect ratio
          layout="intrinsic"
          unoptimized
        />
        <div className="mt-2 d-flex justify-content-between align-items-center p-2">
          <p className="h5 fw-bold">{props.data.projectName}</p>
          <p className="h5 fw-bold text-success">{props.data.projectPrice} Cr*</p>
        </div>
        <div className="pb-2 fw-bold mx-2">
          <FontAwesomeIcon icon={faMapMarker} width={8} color="green" />{" "}
          {props.data.projectAddress}
        </div>
      </div>
    </>
  );
}
