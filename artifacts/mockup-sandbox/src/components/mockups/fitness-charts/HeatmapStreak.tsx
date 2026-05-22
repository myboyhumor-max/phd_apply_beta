
import { Flame } from "lucide-react";
import "./_group.css";

const generateStreakData = () => {
  const data = [];
  const levels = [0, 0, 0, 1, 1, 1, 2, 2, 3, 4];
  for (let w = 0; w < 26; w++) {
    for (let d = 0; d < 7; d++) {
      data.push({
        week: w,
        day: d,
        level: levels[Math.floor(Math.random() * levels.length)],
      });
    }
  }
  return data;
};

const streakData = generateStreakData();

const getColor = (level: number) => {
  switch (level) {
    case 1: return "rgba(46, 91, 255, 0.4)"; // light blue
    case 2: return "var(--fc-chart-1)"; // blue
    case 3: return "var(--fc-chart-3)"; // teal
    case 4: return "var(--fc-chart-4)"; // bright teal
    default: return "rgba(255, 255, 255, 0.03)"; // none
  }
};

const getGlow = (level: number) => {
  if (level >= 3) return `0 0 8px ${getColor(level)}`;
  return 'none';
};

export default function HeatmapStreak() {
  return (
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content flex flex-col h-full">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-chart-3)]">
                <Flame size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">STREAK · CONSISTENCY</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Activity Heatmap</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">26 week activity consistency</p>
            </div>
            
            <div className="bg-[var(--fc-chart-3)]/10 border border-[var(--fc-chart-3)]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-medium text-[var(--fc-chart-3)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--fc-chart-3)] shadow-[0_0_4px_var(--fc-chart-3)]"></div>
              ACTIVE STREAK: 14 DAYS
            </div>
          </div>

          <div className="flex justify-between items-end mb-6">
            <div className="flex gap-8">
              <div>
                <div className="text-[32px] font-light tabular-nums leading-none mb-1 text-white">42</div>
                <div className="text-[10px] text-[var(--fc-text-secondary)] uppercase tracking-wider font-medium">Longest Streak</div>
              </div>
              <div>
                <div className="text-[32px] font-light tabular-nums leading-none mb-1 text-white">128</div>
                <div className="text-[10px] text-[var(--fc-text-secondary)] uppercase tracking-wider font-medium">Total Activities</div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center justify-center bg-[var(--fc-surface-light)] border border-[var(--fc-border)] rounded-xl p-4">
            <div className="flex">
              <div className="flex flex-col gap-[4px] mr-3 pt-5 text-[10px] text-[var(--fc-text-secondary)] font-medium">
                <span className="h-[14px] leading-[14px]">Mon</span>
                <span className="h-[14px] leading-[14px] opacity-0">Tue</span>
                <span className="h-[14px] leading-[14px]">Wed</span>
                <span className="h-[14px] leading-[14px] opacity-0">Thu</span>
                <span className="h-[14px] leading-[14px]">Fri</span>
                <span className="h-[14px] leading-[14px] opacity-0">Sat</span>
                <span className="h-[14px] leading-[14px]">Sun</span>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-[var(--fc-text-secondary)] font-medium mb-2 px-1">
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                </div>
                <div className="flex gap-[4px]">
                  {Array.from({ length: 26 }).map((_, w) => (
                    <div key={w} className="flex flex-col gap-[4px]">
                      {Array.from({ length: 7 }).map((_, d) => {
                        const point = streakData.find(p => p.week === w && p.day === d);
                        return (
                          <div 
                            key={`${w}-${d}`} 
                            className="w-[14px] h-[14px] rounded-[3px] transition-all duration-300 hover:scale-125 cursor-pointer relative"
                            style={{ 
                              backgroundColor: point ? getColor(point.level) : "rgba(255,255,255,0.03)",
                              boxShadow: point ? getGlow(point.level) : "none"
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-end">
            <div className="flex gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] uppercase tracking-wider text-[var(--fc-text-secondary)] font-medium">Top Days</div>
                <div className="flex items-end gap-1 h-6">
                  {/* Fake sparkbars for weekday breakdown */}
                  <div className="w-1.5 h-3 bg-[var(--fc-border)] rounded-full"></div>
                  <div className="w-1.5 h-6 bg-[var(--fc-chart-3)] rounded-full"></div>
                  <div className="w-1.5 h-4 bg-[var(--fc-border)] rounded-full"></div>
                  <div className="w-1.5 h-5 bg-[var(--fc-chart-1)] rounded-full"></div>
                  <div className="w-1.5 h-2 bg-[var(--fc-border)] rounded-full"></div>
                  <div className="w-1.5 h-6 bg-[var(--fc-chart-3)] rounded-full"></div>
                  <div className="w-1.5 h-6 bg-[var(--fc-chart-4)] rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[var(--fc-text-secondary)] font-medium">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-[12px] h-[12px] rounded-[3px] bg-[rgba(255,255,255,0.03)]" />
                <div className="w-[12px] h-[12px] rounded-[3px] bg-[rgba(46,91,255,0.4)]" />
                <div className="w-[12px] h-[12px] rounded-[3px] bg-[var(--fc-chart-1)]" />
                <div className="w-[12px] h-[12px] rounded-[3px] bg-[var(--fc-chart-3)]" />
                <div className="w-[12px] h-[12px] rounded-[3px] bg-[var(--fc-chart-4)]" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
