import "./newviews.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
export default function NewsViews() {
  return (
    <>
      <div className="container">
        <div className="row d-flex justify-contnet-center flex-wrap m-0">
          <div className="row">
            <div className="col-lg-3 col-sm-6 news-card">
              <Link className="inner" href="/awards">
                <p className="card-title">Highway Construction</p>
                <div className="img-fluid">
                  <Image
                    src="/news-views/Highway_const.jpg"
                    alt="highway_construction"
                    className="img-fluid rounded shadow-sm"
                    height={400}
                    width={350}
                    objectFit="cover"
                  />
                </div>
                <div className="arrow">
                  <FontAwesomeIcon icon={faArrowCircleRight} />
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 news-card">
              <Link className="inner" href="/news">
                <p className="card-title">News</p>
                <div className="img-fluid">
                  <Image
                    src="/news-views/Metro_Station.jpg"
                    alt="Metro_Station"
                    className="img-fluid rounded shadow-sm"
                    height={400}
                    width={350}
                    objectFit="cover"
                  />
                </div>
                <div className="arrow">
                  <FontAwesomeIcon icon={faArrowCircleRight} />
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 news-card">
              <Link className="inner" href="/events">
                <p className="card-title">Events</p>
                <div className="img-fluid">
                  <Image
                    src="/news-views/mne.jpg"
                    alt="mne"
                    className="img-fluid rounded shadow-sm"
                    height={400}
                    width={350}
                    objectFit="cover"
                  />
                </div>
                <div className="arrow">
                  <FontAwesomeIcon icon={faArrowCircleRight} />
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 news-card">
              <Link className="inner" href="/blogs">
                <p className="card-title">Blogs</p>
                <div className="img-fluid">
                  <Image
                    src="/news-views/Money_Distributiuon.jpg"
                    alt="Money_Distributiuon"
                    className="img-fluid rounded shadow-sm"
                    height={400}
                    width={350}
                    objectFit="cover"
                  />
                </div>
                <div className="arrow">
                  <FontAwesomeIcon icon={faArrowCircleRight} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
