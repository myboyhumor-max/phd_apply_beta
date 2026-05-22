import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "./_group.css";

const data = [
  { week: "Mar 3-9", Run: 4, Bike: 2, Swim: 1, Strength: 2 },
  { week: "Mar 10-16", Run: 5, Bike: 1, Swim: 2, Strength: 2 },
  { week: "Mar 17-23", Run: 4, Bike: 3, Swim: 1, Strength: 1 },
  { week: "Mar 24-30", Run: 6, Bike: 2, Swim: 0, Strength: 3 },
];

export default function BarWorkouts() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-medium tracking-tight mb-1">Workouts by Type</h2>
          <p className="text-sm text-[var(--fc-text-secondary)]">Sessions count over last 4 weeks</p>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--fc-text-secondary)", fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "var(--fc-text-secondary)", fontSize: 12 }} 
                ticks={[0, 2, 4, 6, 8]}
              />
              <Tooltip 
                cursor={{ fill: "var(--fc-border)", opacity: 0.4 }}
                contentStyle={{ backgroundColor: "var(--fc-surface)", borderColor: "var(--fc-border)", borderRadius: "8px" }}
              />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ fontSize: "12px", color: "var(--fc-text-secondary)", paddingTop: "20px" }} 
              />
              <Bar dataKey="Run" fill="var(--fc-chart-3)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Bike" fill="var(--fc-chart-1)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Swim" fill="var(--fc-chart-2)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Strength" fill="var(--fc-text-secondary)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
