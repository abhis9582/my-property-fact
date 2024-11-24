import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./insight.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function Insight() {
  return (
    <>
      <div className="container">
        <p className="h1 text-center mb-4">Insights & Tools</p>
        <div className="row justify-content-center">
          <div className="col-md-3 d-flex justify-content-center">
            <div className="my-2">
              <img
                className="insight-image"
                src="/insight-tools/img-emi.webp"
                alt="img-emi"
              />
              <div className="insight-button">
                <Link href="#">
                  Explore More
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    width={40}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3 d-flex justify-content-center">
            <div className="my-2">
              <img
                className="insight-image"
                src="/insight-tools/img-evaluation-report.webp"
                alt="img-evaluation-report"
              />
              <div className="insight-button">
                <Link href="#">
                  Explore More
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    width={40}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3 d-flex justify-content-center">
            <div className="my-2">
              <img
                className="insight-image"
                src="/insight-tools/img-nri.webp"
                alt="img-nri"
              />
              <div className="insight-button">
                <Link href="#">
                  Explore More
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    width={40}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-3 d-flex justify-content-center">
            <div className="my-2">
              <img
                className="insight-image"
                src="/insight-tools/img-realty-check.webp"
                alt="img-realty-check"
              />
              <div className="insight-button">
                <Link href="#">
                  Explore More
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    width={40}
                    height={20}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
