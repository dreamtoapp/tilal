"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Chart = dynamic(() => import("@/components/seo/WebVitalsChart"), { ssr: false });

function getAverage(values: number[]) {
  if (!values.length) return null;
  return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
}

function getPageLabel(page: string) {
  if (page === "/") return "Home";
  if (page === "/dashboard/seo/performance") return "Performance";
  if (page === "/dashboard/seo/promotion") return "Offers";
  if (page === "/dashboard/seo/offers") return "Offers";
  if (page === "/dashboard/seo/home") return "Home";

  // Handle dynamic routes: /product/[slug], /promotions/[slug], etc.
  const parts = page.split("/").filter(Boolean);
  if (parts.length > 1) {
    const parent = parts[0].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    const slug = decodeURIComponent(parts.slice(1).join("/").replace(/-/g, " "));
    return `${parent}: ${slug}`;
  }
  // Fallback: prettify the path
  return decodeURIComponent(page.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
}

export default function PerformanceClient({ vitals }: { vitals: any[] }) {
  const ALL_PAGES = "__ALL__";
  const [selectedPage, setSelectedPage] = useState<string>(ALL_PAGES);
  const pages = Array.from(new Set(vitals.map((v) => v.page))).filter(Boolean);
  const filteredVitals = selectedPage === ALL_PAGES ? vitals : vitals.filter((v) => v.page === selectedPage);

  const metrics = ["LCP", "CLS", "INP", "FCP", "TTFB"];
  const stats = metrics.map((name) => {
    const values = filteredVitals.filter((v) => v.name === name).map((v) => v.value);
    return { name, avg: getAverage(values), count: values.length };
  });

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Site Performance (Core Web Vitals)</h1>
      <div className="mb-6 flex flex-col items-center gap-2">
        <div className="mb-1 text-sm font-medium text-muted-foreground">Filter by Page:</div>
        <div className="flex flex-wrap gap-2 justify-center items-center w-full max-w-xs">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Pages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PAGES}>All Pages</SelectItem>
              {pages.map((page) => (
                <SelectItem key={page} value={page}>{getPageLabel(page)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="ml-2 cursor-pointer text-muted-foreground">
                <Info size={16} />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <span>Select a page to filter metrics. &quot;All Pages&quot; shows aggregate data.</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {stat.name}
                {stat.name === "LCP" && <Badge variant={stat.avg && +stat.avg > 2.5 ? "destructive" : "default"}>Important</Badge>}
                {stat.name === "CLS" && <Badge variant={stat.avg && +stat.avg > 0.1 ? "destructive" : "default"}>Stability</Badge>}
                {stat.name === "INP" && <Badge variant={stat.avg && +stat.avg > 200 ? "destructive" : "default"}>Interaction</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold mb-2">{stat.avg ?? "-"}</div>
              <div className="text-muted-foreground text-sm">Samples: {stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-card rounded-lg p-4 shadow">
        <h2 className="text-lg font-bold mb-2">Timeline Chart</h2>
        <Chart vitals={filteredVitals} />
      </div>
    </div>
  );
}
