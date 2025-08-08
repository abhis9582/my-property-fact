// components/GoogleAnalytics.js
'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
    const GA_MEASUREMENT_ID = 'G-QCFJENDW3M';

    return (
        <>
            {/* Load gtag.js script */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="lazyOnload"
            />
            {/* Initialize GA */}
            <Script id="google-analytics" strategy="lazyOnload">
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