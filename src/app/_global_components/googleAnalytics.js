// components/GoogleAnalytics.js
'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
    const GA_MEASUREMENT_ID = 'G-LEV23BGVSH';

    return (
        <>
            {/* Load gtag.js script */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />

            {/* Initialize GA */}
            <Script id="ga-init" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
            </Script>
        </>
    );
}