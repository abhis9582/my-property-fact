import Link from "next/link";
import Footer from "../components/footer/page";
import Header from "../components/header/page";
import PropertyPage from "./[projecttype]/propertypage";

export default function Projects() {
  return (
    <>
      <Header />
      <div className="containr-fluid mt-5">
        <div className="container-fluid p-0 mt-5">
          <img
            src="https://www.starestate.com/assets/images/banner-all-projects.jpg"
            alt="city banner"
          />
        </div>
        <div className="w-100 mt-3">
          <div className="container-lg">
            <div className="breadcrumbContainer" aria-label="breadcrumb">
              <ol className="breadcrumb p-3">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active">Projects</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="container-fluid mt-3">
          <p className="text-center h1">Projects</p>
          {/* <PropertyContainer /> */}
        </div>
      </div>
      <Footer />
    </>
  );
}
