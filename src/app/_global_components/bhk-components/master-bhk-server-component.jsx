import CommonHeaderBanner from "@/app/(home)/components/common/commonheaderbanner";
import CommonBreadCrum from "@/app/(home)/components/common/breadcrum";
import MasterBHKProjectList from "./master-bhk-project-list";
import FooterPage from "@/app/(home)/components/footer/page";
import HeaderComponent from "@/app/(home)/components/header/headerComponent";

export default function MasterBHKProjectsPage({ slug }) {
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <HeaderComponent />
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
      <MasterBHKProjectList/>
      <FooterPage />
    </>
  );
}
