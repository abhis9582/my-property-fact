import "../globals.css";
import Header from "./components/header/page";
import Footer from "./components/footer/page";

export const metadata = {
  title: "My Property Fact",
  description: "my-property-fact",
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
