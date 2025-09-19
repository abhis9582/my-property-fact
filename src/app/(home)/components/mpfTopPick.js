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
          <div className="col-12 col-md-12 col-xl-4 mb-3 d-flex justify-content-center align-items-center">
            <div className="d-block d-md-flex gap-5 d-lg-block d-xl-block">
              <div className="d-flex d-md-block d-lg-flex d-xl-flex align-items-center justify-centent-center">
                <div className="rounded-3 project-logo-container">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/bhutani-62-avenue/81e404b6-3a46-4a92-8eab-2b92ae502530.jpg`}
                    alt="bhutani-62-avenue"
                    width={180}
                    height={50}
                    className="img-fluid"
                    priority
                  />
                </div>
                <div className="ms-4">
                  <h4 className="mpf-top-pic-project-name">Bhutani</h4>
                  <Link
                    href="/builder/bhutani-infra"
                    className="fs-6 golden-text text-underline"
                    aria-label={`View details about oberoi-realty`}
                  >
                    View Projects by Bhutani
                  </Link>
                </div>
              </div>
              <div className="mpf-top-pic-project-details">
                <div className="my-4">
                  <h2>Bhutani 62 Avenue</h2>
                  <div className="d-flex align-items-center gap-2 mpf-top-pic-address-container">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      color="green"
                      fontSize={16}
                    />
                    <p className="m-0 p-0">Sector 62, Noida</p>
                  </div>
                </div>
                <div className="my-4">
                  <h4>35 Lakh*</h4>
                  <p>Retail shops</p>
                </div>
                <Link
                  href="/bhutani-62-avenue"
                  className="btn-background rounded-pill border-0 px-3 py-2 fs-6 text-white mb-3 text-decoration-none"
                  aria-label={`View details about bhutani`}
                >
                  More About Bhutani 62 Avenue
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-xl-8 m-0 p-0 position-relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/bhutani-62-avenue/45aee5c0-cbfb-40b8-899b-88552029279f.jpg`}
              alt="top-picks"              
              width={1536}
              height={1024}
              className="rounded-3 position-relative img-fluid"
            />
          </div>
        </div>
      </div>
    </>
  );
}
