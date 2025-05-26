export default function Dashboard({ noOfProjects }) {
    return (
        <div className="container-fluid">
            <h1 className="mt-3">Welcome to Dashboard</h1>
            <div className="container d-flex justify-content-center mt-5">
                <p className="mt-5">Total number of Projects: {noOfProjects}</p>
            </div>
        </div>
    );
}
