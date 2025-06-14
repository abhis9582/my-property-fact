import PropertyContainer from "@/app/(home)/components/common/page";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { LoadingSpinner } from "../../contact-us/page";

export default function PropertyPage({ projectTypeDetails }) {
  return (
    <>
      <CommonHeaderBanner
        image={"project-banner.jpg"}
        headerText={projectTypeDetails.projectTypeName}
      />
      <CommonBreadCrum
        firstPage={"projects"}
        pageName={projectTypeDetails.projectTypeName}
      />
      {false ?
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: "250px"}}>
          <LoadingSpinner show={false} />
        </div>
        :
        <div className="container my-3">
          <div className="row g-3">
            {projectTypeDetails.projects.length > 0 ? projectTypeDetails.projects.map((item, index) => (
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
