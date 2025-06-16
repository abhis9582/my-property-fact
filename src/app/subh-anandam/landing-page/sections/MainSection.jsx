"use client";

import React from "react";

const MainSection = () => {
  return (
    <div className="main-section container-fluid position-relative d-flex flex-column flex-md-row px-3 px-md-5">
      {/* Left: About Section */}
      <div className="left-section d-flex flex-column justify-content-center w-100 w-md-50 pe-md-4 mb-4 mb-md-0">
        <h2 className="mb-3">About Subh Anandam</h2>
        <p>
          About Shubh Anandam A Legacy of Harmony, A Future of Fulfillment Shubh
          Anandam is more than a housing project — it is a thoughtfully built
          ecosystem where comfort, culture, and community come together. With
          integrated townships across different parts of India, we offer spaces
          that go beyond just living — they inspire a way of life that is rooted
          in values and designed for tomorrow. Every detail — from
          Vastu-compliant planning to lush green environments and holistic
          amenities — reflects our belief in creating not just homes, but
          experiences that nurture body, mind, and soul. Whether it is your
          first home or a generational gift, Shubh Anandam brings together
          spiritual serenity, modern infrastructure, and community harmony — all
          under one timeless vision. Crafted with Purpose. Designed for
          Generations.
        </p>
      </div>

      {/* Right: Form Section */}
      <div className="right-section w-100 w-md-50 d-flex justify-content-center align-items-center position-relative">
        <div className="form-container bg-white shadow p-4">
          <h5 className="mb-3">Contact Us</h5>
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                style={{ padding: "15px 30px" }}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                style={{ padding: "15px 30px" }}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                style={{ padding: "15px 30px" }}
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Message"
                rows="3"
                style={{ padding: "15px 30px" }}
              />
            </div>
            <button type="submit" className="w-100">
              Submit Enquery
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        h2 {
          font-size: 36px;
          font-weight: 600;
        }
        p {
          font-size: 18px;
          line-height: 34px;
        }
        .main-section {
          height: 60vh;
          padding-left: 3rem;
          padding-right: 3rem;
          background-color: #f8f9fa;
          width: 80%;
          margin: auto;
          position: relative;
        }
        .form-container {
          width: 100%;
          max-width: 400px;
          height: 520px;
          z-index: 2;
          border-radius: 30px;
          position: relative;
          top: -6rem;
          transition: top 0.3s ease;
        }

        h5 {
          font-size: 36px;
          font-weight: 600;
        }

        button {
          background-color: #f0d21f;
          border: none;
          padding: 15px 30px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Responsive tweaks */
        @media (max-width: 767.98px) {
          .main-section {
            height: auto;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
            width: 95%;
          }
          h2 {
            font-size: 28px;
          }
          p {
            font-size: 16px;
            line-height: 28px;
          }
          h5 {
            font-size: 28px;
          }
          .form-container {
            position: static !important;
            max-width: 100%;
            top: 0 !important;
            border-radius: 20px;
            padding: 20px;
          }
          button {
            padding: 12px 24px;
            font-size: 1rem;
          }
          .left-section {
            padding-right: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MainSection;
