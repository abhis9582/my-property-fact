import { LoadingSpinner } from "@/app/(home)/contact-us/page";

export default function DashboardLoading() {
    return (
        <div className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "250px" }}>
            <LoadingSpinner show={true} />
        </div>
    )
}