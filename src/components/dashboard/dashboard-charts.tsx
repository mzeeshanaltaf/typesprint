"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

type Point = {
  day: string;
  label: string;
  avgWpm: number;
  bestWpm: number;
  accuracy: number;
};

type Metric = "wpm" | "accuracy";

export function DashboardCharts({ data }: { data: Point[] }) {
  const [metric, setMetric] = useState<Metric>("wpm");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 self-start rounded-lg border border-border/60 bg-background/40 p-1">
        <MetricButton
          active={metric === "wpm"}
          onClick={() => setMetric("wpm")}
        >
          WPM
        </MetricButton>
        <MetricButton
          active={metric === "accuracy"}
          onClick={() => setMetric("accuracy")}
        >
          Accuracy
        </MetricButton>
      </div>

      <div className="w-full">
        <ResponsiveContainer width="100%" height={256}>
          {metric === "wpm" ? (
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wpmBest" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="bestWpm"
                stroke="url(#wpmBest)"
                strokeWidth={2.5}
                dot={false}
                name="Best WPM"
              />
              <Line
                type="monotone"
                dataKey="avgWpm"
                stroke="var(--muted-foreground)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="Avg WPM"
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="accArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltip suffix="%" />} />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#accArea)"
                name="Accuracy"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function MetricButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

type TooltipPayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
  suffix = "",
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <div className="mb-1 font-medium">{label}</div>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}</span>
          <span className="ml-auto font-mono font-medium">
            {entry.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}
