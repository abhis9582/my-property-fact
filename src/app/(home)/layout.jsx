import "../globals.css";
import HeaderClientWrapper from "./components/header/HeaderClientWrapper";
import FooterClientWrapper from "./components/footer/FooterClientWrapper";

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
      {/* header - client component, loads data after initial render (non-blocking) */}
      <HeaderClientWrapper />
      {/* dynamic render all its child components  */}
      {children}
      {/* footer - client component, loads data after initial render (non-blocking) */}
      <FooterClientWrapper />
    </>
  );
}
