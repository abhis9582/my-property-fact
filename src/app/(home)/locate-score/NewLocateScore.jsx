"use client";

import { useState } from "react";
import styles from "./NewLocateScore.module.css";

const LOCATE_FACTORS = [
  "Local Economy",
  "Ongoing Projects",
  "Connectivity",
  "Amenities",
  "Trends",
  "Existing Supply-Demand",
];

export default function NewLocateScore() {
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: wire to LOCATE score API
    setTimeout(() => setIsSubmitting(false), 800);
  };

  return (
    <section className={styles.section} aria-labelledby="locate-score-heading">
      <div className="container">
        <div className={styles.wrapper}>
          <h2 id="locate-score-heading" className={styles.heading}>
            LOCATE Score Analysis
          </h2>
          <p className={styles.subheading}>
            The LOCATE Score is My Property Fact&apos;s proprietary 1000-point
            framework that evaluates any location using six critical factors. It
            helps buyers and investors compare cities and micro-markets
            objectively, understand long-term growth potential, and make smarter,
            data-driven real-estate decisions with clarity and confidence.
          </p>

          <div className={styles.factors}>
            {LOCATE_FACTORS.map((factor) => (
              <span key={factor} className={styles.factorPill}>
                {factor}
              </span>
            ))}
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Get your LOCATE Score</h3>
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="locate-city" className={styles.label}>
                    City
                  </label>
                  <input
                    type="text"
                    id="locate-city"
                    className={styles.input}
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="locate-locality" className={styles.label}>
                    Locality
                  </label>
                  <input
                    type="text"
                    id="locate-locality"
                    className={styles.input}
                    placeholder="Enter locality name"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Getting Score…" : "Get Score"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
