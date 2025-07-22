import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";
import "./common.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function MpfTopPicks() {
  return (
    <>
      <div className="container pt-5 top-space">
        <div className="d-flex flex-wrap justify-content-between mb-3">
          <div>
            <h2 className="fs-1 pt-2">My Property Fact&#39;s Top Picks</h2>
            <p className="fs-3">Explore top living options with us</p>
          </div>
        </div>
        <div className="row mb-5 border rounded-3 p-2 mpf-top-picks">
          <div className="col-md-4 d-flex justify-content-center align-items-center">
            <div>
              <div className="d-flex align-items-center justify-centent-center">
                <div className="rounded-3 project-logo-container">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/oberoi-sky-city/2e17d502-6db2-47f7-82bc-57361ee83f27.png`}
                    alt="Birla Arika"
                    width={80}
                    height={80}
                    className="img-fluid"
                    unoptimized
                  />
                </div>
                <div className="ms-4">
                  <h4 className="mpf-top-pic-project-name">Oberoi Realty</h4>
                  <Link
                    href="/builder/oberoi-realty"
                    className="fs-6 golden-text text-underline"
                  >
                    View Projects
                  </Link>
                </div>
              </div>
              <div className="mpf-top-pic-project-details">
                <div className="my-4">
                  <h2>Oberoi Sky City</h2>
                  <div className="d-flex align-items-center gap-2 mpf-top-pic-address-container">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      color="green"
                      fontSize={16}
                    />
                    <p className="m-0 p-0">Borivali East, Mumbai</p>
                  </div>
                </div>
                <div className="my-4">
                  <h3>3.9 Cr* Onwards</h3>
                  <p>3BHK Apartments</p>
                </div>
                <Button className="btn-background rounded-pill border-0 px-5 py-2 fs-4">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-8 m-0 p-0 position-relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/oberoi-sky-city/4be6cf23-becc-473d-aad8-7dd5fb69b965.webp`}
              alt="top-picks"
              unoptimized
              fill
              className="rounded-3 position-relative mpf-top-pic-project-image"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      </div>
    </>
  );
}
