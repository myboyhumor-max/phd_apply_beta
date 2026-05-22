import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import "./_group.css";

const data = [
  { week: "W1", distance: 32 },
  { week: "W2", distance: 35 },
  { week: "W3", distance: 28 },
  { week: "W4", distance: 41 },
  { week: "W5", distance: 38 },
  { week: "W6", distance: 45 },
  { week: "W7", distance: 42 },
  { week: "W8", distance: 50 },
  { week: "W9", distance: 48 },
  { week: "W10", distance: 35 },
  { week: "W11", distance: 52 },
  { week: "W12", distance: 55 },
  { week: "W13", distance: 60 },
];

export default function LineDistance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-medium tracking-tight mb-1">Running Distance</h2>
            <p className="text-sm text-[var(--fc-text-secondary)]">Past 13 weeks</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-light tracking-tight">561 <span className="text-base text-[var(--fc-text-secondary)]">km</span></div>
            <p className="text-sm text-[var(--fc-text-secondary)]">43.1 km / week avg</p>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--fc-text-secondary)", fontSize: 11 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--fc-text-secondary)", fontSize: 11 }} 
                domain={[0, 70]} 
                ticks={[0, 20, 40, 60]}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--fc-surface)", borderColor: "var(--fc-border)", borderRadius: "8px" }}
                itemStyle={{ color: "var(--fc-text-primary)" }}
                cursor={{ stroke: "var(--fc-border)", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <ReferenceLine y={40} stroke="var(--fc-text-secondary)" strokeDasharray="3 3" opacity={0.5} />
              <Line 
                type="monotone" 
                dataKey="distance" 
                stroke="var(--fc-chart-3)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "var(--fc-surface)", stroke: "var(--fc-chart-3)", strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: "var(--fc-chart-3)" }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
