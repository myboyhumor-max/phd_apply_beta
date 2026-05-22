
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Activity, Target } from "lucide-react";
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
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-3)]">
                <Activity size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">Cardio · Weekly Distance</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Running Distance</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">Past 13 weeks</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-light tracking-tight tabular-nums">561<span className="text-xl text-[var(--fc-text-secondary)] ml-1">km</span></div>
              <p className="text-[13px] text-[var(--fc-text-secondary)] mt-1">43.1 km / week avg</p>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--fc-chart-3)" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="var(--fc-chart-3)" stopOpacity={0}/>
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
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
                  domain={[0, 70]} 
                  ticks={[0, 20, 40, 60]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--fc-surface)", borderColor: "var(--fc-border)", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
                  itemStyle={{ color: "var(--fc-text-primary)" }}
                  cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }}
                />
                <ReferenceLine y={40} stroke="var(--fc-chart-5)" strokeDasharray="4 4" opacity={0.3} />
                <Area 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="var(--fc-chart-3)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorDistance)" 
                  activeDot={{ r: 6, fill: "var(--fc-chart-3)", stroke: "var(--fc-bg)", strokeWidth: 2 }} 
                  style={{ filter: "url(#glow)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Glowing dot for final point */}
            <div className="absolute right-[12px] top-[18%] flex flex-col items-center pointer-events-none">
              <div className="bg-[var(--fc-surface)] border border-[var(--fc-border)] text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg mb-1 whitespace-nowrap">
                W13 · 61.4 km
              </div>
              <div className="w-3 h-3 rounded-full bg-[var(--fc-chart-3)] shadow-[0_0_12px_var(--fc-chart-3)] border-2 border-[var(--fc-surface)] relative"></div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-[var(--fc-border)] pt-4 flex gap-4 text-[11px] font-medium">
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-full text-[var(--fc-text-primary)]">
              <span className="text-[var(--fc-text-secondary)] mr-1">PEAK</span> 61.4 km · W13
            </div>
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-full text-[var(--fc-text-primary)] flex items-center">
              <span className="text-[var(--fc-text-secondary)] mr-1">vs LAST QTR</span> <span className="text-[var(--fc-chart-3)]">+12%</span>
            </div>
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-full text-[var(--fc-text-primary)] flex items-center">
              <Target size={12} className="text-[var(--fc-chart-5)] mr-1 opacity-70" />
              <span className="text-[var(--fc-text-secondary)] mr-1">TARGET</span> 40 km/wk
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
