
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Target } from "lucide-react";
import "./_group.css";

const data = [
  { name: "Completed", value: 32 },
  { name: "Remaining", value: 8 },
];

export default function DonutGoal() {
  return (
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-3)]">
                <Target size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">GOAL · WEEK 11</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Weekly Mileage Goal</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">Current week progress</p>
            </div>
          </div>

          <div className="flex-1 relative w-full min-h-0 flex flex-col items-center justify-center mt-2">
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--fc-chart-4)" />
                  <stop offset="100%" stopColor="var(--fc-chart-3)" />
                </linearGradient>
                <filter id="glowCenter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="20" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full bg-[var(--fc-chart-3)] opacity-[0.08]" style={{ filter: "url(#glowCenter)" }}></div>
            </div>

            <div className="absolute inset-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={data}
                    innerRadius={115}
                    outerRadius={135}
                    startAngle={225}
                    endAngle={-45}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                    paddingAngle={5}
                  >
                    <Cell fill="url(#donutGrad)" />
                    <Cell fill="var(--fc-border)" opacity={0.5} />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Dots */}
            <div className="absolute inset-0 pointer-events-none">
              {/* This is a simplified way to place dots, properly it requires trig math */}
              <div className="absolute left-1/2 top-[12%] -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--fc-surface)] border border-[var(--fc-chart-3)] z-10"></div>
              <div className="absolute right-[14%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--fc-surface)] border border-[var(--fc-border)] z-10"></div>
              <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--fc-surface)] border border-[var(--fc-border)] z-10"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <div className="text-[72px] font-light tracking-tighter tabular-nums leading-none mb-2" style={{ textShadow: '0 0 40px rgba(45, 212, 191, 0.3)' }}>
                80<span className="text-[28px] text-[var(--fc-text-secondary)] font-normal ml-1">%</span>
              </div>
              <div className="flex gap-4 text-[11px] font-medium text-[var(--fc-text-secondary)]">
                <div><span className="text-[var(--fc-text-primary)]">8 km</span> TO GO</div>
                <div className="w-1 h-1 rounded-full bg-[var(--fc-border)] self-center"></div>
                <div><span className="text-[var(--fc-text-primary)]">3 DAYS</span> LEFT</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 flex justify-between gap-4">
            <div className="flex-1 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-lg p-3">
              <div className="flex justify-between text-[11px] mb-2 font-medium">
                <span className="text-[var(--fc-text-secondary)]">EASY</span>
                <span className="text-[var(--fc-text-primary)]">18.5 / 20 km</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--fc-border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--fc-chart-4)] rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="flex-1 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-lg p-3">
              <div className="flex justify-between text-[11px] mb-2 font-medium">
                <span className="text-[var(--fc-text-secondary)]">TEMPO</span>
                <span className="text-[var(--fc-text-primary)]">8.0 / 10 km</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--fc-border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--fc-chart-2)] rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="flex-1 bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-lg p-3">
              <div className="flex justify-between text-[11px] mb-2 font-medium">
                <span className="text-[var(--fc-text-secondary)]">LONG</span>
                <span className="text-[var(--fc-text-primary)]">5.5 / 10 km</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--fc-border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--fc-chart-1)] rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
