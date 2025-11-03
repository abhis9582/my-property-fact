import Image from "next/image";
import Link from "next/link";
import "./common.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function MpfTopPicks({ topProject }) {
  const generatePrice = (price) => {
    if (/[a-zA-Z]/.test(price)) {
      return price;
    }
    return price < 1
      ? "₹ " + Math.round(parseFloat(price) * 100) + " Lakh* Onwards"
      : "₹ " + parseFloat(price) + " Cr* Onwards";
  };
  return (
    <>
      <div className="container pt-5 top-space">
        <div className="d-flex flex-wrap justify-content-between mb-3">
          <div>
            <h2 className="fs-1 fs-md-3 pt-2 fw-bold">
              My Property Fact&#39;s Top Picks
            </h2>
            <p className="fs-4 fs-md-3">Explore top living options with us</p>
          </div>
        </div>
        <div className="row border rounded-3 p-2 p-md-3 mpf-top-picks">
          <div className="col-12 col-md-12 col-xl-4 mb-3 mb-md-0 d-flex justify-content-center align-items-center">
            <div className="d-block d-md-flex gap-5 d-lg-block d-xl-block w-100">
              <div className="d-flex d-md-block d-lg-flex d-xl-flex align-items-center justify-content-center gap-3 gap-md-5">
                <div className="rounded-3 project-logo-container">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${topProject.slugURL}/${topProject.projectLogo}`}
                    alt={topProject.slugURL}
                    width={180}
                    height={50}
                    className="img-fluid"
                    priority
                  />
                </div>
                <div className="ms-md-4 ms-0">
                  <h4 className="mpf-top-pic-project-name fs-4 fs-md-3">
                    {topProject.builderName}
                  </h4>
                  <Link
                    href={`/builder/${topProject.builderSlug}`}
                    className="fs-6 fs-md-5 golden-text text-underline"
                    aria-label={`View details about ${topProject.builderName}`}
                  >
                    View Projects by {topProject.builderName}
                  </Link>
                </div>
              </div>
              <div className="mpf-top-pic-project-details mt-3 mt-md-0">
                <div className="my-3 my-md-4">
                  <h2 className="fw-bold fs-3 fs-md-2">{topProject.projectName}</h2>
                  <div className="d-flex align-items-center gap-2 mpf-top-pic-address-container">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      color="green"
                      fontSize={16}
                    />
                    <p className="m-0 p-0">{topProject.projectAddress}</p>
                  </div>
                </div>
                <div className="my-3 my-md-4">
                  <h4 className="fs-4 fs-md-3">{generatePrice(topProject.projectPrice)}</h4>
                  <p className="fs-5 fs-md-6">{topProject.projectConfiguration}</p>
                </div>
                <Link
                  href={`/${topProject.slugURL}`}
                  className="btn-background rounded-pill border-0 px-3 px-md-4 py-2 fs-6 text-white mb-3 text-decoration-none d-inline-block"
                  aria-label={`View details about ${topProject.projectName}`}
                >
                  More About {topProject.projectName}
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-xl-8 m-0 p-0 position-relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${topProject.slugURL}/${topProject.projectBannerImage}`}
              alt={topProject.projectName}
              width={1536}
              height={1024}
              className="rounded-3 position-relative img-fluid mpf-top-pic-image"
            />
          </div>
        </div>
      </div>
    </>
  );
}
