import {
  faInstagram,
  faYoutube,
  faYoutubeSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./social-feed.css";
export default function SocialFeed() {
  return (
    <>
      <div className="container-fluid my-4">
        <div className="container">
          <div className="heading mx-auto text-center">
            <h3>Social Media Feed</h3>
            <div className="toggleHead mt-3">
              <button className="toggleBtn active" style={{ color: "#c92bb7" }}>
                <FontAwesomeIcon icon={faInstagram} /> Instagram
              </button>
              <button className="toggleBtn" style={{ color: "red" }}>
                <FontAwesomeIcon icon={faYoutube} /> YouTube
              </button>
            </div>
          </div>
          <div className="row d-flex justify-content-center flex-wrap">
            <div className="social-post col-lg-3 col-sm-1">
              <img src="/social-views/post1.jpg" alt="" />
            </div>
            <div className="social-post col-lg-3 col-sm-1">
              <img src="/social-views/post3.jpg" alt="" />
            </div>
            <div className="social-post col-lg-3 col-sm-1">
              <img src="/social-views/post4.jpg" alt="" />
            </div>
            <div className="social-post col-lg-3 col-sm-1">
              <img src="/social-views/post5.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
