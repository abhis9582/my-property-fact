import CommonBreadCrum from "@/app/(home)/components/common/breadcrum";
import CommonHeaderBanner from "@/app/(home)/components/common/commonheaderbanner";
import FooterPage from "@/app/(home)/components/footer/page";
import ProjectListByFloorTypeClient from "./projectListByFloorTypeClient";
import HeaderComponent from "@/app/(home)/components/header/headerComponent";

export default function ProjectListByFloorType({ slug }) {
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <>
      <HeaderComponent />
      <div className="container-fluid">
        <CommonHeaderBanner
          image={"project-banner.jpg"}
          headerText={title ? `${title.replace('%20', ' ')}` : "All Projects"}
        />
        <CommonBreadCrum
          firstPage={"projects"}
          pageName={title ? `${title.replace('%20', ' ')}` : "All Projects"}
        />
      </div>
      <ProjectListByFloorTypeClient title={title}/>
      <FooterPage />
    </>
  );
}
