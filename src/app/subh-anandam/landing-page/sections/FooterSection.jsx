'use client';

import React from 'react';
import Image from 'next/image';
import logo from '../assets/logo.png';
import facebook from '../assets/Facebook.png';
import twitter from '../assets/Twitter.png';
import youtube from '../assets/Youtube.png';
import instagram from '../assets/Instagram.png';
import pinterest from '../assets/Pinterest.png';

const FooterSection = () => {
    const socialLinks = [
        { src: facebook, alt: 'Facebook', href: '#' },
        { src: twitter, alt: 'Twitter', href: '#' },
        { src: youtube, alt: 'YouTube', href: '#' },
        { src: instagram, alt: 'Instagram', href: '#' },
        { src: pinterest, alt: 'Pinterest', href: '#' },
    ];

    return (
        <footer className="footer-section pt-5" style={{ backgroundColor: '#1d1e22' }}>
            {/* Logo on Top Center */}
            <div className="text-center mb-4">
                <Image src={logo} alt="Logo" width={120} height={80} />
            </div>

            {/* White Background: Follow Us + Social Icons */}
            <div className="white-section py-3 px-4 mb-3 mx-auto">
                <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                    <p className="follow-text mb-0">Follow us:</p>
                    {socialLinks.map(({ src, alt, href }, index) => (
                        <a
                            key={index}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-link"
                        >
                            <Image src={src} alt={alt} width={32} height={32} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Keywords */}
            <div className="keywords d-flex justify-content-center align-items-center flex-wrap gap-3 py-3 px-3">
                {['Trust', 'Community', 'Sustainability', 'Legacy', 'Comfort', 'Vision'].map((word, idx) => (
                    <React.Fragment key={idx}>
                        {idx > 0 && <span className="divider">|</span>}
                        <span className="keyword">{word}</span>
                    </React.Fragment>
                ))}
            </div>

            {/* Copyright */}
            <div className="black-section text-white text-center py-3 px-2">
                © {new Date().getFullYear()} Shubh Anandam. All rights reserved.
            </div>

            <style jsx>{`
        .white-section {
          background-color: #ffffff;
          width: fit-content;
          max-width: 90vw;
          padding: 0.75rem 2rem;
          border-radius: 30px;
          box-sizing: border-box;
        }

        .follow-text {
          font-size: 18px;
          font-weight: 500;
          margin-right: 10px;
          color: #000;
          white-space: nowrap;
        }

        .icon-link :global(img) {
          transition: transform 0.2s ease-in-out;
          display: block;
        }

        .icon-link:hover :global(img) {
          transform: scale(1.1);
        }

        .keywords {
          font-size: 16px;
          font-weight: 500;
          color: white;
          max-width: 95vw;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }

        .divider {
          color: #ccc;
          margin: 0 6px;
          user-select: none;
        }

        .black-section {
          background-color: #000;
          font-size: 14px;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        /* Responsive tweaks */
        @media (max-width: 480px) {
          .follow-text {
            font-size: 16px;
          }
          .keywords {
            font-size: 14px;
          }
          .black-section {
            font-size: 12px;
          }
        }
      `}</style>
        </footer>
    );
};

export default FooterSection;
