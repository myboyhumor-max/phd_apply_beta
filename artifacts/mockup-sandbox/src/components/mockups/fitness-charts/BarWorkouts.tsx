
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calendar } from "lucide-react";
import "./_group.css";

const data = [
  { week: "Mar 3-9", Run: 4, Bike: 2, Swim: 1, Strength: 2 },
  { week: "Mar 10-16", Run: 5, Bike: 1, Swim: 2, Strength: 2 },
  { week: "Mar 17-23", Run: 4, Bike: 3, Swim: 1, Strength: 1 },
  { week: "Mar 24-30", Run: 6, Bike: 2, Swim: 0, Strength: 3 },
];

export default function BarWorkouts() {
  return (
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-1)]">
                <Calendar size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">ACTIVITY · VOLUME</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Workouts by Type</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">Sessions count over last 4 weeks</p>
            </div>
            
            <div className="flex flex-col items-end gap-1 text-[11px] font-medium">
              <div className="flex items-center gap-2">
                <span className="text-[var(--fc-text-secondary)]">Run</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--fc-chart-3)]"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--fc-text-secondary)]">Bike</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--fc-chart-1)]"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--fc-text-secondary)]">Swim</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--fc-chart-2)]"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--fc-text-secondary)]">Strength</span>
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--fc-chart-5)]"></div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2} barCategoryGap="20%">
                <defs>
                  <linearGradient id="gradRun" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--fc-chart-3)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="var(--fc-chart-3)" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="gradBike" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--fc-chart-1)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="var(--fc-chart-1)" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="gradSwim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--fc-chart-2)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="var(--fc-chart-2)" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="gradStrength" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--fc-chart-5)" stopOpacity={1}/>
                    <stop offset="100%" stopColor="var(--fc-chart-5)" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
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
                  ticks={[0, 2, 4, 6]}
                  domain={[0, 6]}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.03)", radius: 4 }}
                  contentStyle={{ backgroundColor: "var(--fc-surface)", borderColor: "var(--fc-border)", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
                  itemStyle={{ fontSize: 13, fontWeight: 500 }}
                  labelStyle={{ color: "var(--fc-text-secondary)", fontSize: 11, marginBottom: 4 }}
                />
                
                <Bar dataKey="Run" fill="url(#gradRun)" radius={[4, 4, 0, 0]} maxBarSize={16}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-run-${index}`} stroke={entry.Run === 6 ? "rgba(255,255,255,0.5)" : "transparent"} strokeWidth={1} />
                  ))}
                </Bar>
                <Bar dataKey="Bike" fill="url(#gradBike)" radius={[4, 4, 0, 0]} maxBarSize={16} />
                <Bar dataKey="Swim" fill="url(#gradSwim)" radius={[4, 4, 0, 0]} maxBarSize={16} />
                <Bar dataKey="Strength" fill="url(#gradStrength)" radius={[4, 4, 0, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 border-t border-[var(--fc-border)] pt-4 flex gap-4 text-[11px] font-medium justify-between">
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-full text-[var(--fc-text-primary)]">
              <span className="text-[var(--fc-text-secondary)] mr-1">TOTAL</span> 47 sessions
            </div>
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-full text-[var(--fc-text-primary)]">
              <span className="text-[var(--fc-text-secondary)] mr-1">BEST DAY</span> Tuesday
            </div>
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-full text-[var(--fc-text-primary)]">
              <span className="text-[var(--fc-text-secondary)] mr-1">AVG</span> 6.7 hr/wk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
