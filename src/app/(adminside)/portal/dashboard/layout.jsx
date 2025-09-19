import PortalSideNav from "../_components/portalSidenav";

export const metadata = {
  title: "Portal Dashboard",
}

export default function PortalDashboardLayout({ children }) {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-3">
            <PortalSideNav />
          </div>
          <div className="col-9">{children}</div>
        </div>
      </div>
    </>
  );
}
