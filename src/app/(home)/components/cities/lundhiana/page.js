import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ludhiana.css";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { faFontAwesome } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export default function Lundhiana() {
  const propertiesArray = [
    {
      name: "Rajdarbar Spaces",
      price: "PRICE ON REQUEST",
      location: "MANGHTI, LUDHIANA",
      type: "NEW-LAUNCH",
      image: "/ludhiana/image3.jpg",
    },
    {
      name: "Godrej Sunrise Estate",
      price: "PRICE ON REQUEST",
      location: "ORAGADAM, LUDHIANA",
      type: "RESIDENTIAL",
      image: "/ludhiana/image2.jpg",
    },
    {
      name: "Amarpali Estate",
      price: "PRICE ON REQUEST",
      location: "ORAGADAM, LUDHIANA",
      type: "RESIDENTIAL",
      image: "/ludhiana/image4.jpg",
    },
    {
      name: "Vrinda Dhani Orchid",
      price: "PRICE ON REQUEST",
      location: "SASTRIPURAM, LUDHIANA",
      type: "RESIDENTIAL",
      image: "/ludhiana/image5.jpg",
    },
    {
      name: "OP Chains Anthela",
      price: "PRICE ON REQUEST",
      location: "ORAGADAM, LUDHIANA",
      type: "RESIDENTIAL",
      image: "/ludhiana/image6.jpg",
    },
    {
      name: "Eldeco Viviana",
      price: "PRICE ON REQUEST",
      location: "PAKHOWAL ROAD, LUDHIANA",
      type: "RESIDENTIAL",
      image: "/ludhiana/image7.jpg",
    },
  ];
  return (
    <>
      <div className="container-fluid mt-5 p-0">
        <div className="city-banner d-flex justify-content-center align-items-center">
          <h2 className="text-light">Welcome to Lundhiana</h2>
        </div>
        <div className="container">
          <div
            className="breadcrumbContainer mt-3 mb-3"
            aria-label="breadcrumb"
          >
            <ol className="breadcrumb p-3">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="#">Projects</Link>
              </li>
              <li className="breadcrumb-item active">Ludhiana</li>
            </ol>
          </div>
          <div className="row">
            <h2 className="text-center">Property in Ludhiana</h2>
            <p className="text-center">
              With rapid development, the demand for residential property in
              Agra is growing largely. Located on the banks of river Yamuna, the
              city welcomes tourists all through the year. Hence, there is
              maximum potential to garner a high return on investment.
            </p>
            <div className="text-center">
              <button className="btn btn-success">Read More</button>
            </div>
          </div>
          <div className="row d-flex flex-wrap mt-3 mb-4">
            {propertiesArray.map((item) => (
              <div key={item.name} className="col-md-4 mt-4 properties-container">
                <Link href="https://eldecogroup.com/landing-page/eldecoviviana/index.html">
                  <div>
                    <img
                      className="prop-image"
                      src={item.image}
                      alt="dynamic image"
                    />
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-8 col-6 d-flex align-items-center">
                      <h4>{item.name}</h4>
                    </div>
                    <div className="col-md-4 col-6 d-flex justify-content-center align-items-center">
                      <small className="text-success">{item.price}</small>
                    </div>
                  </div>
                  <hr className="dotted-line" />
                  <div className="mt-0 text-start d-flex">
                    <p className="property-bottom">
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        width={15}
                        height={15}
                        color="green"
                      />{" "}
                      {item.location}
                    </p>
                    <p className="mx-4 property-bottom">
                      <FontAwesomeIcon
                        icon={faFontAwesome}
                        width={12}
                        height={12}
                        color="green"
                      />{" "}
                      {item.type}
                    </p>
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
