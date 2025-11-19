import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import GoogleAnalytics from "./_global_components/googleAnalytics";
import { ProjectProvider } from "./_global_components/contexts/projectsContext";
import localFont from "next/font/local";
import "@fortawesome/fontawesome-svg-core/styles.css"; 
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

// app/layout.js
export const metadata = {
  title: "Not found",
  description: "page is not found",
};


const gothamBold = localFont({
  src: "../../public/fonts/plus_jakarta_sans/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--heaing-font",
  style: "normal",
});

const headingPro = localFont({
  src: "../../public/fonts/plus_jakarta_sans/PlusJakartaSans-VariableFont_wght.ttf",
  variable: "--headeing-bolded",
  style: "normal",
});

const gothamLight = localFont({
  src: "../../public/fonts/montserrat/Montserrat-VariableFont_wght.ttf",
  variable: "--text-font",
  style: "normal",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WL4BBZM8');
          `}
        </Script>
        {/* End Google Tag Manager */}
        {/* Suppress React DevTools warning */}
        <Script id="suppress-react-devtools" strategy="beforeInteractive">
          {`
            if (typeof window !== 'undefined') {
              window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
                isDisabled: true,
                supportsFiber: true,
                inject: () => {},
                onCommitFiberRoot: () => {},
                onCommitFiberUnmount: () => {},
              };
            }
          `}
        </Script>
        {/* Meta Pixel Script */}
        <Script id="facebook-pixel" strategy="lazyOnload">
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
          strategy="lazyOnload"
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
      <body 
        className={`${gothamBold.variable} ${headingPro.variable} ${gothamLight.variable}`}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WL4BBZM8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
