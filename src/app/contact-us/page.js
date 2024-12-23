import Link from "next/link";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation } from "@fortawesome/free-solid-svg-icons";

export default function ContactUs() {
  return (
    <>
      <Header />
      <div className="container-fluid m-0 p-0 mt-5">
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
      </div>
      <Footer />
    </>
  );
}
