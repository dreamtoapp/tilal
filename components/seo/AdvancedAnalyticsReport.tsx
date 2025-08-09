// AdvancedAnalyticsReport.tsx
"use client";
import { useEffect, useState } from "react";
import { getWebVitalsAnalytics } from "@/app/dashboard/management-seo/performance/analytics-report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const METRICS = ["LCP", "CLS", "INP", "FCP", "TTFB"];

export default function AdvancedAnalyticsReport() {
  const [filters, setFilters] = useState({
    page: "",
    device: "",
    browser: "",
    city: "",
    country: "",
    metric: "LCP",
    dateFrom: "",
    dateTo: "",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [browsers, setBrowsers] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // Fetch distinct values for selects
  useEffect(() => {
    async function fetchDistinct() {
      const res = await fetch("/dashboard/seo/performance/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "distinct" }),
      });
      const data = await res.json();
      setPages(data.pages || []);
      setDevices(data.devices || []);
      setBrowsers(data.browsers || []);
      setCountries(data.countries || []);
    }
    fetchDistinct();
  }, []);

  async function handleFetch() {
    setLoading(true);
    const { dateFrom, dateTo, ...rest } = filters;
    const res = await getWebVitalsAnalytics({
      ...rest,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
    setResult(res);
    setLoading(false);
  }

  function handleChange(field: string, value: string) {
    setFilters((f) => ({ ...f, [field]: value }));
  }

  function handleShowAllDates() {
    setFilters((f) => ({ ...f, dateFrom: "", dateTo: "" }));
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Advanced Analytics Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Select value={filters.device} onValueChange={v => handleChange("device", v)}>
          <SelectTrigger><SelectValue placeholder="Device (e.g. mobile, desktop)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            {devices.filter(Boolean).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.page} onValueChange={v => handleChange("page", v)}>
          <SelectTrigger><SelectValue placeholder="Page (e.g. /, /product/abc)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            {pages.filter(Boolean).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="City" value={filters.city} onChange={e => handleChange("city", e.target.value)} />
        <Select value={filters.browser} onValueChange={v => handleChange("browser", v)}>
          <SelectTrigger><SelectValue placeholder="Browser (e.g. Chrome)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Browsers</SelectItem>
            {browsers.filter(Boolean).map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.metric} onValueChange={v => handleChange("metric", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {METRICS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.country} onValueChange={v => handleChange("country", v)}>
          <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.filter(Boolean).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={filters.dateFrom} onChange={e => handleChange("dateFrom", e.target.value)} />
        <Input type="date" value={filters.dateTo} onChange={e => handleChange("dateTo", e.target.value)} />
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={handleFetch} disabled={loading}>{loading ? "Loading..." : "Run Report"}</Button>
        <Button variant="secondary" onClick={handleShowAllDates}>Show All Dates</Button>
      </div>
      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Results for {filters.metric}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div><b>Count:</b> {result.count}</div>
              <div><b>Average:</b> {result.avg?.toFixed(2) ?? "-"}</div>
              <div><b>P75:</b> {result.p75?.toFixed(2) ?? "-"}</div>
              <div><b>P95:</b> {result.p95?.toFixed(2) ?? "-"}</div>
              <div><b>Min:</b> {result.min?.toFixed(2) ?? "-"}</div>
              <div><b>Max:</b> {result.max?.toFixed(2) ?? "-"}</div>
            </div>
            {/* Charting and export can be added here */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
