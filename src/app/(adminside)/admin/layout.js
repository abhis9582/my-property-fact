import { ToastContainer } from "react-toastify";
import SessionMonitor from "./_components/SessionMonitor";

export const metadata = {
  title: "MPF | Admin",
  description: "my-property-fact",
};

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
      <SessionMonitor />
      <ToastContainer />
    </>
  );
}
