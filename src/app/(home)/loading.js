import { LoadingSpinner } from "./contact-us/page";

export default function LoadingHome() {
    return (
        <div className="d-flex justify-content-center align-items-center"
        style={{minHeight: "250px"}}>
            <LoadingSpinner show={true} />
        </div>
    )
}