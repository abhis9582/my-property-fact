import "./builderpage.css";
import Link from "next/link";
import PropertyContainer from "@/app/(home)/components/common/page";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { LoadingSpinner } from "../../contact-us/page";
export default function BuilderPage({ builderDetail, projectsList}) {
  return (
    <>
      <CommonHeaderBanner
        image={"builder-banner.jpg"}
        headerText={builderDetail.builderName}
      />
      <CommonBreadCrum
        firstPage={"projects"}
        pageName={builderDetail.builderName}
      />
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="w-80">
            <p className="text-center">{builderDetail.builderDescription}</p>
          </div>
        </div>
        {/* <div className="text-center">
          <Link href="#" className="btn btn-background text-white">
            Read More
          </Link>
        </div> */}
      </div>
      {false ?
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: "250px"}}>
          <LoadingSpinner show={loading} />
        </div>
        :
        <div className="container my-3">
          <div className="row g-3">
            {builderDetail.projectList.length > 0 ? builderDetail.projectList.map((item, index) => (
              <div key={index} className="col-12 col-sm-6 col-md-4">
                <PropertyContainer data={item} />
              </div>
            )) : (<p className="text-center fs-4 fw-bold">No projects found</p>)}
          </div>
        </div>
      }
    </>
  );
}
