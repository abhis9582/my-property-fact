"use client";
import { useEffect, useState } from 'react';

export default function CSSLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple check for CSS loading - just wait a short time
    // Since we're now loading critical CSS in the CSS file, this is mainly for UX
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Very short delay for smooth transition
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoaded) {
    return null;
  }

  return (
    <div className="portal-loading">
      <div className="portal-loading-content">
        <div className="portal-loading-spinner"></div>
        <div className="portal-loading-text">Loading Portal...</div>
        <div className="portal-loading-subtitle">Preparing your dashboard</div>
      </div>
    </div>
  );
}
