import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import "./_group.css";

const data = [
  { stage: "Signed Up", count: 1200, percentage: 100 },
  { stage: "Week 1", count: 1050, percentage: 87.5 },
  { stage: "Week 4", count: 840, percentage: 70 },
  { stage: "Peak Mileage", count: 720, percentage: 60 },
  { stage: "Tapered", count: 680, percentage: 56.6 },
  { stage: "Finished Race", count: 650, percentage: 54.1 },
];

export default function FunnelAdherence() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-medium tracking-tight mb-1">Plan Adherence</h2>
          <p className="text-sm text-[var(--fc-text-secondary)]">16-week marathon plan completion rate</p>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ top: 0, right: 50, left: 30, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="stage" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: "var(--fc-text-secondary)", fontSize: 13 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: "var(--fc-border)", opacity: 0.2 }}
                contentStyle={{ backgroundColor: "var(--fc-surface)", borderColor: "var(--fc-border)", borderRadius: "8px" }}
                formatter={(value: number, name: string) => [
                  name === "count" ? value : `${value.toFixed(1)}%`,
                  name === "count" ? "Athletes" : "Completion"
                ]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`var(--fc-chart-${index === 0 ? '2' : index === 5 ? '3' : '1'})`} 
                    opacity={1 - (index * 0.1)}
                  />
                ))}
                <LabelList 
                  dataKey="percentage" 
                  position="right" 
                  formatter={(val: number) => `${val.toFixed(1)}%`}
                  fill="var(--fc-text-primary)"
                  fontSize={13}
                  fontWeight={500}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
