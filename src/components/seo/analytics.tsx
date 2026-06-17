"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

interface GTagWindow extends Window {
  gtag?: (command: string, id: string, config?: Record<string, unknown>) => void;
}

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;

    const gWindow = window as unknown as GTagWindow;
    if (!gWindow.gtag) return;

    const query = searchParams?.toString();
    const url = pathname + (query ? `?${query}` : "");

    gWindow.gtag("config", gaId, {
      page_path: url,
    });
  }, [pathname, searchParams, gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

export function Analytics() {
  // We wrap in Suspense to prevent deoptimizing the entire page layout to dynamic rendering
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
