
import { ArrowDownRight, ArrowUpRight, Heart, Activity, Moon, Zap } from "lucide-react";
import "./_group.css";

const Sparkline = ({ data, color, gradientId }: { data: number[], color: string, gradientId: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  });
  
  const polylinePoints = points.join(" ");
  const areaPoints = `${points[0].split(',')[0]},${height} ${polylinePoints} ${points[points.length-1].split(',')[0]},${height}`;

  const lastPoint = points[points.length - 1].split(',');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r={3} fill={color} stroke="var(--fc-surface)" strokeWidth={1} />
      <circle cx={lastPoint[0]} cy={lastPoint[1]} r={6} fill="none" stroke={color} opacity={0.4} />
    </svg>
  );
};

export default function SparklineHR() {
  return (
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content flex flex-col h-full">
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-2)]">
              <Activity size={14} />
              <span className="text-[10px] uppercase tracking-[0.18em] font-medium">RECOVERY · VITALS</span>
            </div>
            <h2 className="text-white font-semibold text-[17px] mb-0.5">Vitals Trend</h2>
            <p className="text-[13px] text-[var(--fc-text-secondary)]">30 day rolling averages</p>
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-center">
            {/* Resting HR */}
            <div className="flex items-center justify-between p-4 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-[12px] relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--fc-chart-3)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-32 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--fc-chart-3)]/10 flex items-center justify-center text-[var(--fc-chart-3)]">
                  <Heart size={14} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--fc-text-secondary)] font-medium mb-0.5">RHR</div>
                  <div className="text-[13px] font-semibold text-white">Resting HR</div>
                </div>
              </div>
              <div className="flex items-baseline gap-1 w-24 justify-end">
                <div className="text-[28px] font-light tabular-nums tracking-tight">48</div>
                <div className="text-[11px] text-[var(--fc-text-secondary)]">bpm</div>
              </div>
              <div className="w-20 flex justify-center">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--fc-chart-3)] bg-[var(--fc-chart-3)]/10 px-2 py-0.5 rounded-full">
                  <ArrowDownRight size={12} strokeWidth={2.5} /> 2 bpm
                </div>
              </div>
              <div className="w-24 flex justify-end pr-2">
                <Sparkline data={[52,51,51,50,49,50,51,49,48,48,49,48,47,48,48]} color="var(--fc-chart-3)" gradientId="gradHR" />
              </div>
            </div>

            {/* HRV */}
            <div className="flex items-center justify-between p-4 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-[12px] relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--fc-chart-4)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-32 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--fc-chart-4)]/10 flex items-center justify-center text-[var(--fc-chart-4)]">
                  <Activity size={14} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--fc-text-secondary)] font-medium mb-0.5">HRV</div>
                  <div className="text-[13px] font-semibold text-white">Variability</div>
                </div>
              </div>
              <div className="flex items-baseline gap-1 w-24 justify-end">
                <div className="text-[28px] font-light tabular-nums tracking-tight">68</div>
                <div className="text-[11px] text-[var(--fc-text-secondary)]">ms</div>
              </div>
              <div className="w-20 flex justify-center">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--fc-chart-3)] bg-[var(--fc-chart-3)]/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={12} strokeWidth={2.5} /> 4 ms
                </div>
              </div>
              <div className="w-24 flex justify-end pr-2">
                <Sparkline data={[55,58,60,59,62,65,63,64,68,67,69,66,68,68,68]} color="var(--fc-chart-4)" gradientId="gradHRV" />
              </div>
            </div>

            {/* Sleep */}
            <div className="flex items-center justify-between p-4 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-[12px] relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--fc-chart-5)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-32 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--fc-chart-5)]/10 flex items-center justify-center text-[var(--fc-chart-5)]">
                  <Moon size={14} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--fc-text-secondary)] font-medium mb-0.5">SLEEP</div>
                  <div className="text-[13px] font-semibold text-white">Duration</div>
                </div>
              </div>
              <div className="flex items-baseline gap-1 w-24 justify-end">
                <div className="text-[28px] font-light tabular-nums tracking-tight">7.2</div>
                <div className="text-[11px] text-[var(--fc-text-secondary)]">hrs</div>
              </div>
              <div className="w-20 flex justify-center">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--fc-chart-5)] bg-[var(--fc-chart-5)]/10 px-2 py-0.5 rounded-full">
                  <ArrowDownRight size={12} strokeWidth={2.5} /> 0.4 h
                </div>
              </div>
              <div className="w-24 flex justify-end pr-2">
                <Sparkline data={[7.5,7.6,7.8,7.4,7.5,7.1,7.0,6.8,6.9,7.1,7.3,7.0,7.1,7.2,7.2]} color="var(--fc-chart-5)" gradientId="gradSleep" />
              </div>
            </div>

            {/* VO2 Max */}
            <div className="flex items-center justify-between p-4 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-[12px] relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--fc-chart-1)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-32 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--fc-chart-1)]/10 flex items-center justify-center text-[var(--fc-chart-1)]">
                  <Zap size={14} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--fc-text-secondary)] font-medium mb-0.5">FITNESS</div>
                  <div className="text-[13px] font-semibold text-white">VO2 Max</div>
                </div>
              </div>
              <div className="flex items-baseline gap-1 w-24 justify-end">
                <div className="text-[28px] font-light tabular-nums tracking-tight">54.2</div>
                <div className="text-[11px] text-[var(--fc-text-secondary)]">ml/kg</div>
              </div>
              <div className="w-20 flex justify-center">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--fc-chart-3)] bg-[var(--fc-chart-3)]/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={12} strokeWidth={2.5} /> 0.2
                </div>
              </div>
              <div className="w-24 flex justify-end pr-2">
                <Sparkline data={[52,52.5,53,53.2,53.5,53.8,54.0,54.2]} color="var(--fc-chart-1)" gradientId="gradVO2" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
