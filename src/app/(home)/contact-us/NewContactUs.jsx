"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import SocialFeedsOfMPF from "../components/_homecomponents/SocialFeedsOfMPF";

export default function NewContactUs() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredTime: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      toast.error("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);
    setValidated(true);

    try {
      // Prepare enquiry data
      const enquiryData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.preferredTime 
          ? `Preferred Time: ${formData.preferredTime}\n\nMessage: ${formData.message}`
          : formData.message,
        pageName: "Contact Us - Get A Quote",
        enquiryFrom: "Contact Us Page",
        projectLink: `${process.env.NEXT_PUBLIC_ROOT_URL || window.location.origin}${pathname}`,
        status: "PENDING",
        id: 0, // Required for new enquiry
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}enquiry/post`,
        enquiryData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "Enquiry submitted successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferredTime: "",
          message: "",
        });
        setValidated(false);
      } else {
        toast.error(response.data.message || "Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "An error occurred. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Contact inforamtion of MPF here  */}
      <div className="container-fluid">
        <div className="container">
          <div className="row py-5">
            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
              <div className="contact-info-container border">
                <div className="contact-info-container-child">
                  <div>
                    <Image
                      src="/static/contact-us/location_pin.png"
                      alt="Location_icon"
                      width={27}
                      height={36}
                    />
                  </div>
                  <h3 className="plus-jakarta-sans-bold">Address</h3>
                  <p>6th Floor Tower A1, Corporate Park, Noida-142, India</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 p-2">
              <div className="contact-info-container border">
                <div className="contact-info-container-child">
                  <div>
                    <Image
                      src="/static/contact-us/phone.png"
                      alt="Phone_icon"
                      width={31}
                      height={31}
                    />
                  </div>
                  <h3 className="plus-jakarta-sans-bold">Phone Number</h3>
                  <p>8920024793</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 p-2">
              <div className="contact-info-container border">
                <div className="contact-info-container-child">
                  <div>
                    <Image
                      src="/static/contact-us/email.png"
                      alt="Email_icon"
                      width={34}
                      height={27}
                    />
                  </div>
                  <h3 className="plus-jakarta-sans-bold">Email Address</h3>
                  <p>social@mypropertyfact.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* get a quote section here  */}
      <div
        className="container-fluid get-quote-section"
        style={{ background: "#000000D9" }}
      >
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <h2 className="get-quote-heading plus-jakarta-sans-bold text-center mb-4">
                Get A Quote
              </h2>
              <form className="get-quote-form" onSubmit={handleSubmit} noValidate>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="text"
                      name="name"
                      className="form-control get-quote-input"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      name="email"
                      className="form-control get-quote-input"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="tel"
                      name="phone"
                      className="form-control get-quote-input"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="preferredTime"
                      className="form-control get-quote-input"
                      placeholder="Preferred Time"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12">
                    <textarea
                      name="message"
                      className="form-control get-quote-input get-quote-textarea"
                      placeholder="Message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn get-quote-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Looking for a dream home section  */}
      <div className="container-fluid looking-for-dream-home-section">
        <div className="looking-for-dream-home-section-image1">
          <Image
            src="/static/contact-us/looking_for_Dream_home_bg.png"
            alt="Dream Home"
            width={414}
            height={603}
          />
        </div>
        <div className="looking-for-dream-home-section-content">
          <h2 className="plus-jakarta-sans-bold">Looking For A Dream Home?</h2>
          <p>We can help you realize your dream of a new home</p>
          <div>
            <button>View Projects</button>
          </div>
        </div>
        <div className="looking-for-dream-home-section-image2">
          <Image
            src="/static/contact-us/looking_for_dream_home.png"
            alt="Dream Home"
            width={480}
            height={500}
          />
        </div>
      </div>

      {/* social media feeds section  */}
      <SocialFeedsOfMPF />

      {/* Location map section with full width  */}
      <div className="container-fluid mt-3 mb-2 p-0 map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.221511536636!2d77.41139419999999!3d28.502982499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce530165cc6c1%3A0x9ea28df462e9945e!2sRitz%20Media%20World!5e0!3m2!1sen!2sin!4v1764832099403!5m2!1sen!2sin"
          className="contact-map-iframe"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        ></iframe>
      </div>
    </>
  );
}
