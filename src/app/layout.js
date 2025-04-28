import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Script from 'next/script';
import "./globals.css";
import { ToastContainer } from "react-toastify";
// app/layout.js
export const metadata = {
    title: "Not found",
    description: "page is not found",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
                <ToastContainer />
                {/* ✅ Google Tag Manager */}
                <Script
                    id="gtm-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XYZ');
            `,
                    }}
                />

                {/* ✅ Google Analytics */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=G-QCFJENDW3M`}
                    strategy="afterInteractive"
                />
                <Script
                    id="ga-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QCFJENDW3M');
            `,
                    }}
                />
            </body>
        </html>
    );
}