import { Spinner } from "react-bootstrap";
import CommonBreadCrum from "../components/common/breadcrum";
import CommonHeaderBanner from "../components/common/commonheaderbanner";
import ContactUs from "./contactUs";

export default function ContactUsPage() {
  return (
    <>
      <CommonHeaderBanner
        image={"contact-banner.jpg"}
        headerText={"Contact Us"}
      />
      <CommonBreadCrum pageName={"Contact-us"} />
      <ContactUs />
    </>
  );
}

export function LoadingSpinner({ show, height }) {
  return show ? (
    <div style={{height: "200px"}}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ) : (
    ""
  );
}
