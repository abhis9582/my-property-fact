"use client";

import React from "react";
import logo from "../assets/logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className="header-container">
      {/* Top-left Logo */}
      <div className="logo-container">
        <Image src={logo} alt="Logo" className="logo" />
      </div>

      {/* Top-right Button */}
      <div className="button-container">
        <button className="enquire-button">Enquire now</button>
      </div>

      {/* CSS */}
      <style jsx>{`
        .header-container {
          background-color: #fff;
          padding: 3rem;
          position: relative;
          width: 70%;
          margin: auto;
        }

        .logo-container {
          position: absolute;
          top: 0;
          left: 0;
          padding: 1rem 1.5rem;
          z-index: 1;
        }

        .button-container {
          position: absolute;
          top: 0;
          right: 0;
          padding: 1.3rem 1.5rem;
          z-index: 1;
        }

        .enquire-button {
          background-color: black;
          border-radius: 50px;
          padding: 13px 24px;
          font-size: 18px;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .enquire-button:hover {
          background-color: #333;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .header-container {
            padding: 2rem;
          }

          .enquire-button {
            padding: 10px 20px;
            font-size: 16px;
          }

          .logo-container,
          .button-container {
            padding: 0.75rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 2.7rem;
            width: 100%;
            margin: none;
          }

          .enquire-button {
            padding: 8px 16px;
            font-size: 14px;
            margin-top: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
