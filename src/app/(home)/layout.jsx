import "bootstrap/dist/css/bootstrap.min.css";
import NewFooterDesign from "./components/footer/NewFooterDesign";
import LazyBelowFold from "./components/_homecomponents/LazyBelowFold";
import {
  fetchBuilderData,
  fetchCityData,
  fetchProjectTypes,
} from "@/app/_global_components/masterFunction";
import HeaderComponent from "./components/header/headerComponent";

export const metadata = {
  title: "My Property Fact | Smarter Real Estate Decisions Start Here",
  description:
    "Discover top property insights, LOCATE scores, expert tips, and trends to make smarter real estate decisions across India. Trusted by investors.",
  keywords: [
    "real estate India",
    "property insights",
    "real estate trends",
    "investment property",
    "LOCATE score",
    "smart real estate decisions",
    "property investment tips",
    "real estate guide India",
  ],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_UI_URL + "/",
  },
};

export default async function RootLayout({ children }) {
  const cityList = await fetchCityData();
  const builderList = await fetchBuilderData();
  const projectTypes = await fetchProjectTypes();
  return (
    <>
      {/* header for the user side  */}
      <HeaderComponent
        cityList={cityList}
        projectTypes={projectTypes}
        builderList={builderList.builders}
        projectList={[]}
      />
      {/* dynamic render all its child components  */}
      {children}
      {/* footer for user side  */}
      <NewFooterDesign cityList={cityList} />
      {/* Scroll to top + Chatbot (lazy loaded, client-only) */}
      <LazyBelowFold />
    </>
  );
}
