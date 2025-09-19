import "../globals.css";
import Footer from "./components/footer/page";
import Header from "./components/header/header";
export const metadata = {
  title: "My Property Fact | Smarter Real Estate Decisions Start Here",
  description:
    "Discover top property insights, LOCATE scores, expert tips, and trends to make smarter real estate decisions across India. Trusted by investors.",
  keywords: [
    "real estate India",
    "property insights",
    "real estate trends",
    "investment property",
    "LOCATE score",
    "smart real estate decisions",
    "property investment tips",
    "real estate guide India",
  ],
  alternates: {
    canonical: "https://www.mypropertyfact.in", // Replace with your actual domain
  },
};

export default function RootLayout({ children, params }) {
  return (
    <>
      {/* header for the user side  */}
      <Header />
      {/* dynamic render all its child components  */}
      {children}
      {/* footer for user side  */}
      <Footer />
    </>
  );
}
