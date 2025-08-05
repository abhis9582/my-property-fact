import Footer from "./footer";

export default function FooterPage({ cityList = [], projectTypes = [] }) {
  return <Footer cityList={cityList} projectTypes={projectTypes}/>;
}
