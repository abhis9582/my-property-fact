import Image from "next/image";
import SocialFeedsOfMPF from "../components/_homecomponents/SocialFeedsOfMPF";

export default function NewContactUs() {
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
              <form className="get-quote-form">
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="text"
                      className="form-control get-quote-input"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="email"
                      className="form-control get-quote-input"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <input
                      type="tel"
                      className="form-control get-quote-input"
                      placeholder="Phone"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control get-quote-input"
                      placeholder="Preferred Time"
                      required
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-12">
                    <textarea
                      className="form-control get-quote-input get-quote-textarea"
                      placeholder="Message"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn get-quote-submit-btn">
                    Submit
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
            src="/static/contact-us/looking_for_Dream_home.png"
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
