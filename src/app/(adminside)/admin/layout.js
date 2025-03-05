import "bootstrap/dist/css/bootstrap.min.css";
export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
