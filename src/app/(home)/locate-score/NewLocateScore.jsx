"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./NewLocateScore.module.css";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const LOCATE_FACTORS = [
  "Local Economy",
  "Ongoing Projects",
  "Connectivity",
  "Amenities",
  "Trends",
  "Existing Supply-Demand",
];

const CHART_COLORS = ["#0d5834", "#166534", "#15803d", "#22c55e", "#4ade80", "#86efac"];

export default function NewLocateScore() {
  const [city, setCity] = useState("Noida");
  const [locality, setLocality] = useState("Sector 18");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [scoreError, setScoreError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchScore = async (cityName, localityName) => {
    setScoreError(null);
    setScoreResult(null);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_LOCATE_SCORE_API_URL}api/input`,
        { city: cityName, sector: localityName },
      );
      if (response.status !== 200) {
        setScoreError(response.data?.message || "Request failed");
        return;
      }
      const id = response.data.id;
      if (!id) {
        setScoreError("No job ID received");
        return;
      }
      let resolved = false;
      for (let attempt = 0; attempt < 60; attempt++) {
        const scoreResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_LOCATE_SCORE_API_URL}api/reply/${id}`,
        );
        if (scoreResponse.status !== 200) {
          setScoreError(scoreResponse.data?.message || "Failed to fetch score");
          return;
        }
        const { status, result, error } = scoreResponse.data;
        if (status === "done") {
          resolved = true;
          if (error) setScoreError(error);
          else if (result) setScoreResult(result);
          break;
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!resolved && !scoreError) {
        setScoreError("Score is taking longer than expected. Please try again.");
      }
    } catch (err) {
      setScoreError(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (city && locality) {
      setIsSubmitting(true);
      fetchScore(city, locality).finally(() => setIsSubmitting(false));
    }
  }, []);

  // city locality list
  const cityLocalityList = [
    {
      city: "Mumbai",
      locality: [
        {
          localityName: "Andheri",
          localityId: "101",
        },
        {
          localityName: "Borivali",
          localityId: "102",
        },
        {
          localityName: "Malad",
          localityId: "103",
        },
      ],
    },
    {
      city: "Noida",
      locality: [
        {
          localityName: "Sector 18",
          localityId: "201",
        },
        {
          localityName: "Sector 19",
          localityId: "202",
        },
        {
          localityName: "Sector 21",
          localityId: "203",
        },
      ],
    },
    {
      city: "Gurgaon",
      locality: [
        {
          localityName: "Sector 18",
          localityId: "301",
        },
        {
          localityName: "Sector 19",
          localityId: "302",
        },
        {
          localityName: "Sector 21",
          localityId: "303",
        },
      ],
    },
    {
      city: "Pune",
      locality: [
        {
          localityName: "Sector 18",
          localityId: "401",
        },
      ],
    },
    {
      city: "Chennai",
      locality: [
        {
          localityName: "Sector 18",
          localityId: "501",
        },
        {
          localityName: "Sector 19",
          localityId: "402",
        },
        {
          localityName: "Sector 21",
          localityId: "403",
        },
        {
          localityName: "Sector 22",
          localityId: "404",
        },
        {
          localityName: "Sector 23",
          localityId: "405",
        },
        {
          localityName: "Sector 24",
          localityId: "406",
        },
        {
          localityName: "Sector 25",
          localityId: "407",
        },
      ],
    },
    {
      city: "Hyderabad",
      locality: [
        {
          localityName: "Sector 18",
          localityId: "601",
        },
      ],
    },
    {
      city: "faridabad",
      locality: [
        {
          localityName: "Sector 18",
          localityId: "701",
        },
      ],
    },
  ];

  const chartData = useMemo(() => {
    if (!scoreResult?.breakdown || Object.keys(scoreResult.breakdown).length === 0) return null;
    const entries = Object.entries(scoreResult.breakdown);
    const labels = entries.map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    const values = entries.map(([, v]) => v);
    return {
      bar: {
        xAxis: [{ scaleType: "band", data: labels }],
        series: [{ data: values, type: "bar", label: "Score", color: "#0d5834" }],
      },
      pie: entries.map(([key, value], i) => ({
        id: i,
        value,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color: CHART_COLORS[i % CHART_COLORS.length],
      })),
    };
  }, [scoreResult?.breakdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetchScore(city, locality);
    setIsSubmitting(false);
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
            objectively, understand long-term growth potential, and make
            smarter, data-driven real-estate decisions with clarity and
            confidence.
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
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="locate-city" className={styles.label}>
                    City
                  </label>
                  <select
                    id="locate-city"
                    className={styles.select}
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    aria-label="Select city"
                  >
                    <option value="">Select a City</option>
                    {cityLocalityList.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="locate-locality" className={styles.label}>
                    Locality
                  </label>
                  <select
                    name="locate-locality"
                    id="locate-locality"
                    className={styles.select}
                    onChange={(e) => setLocality(e.target.value)}
                    value={locality}
                    aria-label="Select locality"
                    disabled={!city}
                  >
                    <option value="">Select a Locality</option>
                    {cityLocalityList
                      .find((c) => c.city === city)
                      ?.locality.map((loc) => (
                        <option key={loc.localityName} value={loc.localityName}>
                          {loc.localityName}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={styles.fieldGroupBtn}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting || !city || !locality}
                  >
                    {isSubmitting ? "Getting Score…" : "Get Score"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {scoreError && (
            <div className={styles.errorBanner} role="alert">
              {scoreError}
            </div>
          )}

          {scoreResult && (
            <article className={styles.scoreAnalysis} aria-labelledby="score-location">
              <header className={styles.scoreHero}>
                <h3 id="score-location" className={styles.scoreLocation}>
                  {scoreResult.city} · {scoreResult.sector}
                </h3>
                <div className={styles.gaugeWrap}>
                  {isMounted && (
                    <Gauge
                      value={Number(scoreResult.overallScore) ?? 0}
                      valueMin={0}
                      valueMax={100}
                      startAngle={-110}
                      endAngle={110}
                      innerRadius="78%"
                      outerRadius="100%"
                      className={styles.gauge}
                      sx={{
                        [`& .${gaugeClasses.valueArc}`]: { fill: "#0d5834" },
                        [`& .${gaugeClasses.referenceArc}`]: { fill: "rgba(13, 88, 52, 0.12)" },
                        [`& .${gaugeClasses.valueText}`]: {
                          fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                          fontWeight: 700,
                          fill: "#0c2e23",
                        },
                      }}
                      text={({ value }) => (value != null ? `${value}` : "")}
                      aria-labelledby="score-location"
                    />
                  )}
                </div>
                <span className={styles.scoreLabel}>{scoreResult.label}</span>
              </header>

              {chartData && isMounted && (
                <div className={styles.chartsRow}>
                  <div className={styles.chartCard}>
                    <h4 className={styles.chartTitle}>Factor breakdown</h4>
                    <div className={styles.chartInner}>
                      <BarChart
                        xAxis={chartData.bar.xAxis}
                        series={chartData.bar.series}
                        width={340}
                        height={280}
                        margin={{ top: 20, right: 20, bottom: 50, left: 40 }}
                        colors={CHART_COLORS}
                        borderRadius={6}
                        barLabel="value"
                        slotProps={{
                          legend: { hidden: true },
                        }}
                        sx={{
                          "& .MuiChartsAxis-tickLabel": { fontSize: "0.8rem" },
                          "& .MuiChartsAxis-label": { fontSize: "0.85rem" },
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.chartCard}>
                    <h4 className={styles.chartTitle}>Score distribution</h4>
                    <div className={styles.chartInner}>
                      <PieChart
                        series={[
                          {
                            data: chartData.pie,
                            innerRadius: 50,
                            outerRadius: 90,
                            paddingAngle: 2,
                            cornerRadius: 4,
                            highlightScope: { fade: "global", highlight: "item" },
                          },
                        ]}
                        width={260}
                        height={220}
                        slotProps={{
                          legend: { hidden: true },
                        }}
                        sx={{
                          "& .MuiChartsLegend-root": { display: "none" },
                        }}
                      />
                      <div className={styles.pieLegend}>
                        {chartData.pie.map((item) => (
                          <span key={item.id} className={styles.pieLegendItem}>
                            <span className={styles.pieLegendDot} style={{ background: item.color }} />
                            {item.label} {item.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {scoreResult.summary && (
                <div className={styles.summaryCard}>
                  <h4 className={styles.summaryTitle}>Summary</h4>
                  <p className={styles.summary}>{scoreResult.summary}</p>
                </div>
              )}

              {scoreResult.infrastructure && scoreResult.infrastructure.length > 0 && (
                <div className={styles.infrastructure}>
                  <h4 className={styles.infrastructureTitle}>Nearby infrastructure</h4>
                  <ul className={styles.infrastructureList}>
                    {scoreResult.infrastructure.map((item, i) => (
                      <li key={i} className={styles.infrastructureItem}>
                        <span className={styles.infraName}>{item.name}</span>
                        <span className={styles.infraMeta}>
                          {item.category} · {item.distance} km
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
