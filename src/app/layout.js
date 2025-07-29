import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import GoogleAnalytics from "./_global_components/googleAnalytics";
import { ProjectProvider } from "./_global_components/contexts/projectsContext";
// app/layout.js
export const metadata = {
  title: "Not found",
  description: "page is not found",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '994098169297958');
            fbq('track', 'PageView');
          `}
        </Script>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "My Property Fact",
              url: "https://www.mypropertyfact.in",
              logo: "https://www.mypropertyfact.in/logo.png", // optional
              description:
                "Discover top property insights, LOCATE scores, and real estate trends across India.",
              sameAs: [
                "https://www.facebook.com/mypropertyfact1",
                "https://www.instagram.com/my.property.fact",
              ],
            }),
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <main>
          <ProjectProvider>{children}</ProjectProvider>
        </main>
        <ToastContainer />
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=994098169297958&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}