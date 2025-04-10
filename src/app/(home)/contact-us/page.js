"use client";
import Link from "next/link";
import "./contact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPhone,
  faUser,
  faVoicemail,
} from "@fortawesome/free-solid-svg-icons";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import CommonBreadCrum from "../components/common/breadcrum";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "react-bootstrap";
export default function ContactUs() {
  const [validated, setValidated] = useState(false);
  const [buttonName, setButtonName] = useState("Get a free service");
  const [showLoading, setShowLoading] = useState(false);
  //Defining form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  //Handling form submit
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    setShowLoading(true);
    setButtonName("");
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      toast.error("Please fill all fields!");
      setShowLoading(false);
      setButtonName("Get a free service");
      return;
    }
    if (form.checkValidity() === true) {
      e.preventDefault();
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}enquiry/post`, formData);
        if (response.data.isSuccess === 1) {
          toast.success(response.data.message);
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: ""
          });
          setButtonName("Get a free service");
          setShowLoading(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error);
        console.log(error);
      } finally {
        setShowLoading(false);
        setButtonName("Get a free service");
      }
    }
  }

  //Handle setting all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((item) => ({
      ...item,
      [name]: value
    }));
  }

  return (
    <>
      <CommonHeaderBanner image={"contact-banner.jpg"} headerText={"Contact Us"}/>
      <CommonBreadCrum pageName={"Contact-us"} />
      <div className="">
        <div className="container d-flex justify-content-center gap-4 flex-wrap">
          <div className="info-container-child">
            <p>Email Address</p>
            <p>info@mypropertyfact.com</p>
            <p>jobs@mypropertyfact.com</p>
          </div>
          <div className="info-container-child">
            <p>Phone Number</p>
            <p>+0123-456789</p>
            <p>+987-6543210</p>
          </div>
          <div className="info-container-child">
            <p>Office Address</p>
            <p>Tower 1, Corperate park</p>
            <p>Noida-142, India</p>
          </div>
        </div>
        <div className="contact-form-section">
          <form noValidate validated={validated + ""} onSubmit={handleSubmit}>
            <p className="fw-bold h5 mb-3">Get a quote</p>
            <div className="input-item">
              <input
                placeholder="Enter your name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange(e)}
              />
              <FontAwesomeIcon icon={faUser} width={20} />
            </div>
            <div className="input-item">
              <input
                placeholder="Enter your email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
                required
              />
              <FontAwesomeIcon icon={faVoicemail} width={20} />
            </div>
            <div className="input-item">
              <input
                placeholder="Enter your phone number"
                name="phone"
                type="number"
                value={formData.phone}
                onChange={(e) => handleChange(e)}
                required
              />
              <FontAwesomeIcon icon={faPhone} width={20} />
            </div>
            <div className="input-item">
              <textarea
                placeholder="Enter your message"
                name="message"
                className="custom-textarea"
                value={formData.message}
                onChange={(e) => handleChange(e)}
                required
              />
              <FontAwesomeIcon icon={faPencil} width={20} />
            </div>
            <button type="submit" disabled={showLoading}>{buttonName}<LoadingSpinner show={showLoading} /></button>
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
    </>
  );
}

export function LoadingSpinner({ show }) {
  return show ? (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  ) : ""
}