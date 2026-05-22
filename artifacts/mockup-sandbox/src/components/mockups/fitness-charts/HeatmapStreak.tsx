import React from "react";
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
    case 1: return "var(--fc-border)"; // light
    case 2: return "var(--fc-chart-1)"; // mod
    case 3: return "var(--fc-chart-3)"; // hard
    case 4: return "var(--fc-chart-4)"; // peak
    default: return "var(--fc-bg)"; // none
  }
};

export default function HeatmapStreak() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-medium tracking-tight mb-1">Consistency Streak</h2>
            <p className="text-sm text-[var(--fc-text-secondary)]">26 week activity heatmap</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-2xl font-light text-[var(--fc-chart-3)]">14</div>
              <div className="text-xs text-[var(--fc-text-secondary)] uppercase tracking-wider">Current</div>
            </div>
            <div>
              <div className="text-2xl font-light">42</div>
              <div className="text-xs text-[var(--fc-text-secondary)] uppercase tracking-wider">Longest</div>
            </div>
            <div>
              <div className="text-2xl font-light">128</div>
              <div className="text-xs text-[var(--fc-text-secondary)] uppercase tracking-wider">Total</div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full flex items-center justify-center">
          <div className="flex">
            <div className="flex flex-col gap-[6px] mr-3 pt-6 text-[10px] text-[var(--fc-text-secondary)] font-medium">
              <span className="h-3 leading-3">Mon</span>
              <span className="h-3 leading-3 opacity-0">Tue</span>
              <span className="h-3 leading-3">Wed</span>
              <span className="h-3 leading-3 opacity-0">Thu</span>
              <span className="h-3 leading-3">Fri</span>
              <span className="h-3 leading-3 opacity-0">Sat</span>
              <span className="h-3 leading-3">Sun</span>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-[var(--fc-text-secondary)] font-medium mb-3 px-1">
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
              </div>
              <div className="flex gap-[6px]">
                {Array.from({ length: 26 }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-[6px]">
                    {Array.from({ length: 7 }).map((_, d) => {
                      const point = streakData.find(p => p.week === w && p.day === d);
                      return (
                        <div 
                          key={`${w}-${d}`} 
                          className="w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer"
                          style={{ 
                            backgroundColor: point ? getColor(point.level) : "var(--fc-bg)",
                            border: point && point.level === 0 ? "1px solid var(--fc-border)" : "none"
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
        
        <div className="mt-8 flex justify-end items-center gap-2 text-xs text-[var(--fc-text-secondary)]">
          <span>Rest</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm border border-[var(--fc-border)] bg-[var(--fc-bg)]" />
            <div className="w-3 h-3 rounded-sm bg-[var(--fc-border)]" />
            <div className="w-3 h-3 rounded-sm bg-[var(--fc-chart-1)]" />
            <div className="w-3 h-3 rounded-sm bg-[var(--fc-chart-3)]" />
            <div className="w-3 h-3 rounded-sm bg-[var(--fc-chart-4)]" />
          </div>
          <span>Peak</span>
        </div>
      </div>
    </div>
  );
}
