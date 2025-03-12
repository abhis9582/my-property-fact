import "bootstrap/dist/css/bootstrap.min.css";

export const metadata = {
  title: "MPF | Admin",
  description: "my-property-fact",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
