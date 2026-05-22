
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, YAxis } from "recharts";
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
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content flex flex-col h-full">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-3)]">
                <TrendingUp size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">TREND · MONTHLY</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Distance Progression</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">Current month progression</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[80px] font-light tracking-tighter tabular-nums leading-none">187.4</span>
              <span className="text-2xl text-[var(--fc-text-secondary)]">km</span>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[13px] font-medium text-[var(--fc-chart-3)] bg-[var(--fc-chart-3)]/10 px-2.5 py-1 rounded-full">
                <ArrowUpRight size={14} strokeWidth={2.5} />
                <span>11.5%</span>
              </div>
              <div className="text-[13px] text-[var(--fc-text-secondary)]">
                vs 168.0 km last month
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-end justify-between mb-3">
              <div className="text-[10px] text-[var(--fc-text-secondary)] uppercase tracking-[0.1em] font-medium">6 Month Context</div>
              <div className="text-[11px] text-[var(--fc-text-secondary)]">
                <span className="text-[var(--fc-text-primary)]">BEST</span> Jan · 175km
              </div>
            </div>
            <div className="h-28 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "var(--fc-text-secondary)", fontSize: 11 }} 
                    dy={10}
                  />
                  <YAxis hide domain={[0, 200]} />
                  <Bar dataKey="distance" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => {
                      const isLast = index === data.length - 1;
                      const isBest = index === 3; // Jan
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={isLast ? "var(--fc-chart-3)" : isBest ? "var(--fc-chart-1)" : "var(--fc-border)"} 
                          opacity={isLast || isBest ? 1 : 0.6}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-5 pt-4 border-t border-[var(--fc-border)]">
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-[11px] font-medium text-[var(--fc-text-secondary)] uppercase tracking-wider">Yearly Projection</div>
                <div className="text-[11px] font-medium text-white">ON TRACK FOR 2,400 km / YR</div>
              </div>
              <div className="w-full h-1.5 bg-[var(--fc-border)] rounded-full overflow-hidden flex">
                <div className="h-full bg-[var(--fc-chart-3)]" style={{ width: '25%' }}></div>
                <div className="h-full bg-[var(--fc-chart-3)] opacity-30" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
