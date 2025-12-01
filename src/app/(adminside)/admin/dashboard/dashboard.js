import Link from "next/link";

export default function Dashboard({ noOfProjects }) {
    return (
        <div className="container-fluid">
            <h1 className="mt-3">Welcome to Dashboard</h1>
            <div className="container d-flex justify-content-center mt-5">
                <p className="mt-5">Total number of Projects: {noOfProjects}</p>
            </div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <div className="border p-3 rounded-2">
                            <div className="">
                                <h5 className="card-title">Property Approvals</h5>
                                <p className="card-text">Review and approve pending property listings submitted by users.</p>
                                <Link href="/admin/dashboard/property-approvals" className="btn btn-primary">
                                    Go to Property Approvals
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
