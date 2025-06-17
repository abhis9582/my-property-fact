import { LoadingSpinner } from "@/app/(home)/contact-us/page";

export default function DashboardLoading() {
    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "550px" }}>
            <LoadingSpinner show={true} />
        </div>
    )
}