import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import "./_group.css";

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 24;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default function SparklineHR() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col justify-center gap-6">
        <div className="mb-4">
          <h2 className="text-xl font-medium tracking-tight mb-1">Vitals Trend</h2>
          <p className="text-sm text-[var(--fc-text-secondary)]">30 day rolling averages</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 border border-[var(--fc-border)] rounded-lg bg-[var(--fc-bg)]">
            <div className="w-32">
              <div className="text-sm font-medium">Resting HR</div>
            </div>
            <div className="w-24 text-right flex flex-col items-end">
              <div className="text-2xl font-light">48<span className="text-xs text-[var(--fc-text-secondary)] ml-1">bpm</span></div>
              <div className="flex items-center text-xs text-[var(--fc-chart-3)]">
                <ArrowDown size={12} className="mr-0.5" /> 2 bpm
              </div>
            </div>
            <div className="w-32 flex justify-end">
              <Sparkline data={[52,51,51,50,49,50,51,49,48,48,49,48,47,48,48]} color="var(--fc-chart-3)" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-[var(--fc-border)] rounded-lg bg-[var(--fc-bg)]">
            <div className="w-32">
              <div className="text-sm font-medium">HRV</div>
            </div>
            <div className="w-24 text-right flex flex-col items-end">
              <div className="text-2xl font-light">68<span className="text-xs text-[var(--fc-text-secondary)] ml-1">ms</span></div>
              <div className="flex items-center text-xs text-[var(--fc-chart-3)]">
                <ArrowUp size={12} className="mr-0.5" /> 4 ms
              </div>
            </div>
            <div className="w-32 flex justify-end">
              <Sparkline data={[55,58,60,59,62,65,63,64,68,67,69,66,68,68,68]} color="var(--fc-chart-3)" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-[var(--fc-border)] rounded-lg bg-[var(--fc-bg)]">
            <div className="w-32">
              <div className="text-sm font-medium">Sleep</div>
            </div>
            <div className="w-24 text-right flex flex-col items-end">
              <div className="text-2xl font-light">7.2<span className="text-xs text-[var(--fc-text-secondary)] ml-1">hrs</span></div>
              <div className="flex items-center text-xs text-[var(--fc-chart-5)]">
                <ArrowDown size={12} className="mr-0.5" /> 0.4 h
              </div>
            </div>
            <div className="w-32 flex justify-end">
              <Sparkline data={[7.5,7.6,7.8,7.4,7.5,7.1,7.0,6.8,6.9,7.1,7.3,7.0,7.1,7.2,7.2]} color="var(--fc-chart-5)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
