import CommonBreadCrum from "@/app/(home)/components/common/breadcrum";
import CommonHeaderBanner from "@/app/(home)/components/common/commonheaderbanner";
import FooterPage from "@/app/(home)/components/footer/page";
import Header from "@/app/(home)/components/header/header";
import ProjectListByFloorTypeClient from "./projectListByFloorTypeClient";

export default function ProjectListByFloorType({ slug }) {
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  console.log("title:", title);
  return (
    <>
      <Header />
      <div className="container-fluid">
        <CommonHeaderBanner
          image={"project-banner.jpg"}
          headerText={title ? `${title}` : "All Projects"}
        />
        <CommonBreadCrum
          firstPage={"projects"}
          pageName={title ? `${title}` : "All Projects"}
        />
      </div>
      <ProjectListByFloorTypeClient title={title}/>
      <FooterPage />
    </>
  );
}
