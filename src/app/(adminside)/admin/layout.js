import SessionMonitor from "./_components/SessionMonitor";
import "bootstrap/dist/css/bootstrap.min.css";
export const metadata = {
  title: "MPF | Admin",
  description: "my-property-fact",
};

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
      <SessionMonitor />
    </>
  );
}