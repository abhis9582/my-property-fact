import "./newinsight.css";
import Image from "next/image";
import Link from "next/link";

export default function NewInsight() {
  // Defining insights data
  const insights = [
    {
      id: 1,
      heading: "EMI Calculator",
      sub_heading:
        "Compute Monthly EMI, Total Interest, Lifetime Cost Instantly; Adjust Loan Amount, Tenure, Rate...",
      href: "/emi-calculator",
      iconSrc: "/static/icon/Calci.svg",
    },
    {
      id: 2,
      heading: "Locate Score",
      sub_heading:
        "Compute Monthly EMI, Total Interest, Lifetime Cost Instantly; Adjust Loan Amount, Tenure, Rate...",
      href: "/locate-score",
      iconSrc: "/static/icon/Graph.svg",
    },
  ];

  // Returning the new insight section
  return (
    <div className="container-fluid bg-white new-insight-container my-4 my-lg-5">
      <div className="container insight-content-wrapper">
        <h2 className="insight-section-title">Expert Insights & Resources</h2>
        <div className="insight-layout">
          <div className="insight-cards">
            {insights.map((insight) => (
              <div className="insight-card" key={insight.id}>
                <div className="insight-icon-wrapper">
                  <Image
                    src={insight.iconSrc}
                    alt={`${insight.heading} icon`}
                    width={32}
                    height={32}
                    className="insight-icon"
                  />
                </div>
                <div className="insight-content">
                  <h3 className="insight-title">{insight.heading}</h3>
                  <p className="insight-description">{insight.sub_heading}</p>
                  <Link className="insight-link" href={insight.href}>
                    Explore Now
                    <span className="insight-link-arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="insight-image-wrapper">
            <Image
              src="/static/family.svg"
              alt="Family"
              width={604}
              height={308}
              className="insight-main-image"
              priority
            />
            <div className="insight-logo-wrapper">
              <Image
                src="/static/icon/jacob.svg"
                alt="Jacob & Co"
                width={170}
                height={82}
                className="insight-logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
