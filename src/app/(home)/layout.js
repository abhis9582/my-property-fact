import "../globals.css";
import axios from "axios";
import Header from "./components/header/header";
import Footer from "./components/footer/page";
export const dynamic = "force-dynamic";

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
    canonical: "https://www.mypropertyfact.com", // Replace with your actual domain
  },
};

//Fetching all list from api
const fetchCityData = async () => {
  try {
    const cityResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}city/all`
    );
    return cityResponse.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// Fetching project type
const fetchProjectTypes = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
//Fetching all builders list
const fetchBuilderList = async () => {
  try {
    const builderResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}builder/get-all`
    );
    return builderResponse.data.builders;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default async function RootLayout({ children, params }) {
  let cityList = [];
  let projectTypes = [];
  let builderList = [];
  try {
    const [cities, projects, builders] = await Promise.all([
      fetchCityData(),
      fetchProjectTypes(),
      fetchBuilderList(),
    ]);

    cityList = cities;
    projectTypes = projects;
    builderList = builders;
    return (
      <>
        {/* header for the user side  */}
        <Header
          cityList={cityList}
          projectTypes={projectTypes}
          builderList={builderList}
        />

        {/* dynamic render all its child components  */}
        {children}
        {/* footer for user side  */}
        <Footer cityList={cityList} projectTypes={projectTypes} />
      </>
    );
  } catch (err) {
    console.error("Error loading layout data:", err);
    return (
      <div>
        <h1>Failed to load data from server.</h1>
        <p>The server might be down or unreachable.</p>
      </div>
    );
  }
}
