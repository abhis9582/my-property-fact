export default function PortalDashboardPage() {
  return (
    <>
      <div className="container-fluid">
        <div className="container mt-5">
          <div className="row">
            <div className="col-3">
              <div className="card p-3">
                <h1>Overview</h1>
                <p>500</p>
              </div>
            </div>
            <div className="col-3">
              <div className="card p-3">
                <h1>Account Health</h1>
                <p>89%</p>
              </div>
            </div>
            <div className="col-3">
              <div className="card p-3">
                <h1>Listings</h1>
                <p>21</p>
              </div>
            </div>
            <div className="col-3">
              <div className="card p-3">
                <h1>TTFC</h1>
                <p>N/A</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
