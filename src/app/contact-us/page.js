import Link from "next/link";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import "./contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLocation,
  faPencil,
  faPhone,
  faUser,
  faVoicemail,
} from "@fortawesome/free-solid-svg-icons";

export default function ContactUs() {
  return (
    <>
      <Header />
      {/* <div className="container-fluid m-0 p-0 mt-5">
        <img
          src="https://www.starestate.com/assets/images/contact-us.jpg"
          alt="contact us banner"
        />
        <div className="w-100 mt-3">
          <div className="container-lg bg-light">
            <div className="breadcrumbContainer" aria-label="breadcrumb">
              <ol className="breadcrumb p-3">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item">About Us</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="container">
          <p className="h2 text-center mt-4">Contact us</p>
          <div className="row">
            <div className="col-md-6 p-3 bg-light">
              <div className="d-flex">
                <div className="">
                  <FontAwesomeIcon icon={faLocation} color="black" width={20} />
                </div>
                <p className="mt-3">Noida (Head Office)</p>
              </div>
            </div>
            <div className="col-md-6 p-3"></div>
          </div>
        </div>
      </div> */}
      <div className="contact-us">
        <div className="contactus-head">
          <h1>Contact us</h1>
          <div className="contact-nav">
            <FontAwesomeIcon icon={faHome} width={25} />
            <Link href="/">Home</Link>
            <span>&gt;</span>
            <p>Contact us</p>
          </div>
        </div>
        <div className="info-container">
          <div className="info-container-child">
            <p>Email Address</p>
            <p>info@webmail.com</p>
            <p>jobs@webexample.com</p>
          </div>
          <div className="info-container-child">
            <p>Phone Number</p>
            <p>+0123-456789</p>
            <p>+987-6543210</p>
          </div>
          <div className="info-container-child">
            <p>Office Address</p>
            <p>18/A, New Born Town Hall</p>
            <p>New York, US</p>
          </div>
        </div>
        <div className="contact-form-section">
          <form>
            <p className="fw-bold h5 mb-3">Get a quote</p>
            <div className="input-item">
              <input placeholder="Enter your name" name="name" type="text" />
              <FontAwesomeIcon icon={faUser} width={20} />
            </div>
            <div className="input-item">
              <input
                placeholder="Enter your email address"
                name="email"
                type="email"
              />
              <FontAwesomeIcon icon={faVoicemail} width={20} />
            </div>
            <div className="input-item">
              <input
                placeholder="Enter your phone number"
                name="number"
                type="number"
              />
              <FontAwesomeIcon icon={faPhone} width={20} />
            </div>
            <div className="input-item">
              <textarea
                placeholder="Enter your message"
                name="message"
                className="custom-textarea"
              />
              <FontAwesomeIcon icon={faPencil} width={20} />
            </div>
            <button>Get a free service</button>
          </form>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.2212431770063!2d77.40866827528409!3d28.50299057573584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce530165cc6c1%3A0x9ea28df462e9945e!2sRitz%20Media%20World-Digital%20Marketing%20Agency%20in%20Noida%20%7C%20Social%20Media%20Agency%20in%20Noida%20%7C%20Newspaper%20%26%20Radio%20Ad%20Agency%20in%20Noida!5e0!3m2!1sen!2sin!4v1738666960929!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: "100%", height: "500px" }}
          ></iframe>
        </div>
        <div className="looking-for-home">
          <div className="looking-for-home-child">
            <div className="looking-for-home-child-text">
              <p>Looking for a dream home?</p>
              <p>We can help you realize your dream of a new home</p>
            </div>
            <Link href="/projects">View Projects</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
