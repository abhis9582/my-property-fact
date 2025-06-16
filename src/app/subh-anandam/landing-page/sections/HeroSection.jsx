"use client";

import React from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import bgImage from "../assets/image.png";

const HeroSection = () => {
  return (
    <div className="hero-section position-relative text-white">
      {/* Background Image */}
      <Image
        src={bgImage}
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-n1"
        priority
      />

      {/* Dark Overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overlay z-0"></div>

      {/* Top-left Logo with margin */}
      <div className="position-absolute top-0 start-0 z-1 p-3 p-sm-4 ms-3 ms-sm-4 mt-3 mt-sm-3">
        <Image src={logo} alt="Logo" width={80} height={60} />
      </div>

      {/* Top-right Button with margin */}
      <div className="position-absolute top-0 end-0 z-1 p-3 p-sm-4 me-3 me-sm-4 mt-3 mt-sm-3">
        <button className="cta-btn">Enquire now</button>
      </div>

      {/* Centered Heading */}
      <div className="d-flex justify-content-center align-items-center h-100 z-1 position-relative px-3">
        <h1 className="display-5 display-sm-4 fw-bold text-center">
          Coming Soon...
        </h1>
      </div>

      <style jsx>{`
        .hero-section {
          height: 60vh;
          overflow: hidden;
        }
        .overlay {
          background-color: rgba(0, 0, 0, 0.25);
        }
        .cta-btn {
          background-color: white;
          color: black;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.3s;
          font-size: 0.9rem;
        }
        .cta-btn:hover {
          background-color: #f1f1f1;
        }
        @media (min-width: 576px) {
          .hero-section {
            height: 70vh;
          }
          .cta-btn {
            padding: 10px 20px;
            font-size: 1rem;
          }
        }
        @media (max-width: 575.98px) {
          h1 {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
