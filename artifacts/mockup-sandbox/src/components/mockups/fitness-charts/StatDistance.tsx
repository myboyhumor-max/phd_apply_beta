import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";
import "./_group.css";

const data = [
  { month: "Oct", distance: 145 },
  { month: "Nov", distance: 162 },
  { month: "Dec", distance: 158 },
  { month: "Jan", distance: 175 },
  { month: "Feb", distance: 168 },
  { month: "Mar", distance: 187.4 },
];

export default function StatDistance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-medium tracking-tight mb-1">Monthly Distance</h2>
          <p className="text-sm text-[var(--fc-text-secondary)]">Current month progression</p>
        </div>

        <div className="flex-1 flex flex-col justify-center mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-7xl font-light tracking-tighter">187.4</span>
            <span className="text-2xl text-[var(--fc-text-secondary)]">km</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-[var(--fc-chart-3)] bg-[var(--fc-chart-3)]/10 px-2 py-1 rounded">
              <ArrowUp size={16} className="mr-1" />
              <span className="font-medium">11.5%</span>
            </div>
            <div className="text-sm text-[var(--fc-text-secondary)]">
              vs 168.0 km last month
            </div>
          </div>
        </div>

        <div className="h-24 w-full">
          <div className="text-xs text-[var(--fc-text-secondary)] mb-2 uppercase tracking-wider">6 Month Context</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <Bar dataKey="distance" radius={[2, 2, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? "var(--fc-chart-3)" : "var(--fc-border)"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
