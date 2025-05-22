import "../globals.css";
import axios from "axios";
import Header from "./components/header/header";
import Footer from "./components/footer/page";

export const metadata = {
  title: "My Property Fact",
  description: "my-property-fact",
};

//Fetching all list from api
const fetchCityData = async () => {
  const cityResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}city/all`
  );
  return cityResponse.data;
};

// Fetching project type
const fetchProjectTypes = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}project-types/get-all`
  );
  return response.data;
};
//Fetching all builders list
const fetchBuilderList = async () => {
  const builderResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}builders/get-all`
  );  
  return builderResponse.data.builders;
};

export default async function RootLayout({ children, params }) {
  const cityList = await fetchCityData();
  const projectTypes = await fetchProjectTypes();
  const builderList = await fetchBuilderList();
  return (
    <>
      {/* header for the user side  */}
      <Header cityList={cityList} projectTypes={projectTypes} builderList={builderList}/>

      {/* dynamic render all its child components  */}
      {children}

      {/* footer for user side  */}
      <Footer cityList={cityList} projectTypes={projectTypes} />
    </>
  );
}
