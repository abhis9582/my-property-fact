"use client";
import "../home/featured/featured.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faIndianRupee,
  faMapMarker,
  faRupee,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./common.css";

export default function PropertyContainer({ data, badgeVariant = "default" }) {
  const [imageError, setImageError] = useState(false);

  // Ensure data is defined before accessing its properties
  if (!data) {
    return <div>Loading...</div>; // or any fallback content
  }

  // Default image path - use generic floorplan or realestate background as fallback
  const DEFAULT_IMAGE = "/static/no_image.png";
  
  // Get image URL - use default if thumbnail is missing or image failed to load
  const getImageSrc = () => {
    if (imageError || !data.projectThumbnailImage) {
      return DEFAULT_IMAGE;
    }
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${data.slugURL}/${data.projectThumbnailImage}`;
  };

  //Generating price in lakh & cr
  const generatePrice = (price) => {
    if (/[a-zA-Z]/.test(price)) {
      return price;
    }
    return price < 1
      ? "₹ " + Math.round(parseFloat(price) * 100) + " Lakh* Onwards"
      : "₹ " + parseFloat(price) + " Cr* Onwards";
  };

  const getFeaturedBadgeStyle = (status) => {
    const defaultStyle = {
      backgroundColor: "#FF5800",
      textColor: "#ffffff",
    };

    if (!status) {
      return defaultStyle;
    }


    const colorMap = {
      "new launched": { backgroundColor: "#35A332", textColor: "#fff" },
      "new launch": { backgroundColor: "#EC191C", textColor: "#1f2937" },
      "ultra luxury": { backgroundColor: "#CC9848", textColor: "#ffffff" },
      luxury: { backgroundColor: "#d32f2f", textColor: "#ffffff" },
      "ready to move": { backgroundColor: "#0f766e", textColor: "#ffffff" },
      "under construction": { backgroundColor: "#566BCA", textColor: "#fffffe" },
      "possession soon": { backgroundColor: "#2563eb", textColor: "#ffffff" },
      affordable: { backgroundColor: "#22c55e", textColor: "#ffffff" },
    };

    const normalized = status.trim().toLowerCase();
    return colorMap[normalized] || defaultStyle;
  };

  const renderStatusBadge = () => {
    if (!data.projectStatus) {
      return null;
    }

    if (badgeVariant === "home-featured") {
      const { backgroundColor, textColor } = getFeaturedBadgeStyle(
        data.projectStatus
      );

      return (
        <div
          className="home-featured-status-badge"
          style={{
            "--badge-color": backgroundColor,
            "--badge-text-color": textColor,
          }}
        >
          {data.projectStatus}
        </div>
      );
    }

    return (
      <div className="position-absolute top-0 end-0 m-2 status-badge-container">
        <h6 className="border p-2 d-inline-block rounded bg-light text-dark shadow-sm fw-bold">
          {data.projectStatus}
        </h6>
      </div>
    );
  };
  return (
    <>
      <Link 
        href={`/${data.slugURL}`}
        className="rounded-4 custom-shadow d-flex flex-column justify-content-between bg-light text-decoration-none text-dark project-container overflow-hidden position-relative"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View details about ${data.projectName}`}
      >
        <div className="w-100 project-image-container">
          <Image
            src={getImageSrc()}
            alt={data.projectName || "Project image"}
            className="img-fluid w-100 rounded-top-4 object-fit-cover"
            priority
            width={400}
            height={400}
            onError={() => setImageError(true)}
            unoptimized={imageError || !data.projectThumbnailImage}
          />
        </div>
        {renderStatusBadge()}
        <div className="mt-3 ms-3">
          <h5 className="mb-2 fw-bold">{data.projectName}</h5>
          <p className="mb-2">{data.projectType}</p>
          <h5 className="text-success d-flex gap-2 mb-0">
            <span className="fw-bold"> {generatePrice(data.projectPrice)}</span>
          </h5>
        </div>

        <div className="ms-3 pb-3 text-truncate small fw-medium mt-2 d-flex align-items-center">
          <span>
            <FontAwesomeIcon
              icon={faMapMarker}
              className="me-2 text-success"
            />
          </span>
          <p className="p-0 m-0 fw-bold">{data.projectAddress}</p>
        </div>
      </Link>
    </>
  );
}
