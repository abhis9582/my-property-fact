import "bootstrap/dist/css/bootstrap.min.css";
import "./newviews.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
export default function NewsViews() {
  return (
    <>
      <div className="container-fluid pt-3 pb-3 mb-3 bg-lightgreen">
        <div className="container">
          <h1 className="text-center h2">News & Views</h1>
          <div className="row d-flex justify-contnet-center flex-wrap m-0">
            <div className="row g-3 gap-form-row">
              <div className="col-lg-3 col-sm-6 news-card">
                <Link className="inner" href="/awards">
                  <h5 className="card-title">Awards</h5>
                  <div className="img-fluid">
                    <img src="/news-views/awards.jpg" alt="" />
                  </div>
                  <div className="arrow">
                    <FontAwesomeIcon icon={faArrowCircleRight} />
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 col-sm-6 news-card">
                <Link className="inner" href="/news">
                  <h5 className="card-title">News</h5>
                  <div className="img-fluid">
                    <img src="/news-views/news.jpg" alt="" />
                  </div>
                  <div className="arrow">
                    <FontAwesomeIcon icon={faArrowCircleRight} />
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 col-sm-6 news-card">
                <Link className="inner" href="/events">
                  <h5 className="card-title">Events</h5>
                  <div className="img-fluid">
                    <img src="/news-views/events.jpg" alt="" />
                  </div>
                  <div className="arrow">
                    <FontAwesomeIcon icon={faArrowCircleRight} />
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 col-sm-6 news-card">
                <Link className="inner" href="/blogs">
                  <h5 className="card-title">Blogs</h5>
                  <div className="img-fluid">
                    <img src="/news-views/blogs.jpg" alt="" />
                  </div>
                  <div className="arrow">
                    <FontAwesomeIcon icon={faArrowCircleRight} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
