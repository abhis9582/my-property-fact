import Link from "next/link";
import Footer from "../../footer/page";
import Header from "../../header/page";
import Image from "next/image";

export default function Eldeco() {
  return (
    <>
      <div className="insideBanner">
        <picture>
          <source
            media="(max-width: 414px)"
            srcSet="/canarybannermob1.webp"
          />
          <Image fill
            src="/canarybannermob1.webp"
            className="h-100 object-cover"
            alt="About star estate"
          />
        </picture>
        <div className="bannerContainer">
          <h1 className="h2 ">Eldeco Group</h1>
        </div>
      </div>

      <div className="breadcrumbContainer" aria-label="breadcrumb">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/components/home">Home </Link>
            </li>
            <li className="breadcrumb-item " aria-current="page">
              <Link href="/compoents/projects">Projects</Link>
            </li>
            <li
              className="breadcrumb-item text-capitalize active"
              aria-current="page"
            >
              Eldeco Group
            </li>
          </ol>
        </div>
      </div>
      <div className="w-100 padding pb-0 position-relative overflow-hidden">
        <div className="container section-details modulecontent">
          <p>
            With A Legacy Of Three Decades, ABA Corp. Has Continuously Strived
            To Establish New Benchmarks In The Real Estate Sector, Delivering
            Renowned Projects Like Orange County And Cleo County. Renowned For
            Its Unwavering Commitment To Quality And Exceptional Thematic
            Design, ABA Corp Has Earned A Well-Deserved Reputation In The
            Industry.
          </p>
          <p>
            Investing in a Noida Property Offers Compelling Long-Term Benefits.
            While Numerous Builders In Noida Extension, Greater Noida, And The
            Delhi NCR Region Claim To Assist You In Finding Your Dream Home, ABA
            Corp Refrains From Making Verbal Promises. With a proven track
            record, ABA Corp stands out as one of the most successful real
            estate developers in Noida. ABA Corp Introduces You To Some Of The
            Finest Real Estate Projects In Noidaâ€”Opulent, Well-Equipped, And
            Yet Surprisingly Affordable. When You Place Your Trust In ABA Corp
            As A Reliable Real Estate Company In Noida, ABA Corp Guarantees That
            You Will Never Have Regrets.
          </p>{" "}
        </div>
        <div className="readmore mt-0 container">
          <button
            data-target="overview"
            id="mrbtns"
            className="button moreBtn float-left"
          >
            Read More
          </button>
        </div>
      </div>
      <div className="w-100 padding position-relative overflow-hidden   -">
        <div className="container">
          <div className="project-slider">
            <div className="row gap-row" id="getproject">
              <div className="col-xl-3 col-lg-4 col-sm-6 project_box  ">
                <div className="project_box_inner sector 115noida  -- test -- ">
                  <a href="../ivory-county.html">
                    <div className="Project_box_img  ">
                      <div className="badge badge-sm badge-success badge_approved">
                        RERA Reg No.: UPRERAPRJ256314
                      </div>
                      <div className="img-fluid">
                        <Image fill
                          src="/canarybannermob1.webp"
                          alt="Ivory County"
                        />
                      </div>
                      {/* <!-- <div className="badge badge-sm badge-danger badge_newlaunch">
                                                                                            </div> --> */}
                    </div>
                  </a>
                  <div className="project_box_details">
                    <div className="project_developer_detail">
                      <h4 className="mb-0 project_name">
                        <a href="../ivory-county.html">Ivory County</a>
                      </h4>
                      <small>by ABA Corp </small>
                    </div>
                    <div className="project_detail">
                      <p className="mb-0 project_config">
                        <i className="fa fa-building"></i>
                        <b>Luxury Apartments </b>
                      </p>
                      <p className="mb-0 project_address">
                        <i className="fa fa-map-marker-alt"></i>
                        <span>Sector 115, Noida </span>
                      </p>
                      <h4 className="project_price">
                        <i className="fa fa-indian-rupee-sign"></i>
                        <span className="minPrice">2 Cr </span> onwards*
                      </h4>
                    </div>
                  </div>

                  <div className="project_box_footer d-flex">
                    <div className="readmore light mt-0">
                      <a href="../ivory-county.html" className="button">
                        Details <i className="arrow right"></i>
                      </a>
                    </div>
                    <button
                      className="wishlist_btn"
                      data-target="#formModal"
                      data-projectcategory="1"
                      data-ivrno="+91 9800000000"
                      data-project="Ivory County"
                      data-addrr="Sector 115, Noida"
                      data-cat_id="1"
                      data-toggle="modal"
                      data-page="Ivory County"
                    >
                      <i className="fa fa-envelope"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-100 padding position-relative overflow-hidden bg-lightgray d-none">
        <div className="container"></div>
      </div>
      <div className="w-100 padding position-relative overflow-hidden">
        <div className="container">
          <div className="project-slider">
            <div className="row gap-row"></div>
          </div>
        </div>
      </div>
    </>
  );
}
