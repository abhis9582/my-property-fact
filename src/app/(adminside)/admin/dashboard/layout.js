import "bootstrap/dist/css/bootstrap.min.css";
import SideNav from "../_sidenav/page";
export default function AdminLayout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-2 p-0" style={{backgroundColor: "#68ac78"}}>
          <SideNav />
        </div>
        <div className="col-10">{children}</div>
      </div>
    </div>
  );
}
