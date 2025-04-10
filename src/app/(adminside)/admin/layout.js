import { ToastContainer } from "react-toastify";
export const metadata = {
  title: "MPF | Admin",
  description: "my-property-fact",
};

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
      <ToastContainer/>
    </>
  );
}
