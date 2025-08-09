"use client";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function WebVitalsChart({ vitals }: { vitals: any[] }) {
  const metrics = ["LCP", "CLS", "INP", "FID", "TTFB"];
  // Prepare data: each metric is a line, x-axis is sample index
  // Find the max length of any metric's data
  const maxLen = Math.max(
    ...metrics.map((name) => vitals.filter((v) => v.name === name).length)
  );
  // Build an array of objects: [{ sample: 1, LCP: ..., CLS: ..., ... }, ...]
  const chartData = Array.from({ length: maxLen }, (_, i) => {
    const entry: any = { sample: i + 1 };
    metrics.forEach((name) => {
      const data = vitals.filter((v) => v.name === name);
      entry[name] = data[i]?.value ?? null;
    });
    return entry;
  });
  const colors = ["#2563eb", "#f59e42", "#10b981", "#e11d48", "#6366f1"];
  return (
    <Card className="p-4">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
          <XAxis dataKey="sample" tick={{ fontSize: 12 }} label={{ value: "Sample", position: "insideBottomRight", offset: -5 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: "Value", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {metrics.map((name, i) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={colors[i]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
