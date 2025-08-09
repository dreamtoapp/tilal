import fs from "fs/promises";
import PerformanceClient from "@/components/seo/PerformanceClient";
import AdvancedAnalyticsReport from "@/components/seo/AdvancedAnalyticsReport";

export default async function PerformancePage() {
  let vitals: any[] = [];
  try {
    const data = await fs.readFile("web-vitals.log", "utf-8");
    vitals = data.trim().split("\n").map((line) => JSON.parse(line));
  } catch {}

  return (
    <>
      <PerformanceClient vitals={vitals} />
      <div className="mt-10 flex justify-center">
        <a
          href="#advanced-analytics"
          className="underline text-primary font-medium"
        >
          Advanced Analytics Report
        </a>
      </div>
      <div id="advanced-analytics" className="mt-10">
        <AdvancedAnalyticsReport />
      </div>
    </>
  );
}
