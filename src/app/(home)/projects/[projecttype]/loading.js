import { LoadingSpinner } from "../../contact-us/page";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
      <LoadingSpinner show={true} />
    </div>
  );
}
