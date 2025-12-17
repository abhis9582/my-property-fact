"use client";

import { useEffect, useRef } from "react";

export default function SnowEffect() {
  const snowRef = useRef(null);
  const flakes = ["❄", "❅", "❆"];

  useEffect(() => {
    const snow = snowRef.current;
    if (!snow) return;

    function createSnowflake() {
      const flake = document.createElement("div");
      flake.classList.add("snowflake");
      flake.textContent = flakes[Math.floor(Math.random() * flakes.length)];

      flake.style.left = Math.random() * window.innerWidth + "px";

      const depth = Math.random();
      const fontSize = 8 + depth * 30;
      flake.style.fontSize = fontSize + "px";
      flake.style.opacity = 0.4 + depth * 0.6;
      flake.style.animationDuration = 8 + (1 - depth) * 6 + "s";
      
      // Force white color and add realistic snow shadow effect
      flake.style.color = "#ffffff";
      // Add shadow with glow and depth - adjust shadow intensity based on size
      const shadowBlur = Math.max(8, fontSize * 0.3);
      const shadowOffset = Math.max(2, fontSize * 0.1);
      flake.style.textShadow = `
        0 0 ${shadowBlur}px rgba(255, 255, 255, 0.8),
        0 ${shadowOffset}px ${shadowOffset * 2}px rgba(0, 0, 0, 0.3),
        0 ${shadowOffset * 0.5}px ${shadowOffset}px rgba(0, 0, 0, 0.2)
      `;
      // Apply stronger desaturation for larger snowflakes to remove blue tint
      if (fontSize > 20) {
        flake.style.filter = "brightness(1.8) saturate(0.1) contrast(1.2)";
        flake.style.webkitFilter = "brightness(1.8) saturate(0.1) contrast(1.2)";
      }

      flake.addEventListener("animationend", () => flake.remove());
      snow.appendChild(flake);
    }

    // Create a new snowflake every 120 milliseconds
    const interval = setInterval(createSnowflake, 120);

    // Cleanup interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div id="snow" ref={snowRef}></div>;
}
