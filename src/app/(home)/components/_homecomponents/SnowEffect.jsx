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
      flake.style.fontSize = 8 + depth * 30 + "px";
      flake.style.opacity = 0.4 + depth * 0.6;
      flake.style.animationDuration = 4 + (1 - depth) * 6 + "s";

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
