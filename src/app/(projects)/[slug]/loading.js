import { LoadingSpinner } from "../../(home)/contact-us/page";

export default function LoadingProperty() {
  return (
    <div className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "550px" }}>
      <LoadingSpinner show={true} />
    </div>
  )
}
