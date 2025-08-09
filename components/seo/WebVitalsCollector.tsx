"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// This component collects web-vitals metrics from the browser and sends them to the server.
// Place this ONLY in the performance dashboard page, not in layout or global scope.
export default function WebVitalsCollector() {
  const pathname = usePathname();
  useEffect(() => {
    // fetch("https://ipapi.co/json/")
    //   .then((res) => res.json())
    //   .catch(() => ({})) // If fetch fails, fallback to empty object
    //   .then((_location) => {
    // reportWebVitals(async (metric: Record<string, unknown>) => {
    //   const parser = new UAParser();
    //   const ua = parser.getResult();
    //   const enriched = {
    //     ...metric,
    //     page: pathname,
    //     userAgent: navigator.userAgent,
    //     device: ua.device?.type
    //       ? ua.device.type
    //       : (ua.os?.name === "iOS" || ua.os?.name === "Android" ? "mobile" : "desktop"),
    //     browser: ua.browser?.name || "",
    //     city: location?.city || "",
    //     country: location?.country_name || "",
    //     timestamp: Date.now(),
    //   };
    //   try {
    //     await fetch("/dashboard/seo/performance/collect", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(enriched),
    //     });
    //   } catch (e) {
    //     // Optionally log error or ignore
    //   }
    // });
    // });
  }, [pathname]);
  return null;
}
