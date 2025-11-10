'use client';

import { useEffect, useRef } from "react";
import Script from "next/script";

const BRANDING_SELECTOR = 'a[title="Free Instagram Feed widget"]';

export default function InstagramFeed() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const hideBranding = () => {
      const branding = containerRef.current?.querySelector(BRANDING_SELECTOR);
      if (branding) {
        branding.remove();
      }
    };

    hideBranding();

    const observer = new MutationObserver(() => {
      hideBranding();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="container">
      <h2 className="text-center my-5 fw-bold">
        Social Feeds from MPF on Instagram
      </h2>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div
        className="elfsight-app-f0906f8a-29a5-4d38-b76b-000317821522"
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}

