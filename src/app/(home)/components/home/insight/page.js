import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./insight.css";
import Link from "next/link";
export default function InsightNew() {
  const data = [
    {
      id: 1,
      src: "https://www.squareyards.com/assets/images/insight-tool-img/price-trends-img.png",
      alt: "price-trends-img",
      heading: "Property rates & trends",
      sub_heading:
        "market rates, data analytics & registred transactions of top project & localites",
      color: "light-green",
      button_color: "dark-green",
      href: "/property-rate-and-trend",
    },
    {
      id: 2,
      src: "https://www.squareyards.com/assets/images/insight-tool-img/property-rates-heatmap-img.png",
      alt: "property-rates-heatmap-img",
      heading: "Property Rates Heatmap",
      sub_heading:
        "market rates, data analytics & registred transactions of top project & localites",
      color: "light-pink",
      button_color: "dark-pink",
      href: "#",
    },
    {
      id: 3,
      src: "https://www.squareyards.com/assets/images/insight-tool-img/valuation-report-img.png",
      alt: "price-trends-img",
      heading: "Valuation Report",
      sub_heading:
        "Get an instant & comprehensive Valuation Report of any property - downloadable in PDF",
      color: "light-yellow",
      button_color: "dark-yellow",
      href: "#",
    },
    {
      id: 4,
      src: "https://www.squareyards.com/assets/images/insight-tool-img/reviews-ratings-img.png",
      alt: "price-trends-img",
      heading: "Property overviews & Ratings",
      sub_heading: "Don't just take our word for it; See what other residents",
      color: "light-blue",
      button_color: "dark-blue",
      href: "#",
    },
  ];
  return (
    <>
      <div className="container-fluid">
        <p className="h1 text-center fw-bold">Insights</p>
        <div className="container my-5">
          <div className="d-flex justify-content-center gap-30 my-3 flex-wrap">
            {data.map((i) => (
              <div key={i.id} className={`${i.color} insight-container`}>
                <Link href={i.href}>
                  <div className="insight-container-child">
                    <p>{i.heading}</p>
                    <p>{i.sub_heading}</p>
                    <img src={i.src} alt={i.alt} />
                  </div>
                  <div className={`${i.button_color} insight-explore-button`}>
                    <button className="fw-bold">Explore Now</button>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
