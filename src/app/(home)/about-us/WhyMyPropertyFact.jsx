"use client";
import Image from "next/image";
import "./aboutus.css";
export default function WhyMyPropertyFact() {
  return (
    <>
      <div className="container-fluid position-relative why-mpf-section">
        <div className="why-mpf-section-top-imgae"></div>
        <div>
          <h2 className="text-center plus-jakarta-sans-bold pt-5">
            Why My Property Fact?
          </h2>
        </div>
        <div className="container why-mpf-cards-section-container text-center z-index-2">
          <div className="why-mpf-cards-section-container-inner">
            <div className="d-flex gap-5 align-items-center justify-content-between py-5">
              <div className="why-mpf-card">
                <h3 className="why-mpf-card-title">Holistic Platform</h3>
                <p className="why-mpf-card-text">
                  Find everything from residential rentals to large-scale
                  commercial investments in one place.
                </p>
              </div>
              <div className="vertical-divs d-flex flex-column gap-5 align-items-center justify-content-center">
                <div className="why-mpf-card">
                  <h3 className="why-mpf-card-title">Holistic Platform</h3>
                  <p className="why-mpf-card-text">
                    Find everything from residential rentals to large-scale
                    commercial investments in one place.
                  </p>
                </div>
                <div className="why-mpf-card">
                  <h3 className="why-mpf-card-title">Holistic Platform</h3>
                  <p className="why-mpf-card-text">
                    Find everything from residential rentals to large-scale
                    commercial investments in one place.
                  </p>
                </div>
              </div>
              <div className="why-mpf-card">
                <h3 className="why-mpf-card-title">Holistic Platform</h3>
                <p className="why-mpf-card-text">
                  Find everything from residential rentals to large-scale
                  commercial investments in one place.
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between why-mpf-section-bottom-container">
              <div className="why-mpf-section-bottom-image-container">
                <Image
                  src="/static/about-us/image_shaped.png"
                  alt="why-mpf-section-bottom-image"
                  width={588}
                  height={532}
                />
              </div>
              <div className="d-flex flex-column gap-5 align-items-center image-contant-bottom-container">
                <div className="why-mpf-card">
                  <div>
                    <h3 className="why-mpf-card-title">Holistic Platform</h3>
                    <p className="why-mpf-card-text">
                      Find everything from residential rentals to large-scale
                      commercial investments in one place.
                    </p>
                  </div>
                </div>
                <div className="image-bottom-container">
                  <Image
                    src="/static/about-us/why_mpf.png"
                    alt="why-mpf-section-bottom-image"
                    width={544}
                    height={363}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="our-commitment-container">
            <div className="our-commitment-content-container">
              <h2 className="our-commitment-heading plus-jakarta-sans-bold">
                Our Commitment
              </h2>
              <div className="our-commitment-text-container">
                <p className="text-center">
                  We're Committed To Transparency, Innovation, And Reliability.
                  By Harnessing The Power Of Technology And A Dedicated Support
                  Team, We Aim To Make The Entire Real Estate Journey—From
                  Initial Search To Final Closing—As Smooth And Rewarding As
                  Possible.
                </p>
                <p className="text-center">
                  Join Us At{" "}
                  <span className="our-commitment-link">
                    www.mypropertyfact.Com
                  </span>{" "}
                  And Discover A New Way To Explore Real Estate. Whether You Are
                  Buying, Renting, Or Investing, My Property Fact Is Here To
                  Help You Make Your Next Move With Confidence.
                </p>
              </div>
              <div className="our-commitment-button-container">
                <button className="our-commitment-button">Read More</button>
              </div>
            </div>
          </div>
        </div>
        <div className="our-commitment-container-bottom"></div>
      </div>
    </>
  );
}
