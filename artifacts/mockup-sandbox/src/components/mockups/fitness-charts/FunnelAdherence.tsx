
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Trophy, Target, ArrowDownRight } from "lucide-react";
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
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content flex flex-col h-full">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-1)]">
                <Target size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">PROGRAM · RETENTION</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Plan Adherence</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">16-week marathon plan completion rate</p>
            </div>
            
            <div className="bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-lg flex flex-col items-end">
              <div className="text-[10px] text-[var(--fc-text-secondary)] uppercase tracking-wider font-medium mb-0.5">Total Retention</div>
              <div className="text-lg font-light text-white tabular-nums leading-none">54.1%</div>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0 relative">
            {/* Background connecting lines for funnel effect */}
            <div className="absolute top-[32px] bottom-[32px] left-[130px] right-[70px] pointer-events-none z-0">
              <svg width="100%" height="100%" preserveAspectRatio="none">
                <polygon points="0,0 100%,40% 100%,60% 0%,100%" fill="rgba(255,255,255,0.02)" />
              </svg>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                layout="vertical" 
                margin={{ top: 10, right: 70, left: 30, bottom: 10 }}
                barSize={36}
              >
                <defs>
                  <linearGradient id="gradFunnel" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--fc-chart-1)" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="var(--fc-chart-3)" stopOpacity={1}/>
                  </linearGradient>
                  <linearGradient id="gradFunnelFaded" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--fc-chart-1)" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="var(--fc-chart-1)" stopOpacity={0.5}/>
                  </linearGradient>
                </defs>
                <XAxis type="number" hide domain={[0, 1300]} />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: "var(--fc-text-secondary)", fontSize: 12, fontWeight: 500 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(255,255,255,0.03)", radius: 4 }}
                  contentStyle={{ backgroundColor: "var(--fc-surface)", borderColor: "var(--fc-border)", borderRadius: "8px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)" }}
                  itemStyle={{ fontSize: 13, fontWeight: 500 }}
                  labelStyle={{ color: "var(--fc-text-secondary)", fontSize: 11, marginBottom: 4 }}
                  formatter={(value: number, name: string) => [
                    name === "count" ? value : `${value.toFixed(1)}%`,
                    name === "count" ? "Athletes" : "Completion"
                  ]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => {
                    const isLast = index === data.length - 1;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={isLast ? "url(#gradFunnel)" : "url(#gradFunnelFaded)"} 
                      />
                    );
                  })}
                  <LabelList 
                    dataKey="count" 
                    position="right" 
                    formatter={(val: number) => val}
                    fill="white"
                    fontSize={13}
                    fontWeight={500}
                  />
                  <LabelList 
                    dataKey="percentage" 
                    position="right" 
                    offset={45}
                    formatter={(val: number) => `(${val.toFixed(1)}%)`}
                    fill="var(--fc-text-secondary)"
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Absolute positioned drop-off chips */}
            <div className="absolute right-0 top-[15%] text-[10px] font-medium flex items-center text-[var(--fc-chart-5)] bg-[var(--fc-chart-5)]/10 px-1.5 py-0.5 rounded border border-[var(--fc-chart-5)]/20">
              <ArrowDownRight size={10} /> 12.5%
            </div>
            <div className="absolute right-0 top-[35%] text-[10px] font-medium flex items-center text-[var(--fc-chart-5)] bg-[var(--fc-chart-5)]/10 px-1.5 py-0.5 rounded border border-[var(--fc-chart-5)]/20">
              <ArrowDownRight size={10} /> 17.5%
            </div>
            
            {/* Final stage trophy icon */}
            <div className="absolute left-[110px] bottom-[18px] text-[var(--fc-chart-4)] bg-[var(--fc-chart-3)]/20 p-1 rounded-full border border-[var(--fc-chart-3)]/30">
              <Trophy size={12} />
            </div>
          </div>
          
          <div className="mt-4 border-t border-[var(--fc-border)] pt-4 flex gap-4 text-[11px] font-medium justify-between">
            <div className="flex items-center text-[var(--fc-text-secondary)]">
              <div className="w-2 h-2 rounded-full bg-[var(--fc-chart-5)] mr-2"></div>
              BIGGEST LEAK: Week 1 to 4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
