import "bootstrap/dist/css/bootstrap.min.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SiteDataProvider } from "@/app/_global_components/contexts/SiteDataContext";

const LazyBelowFold = dynamic(
  () => import("./components/_homecomponents/LazyBelowFold"),
  { loading: () => null }
);

const HeaderComponent = dynamic(
  () => import("./components/header/headerComponent").then((m) => m.default),
  {
    ssr: true,
    loading: () => (
      <header className="d-flex justify-content-between align-items-center px-2 px-lg-4 header" style={{ minHeight: 74 }}>
        <Link href="/" aria-label="My Property Fact Home">
          <img src="/logo.png" alt="" width={80} height={74} decoding="async" fetchPriority="high" />
        </Link>
      </header>
    ),
  }
);

const NewFooterDesign = dynamic(
  () => import("./components/footer/NewFooterDesign").then((m) => m.default),
  { ssr: true, loading: () => <footer style={{ minHeight: 200 }} aria-busy="true" /> }
);

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
    canonical: process.env.NEXT_PUBLIC_UI_URL + "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <SiteDataProvider>
      <HeaderComponent />
      {children}
      <NewFooterDesign />
      <LazyBelowFold />
    </SiteDataProvider>
  );
}
