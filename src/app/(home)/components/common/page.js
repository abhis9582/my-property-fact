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
import "./common.css";

export default function PropertyContainer(props) {
  // Ensure props.data is defined before accessing its properties
  if (!props.data) {
    return <div>Loading...</div>; // or any fallback content
  }

  //Generating price in lakh & cr
  const generatePrice = (price) => {
    if (/[a-zA-Z]/.test(price)) {
      return price;
    }
    return price < 1
      ? Math.round(parseFloat(price) * 100) + " Lakh* Onwards"
      : parseFloat(price) + " Cr* Onwards";
  };
  return (
    <>
      <Link href={`/${props.data.slugURL}`} legacyBehavior>
        <a
          className="rounded-4 custom-shadow d-flex flex-column justify-content-between bg-light text-decoration-none text-dark project-container overflow-hidden position-relative"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View details about ${props.data.projectName}`}
        >
          <div className="w-100 project-image-container">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${
                props.data.slugURL
              }/${
                props.data.projectThumbnail || props.data.projectThumbnailImage
              }`}
              alt={props.data.projectName}
              className="img-fluid w-100 rounded-top-4 object-fit-cover"
              width={400}
              height={400}
              unoptimized
            />
          </div>
          {props.data.projectStatusName && (
            <div className="position-absolute top-0 end-0 m-2">
              <h6 className="border p-2 d-inline-block rounded bg-light text-dark shadow-sm">
                {props.data.projectStatusName}
              </h6>
            </div>
          )}
          <div className="mt-3 ms-3">
            <h5 className="mb-2">{props.data.projectName}</h5>
            <p>{props.data.typeName}</p>
            <h5 className="text-success d-flex gap-2 mb-0">
              <span>
                <FontAwesomeIcon icon={faIndianRupee}/>
              </span>
              <span className="fw-bold"> {generatePrice(props.data.projectPrice)}</span>
            </h5>
          </div>

          <div className="ms-3 pb-3 text-truncate small fw-medium mt-2 d-flex align-items-center">
            <span>
              <FontAwesomeIcon
                icon={faMapMarker}
                className="me-2 text-success"
              />
            </span>
            <p className="p-0 m-0 fw-bold">{props.data.projectAddress}</p>
          </div>
        </a>
      </Link>
    </>
  );
}
