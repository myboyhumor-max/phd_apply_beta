import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./_group.css";

const data = [
  { name: "Completed", value: 32 },
  { name: "Remaining", value: 8 },
];

const COLORS = ["var(--fc-chart-3)", "var(--fc-border)"];

export default function DonutGoal() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="text-center mb-4">
          <h2 className="text-xl font-medium tracking-tight mb-1">Weekly Mileage Goal</h2>
          <p className="text-sm text-[var(--fc-text-secondary)]">Current week progress</p>
        </div>

        <div className="flex-1 relative w-full min-h-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={110}
                outerRadius={140}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-5xl font-light tracking-tight mb-1">80<span className="text-2xl text-[var(--fc-text-secondary)]">%</span></div>
            <div className="text-sm text-[var(--fc-text-secondary)] uppercase tracking-wider">32 / 40 km</div>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--fc-border)] pt-6 flex justify-center gap-12">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-[var(--fc-chart-4)] mb-2"></div>
            <div className="text-sm font-medium">18.5 km</div>
            <div className="text-xs text-[var(--fc-text-secondary)]">Easy</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-[var(--fc-chart-2)] mb-2"></div>
            <div className="text-sm font-medium">8.0 km</div>
            <div className="text-xs text-[var(--fc-text-secondary)]">Tempo</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-[var(--fc-chart-1)] mb-2"></div>
            <div className="text-sm font-medium">5.5 km</div>
            <div className="text-xs text-[var(--fc-text-secondary)]">Long</div>
          </div>
        </div>
      </div>
    </div>
  );
}
