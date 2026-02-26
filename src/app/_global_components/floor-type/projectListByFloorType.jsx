import CommonBreadCrum from "@/app/(home)/components/common/breadcrum";
import CommonHeaderBanner from "@/app/(home)/components/common/commonheaderbanner";
import NewFooterDesign from "@/app/(home)/components/footer/NewFooterDesign";
import ProjectListByFloorTypeClient from "./projectListByFloorTypeClient";
import HeaderComponent from "@/app/(home)/components/header/headerComponent";

export default function ProjectListByFloorType({ slug, cityList = [] }) {
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <>
      <HeaderComponent />
      <CommonHeaderBanner
        image={"project-banner.jpg"}
        headerText={title ? `${title.replace("%20", " ")}` : "All Projects"}
      />
      <CommonBreadCrum
        firstPage={"projects"}
        pageName={title ? `${title.replace("%20", " ")}` : "All Projects"}
      />
      <ProjectListByFloorTypeClient title={title}/>
      <NewFooterDesign cityList={cityList} compactTop={true} />
    </>
  );
}
