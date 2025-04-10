"use client";
import "../home/featured/featured.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";
import './common.css';

export default function PropertyContainer(props) {
  // Ensure props.data is defined before accessing its properties
  if (!props.data) {
    return <div>Loading...</div>; // or any fallback content
  }

  //Generating price in lakh & cr
  const generatePrice = (price) => {
    // Check if price contains any alphabetic character
    if (/[a-zA-Z]/.test(price)) {
      return price; // Return the original string if it contains letters
    }

    // Convert price to a number
    const numericPrice = parseFloat(price);

    // Check if conversion is successful
    if (isNaN(numericPrice)) {
      return price; // Return original string if it's not a valid number
    }

    // Format price
    return numericPrice > 1
      ? numericPrice + " Cr"
      : (numericPrice * 100) + " Lakh";
  };
  return (
    <>
      <Link href={`/${props.data.slugURL}`} legacyBehavior>
        <a
          className="rounded-4 shadow-sm d-flex flex-column justify-content-between bg-light h-100 text-decoration-none text-dark project-container overflow-hidden position-relative"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="w-100 project-image-container">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${props.data.slugURL}/${props.data.projectThumbnail}`}
              alt="featured image"
              className="img-fluid w-100 rounded-top-4 object-fit-cover"
              width={400}
              height={400}
              unoptimized
            />
          </div>

          <div className="mt-2 px-3 d-flex justify-content-between align-items-center mt-3">
            <p className="h5 fw-bold mb-0">{props.data.projectName}</p>
            <p className="h5 fw-bold text-success mb-0">{generatePrice(props.data.projectPrice)}*</p>
          </div>

          <div className="px-3 pb-3 text-truncate small fw-medium mt-2 d-flex align-items-center">
            <FontAwesomeIcon icon={faMapMarker} className="me-2 text-success" />
            <p className="p-0 m-0 fw-bold">{props.data.projectAddress}</p>
          </div>
          {/* <p className="fs-5 fw-bold position-absolute z-10 top-0 bg-success px-4">hello {props.data.propertyType}</p> */}
        </a>
      </Link>
    </>
  );
}
