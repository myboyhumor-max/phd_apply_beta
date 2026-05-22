import React, { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import "./_group.css";

const initialData = [
  { id: 1, date: "Tue Mar 11", type: "Easy Run", distance: 8.2, duration: "42:15", pace: "5:09", hr: 142, elev: 86 },
  { id: 2, date: "Sun Mar 09", type: "Long Run", distance: 22.0, duration: "1:55:30", pace: "5:15", hr: 145, elev: 210 },
  { id: 3, date: "Thu Mar 06", type: "Tempo", distance: 12.5, duration: "58:20", pace: "4:40", hr: 162, elev: 45 },
  { id: 4, date: "Tue Mar 04", type: "Easy Run", distance: 7.5, duration: "39:45", pace: "5:18", hr: 138, elev: 65 },
  { id: 5, date: "Sun Mar 02", type: "Long Run", distance: 18.0, duration: "1:36:00", pace: "5:20", hr: 144, elev: 185 },
];

export default function TableRecent() {
  const [sortCol, setSortCol] = useState("date");
  const [sortAsc, setSortAsc] = useState(false);

  const SortIcon = ({ active, asc }: { active: boolean, asc: boolean }) => {
    if (!active) return <ArrowUpDown size={14} className="opacity-30" />;
    return asc ? <ArrowUp size={14} className="text-[var(--fc-chart-3)]" /> : <ArrowDown size={14} className="text-[var(--fc-chart-3)]" />;
  };

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--fc-bg)] font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="w-[600px] h-[480px] bg-[var(--fc-surface)] border border-[var(--fc-border)] rounded-xl p-8 flex flex-col">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-medium tracking-tight mb-1">Recent Workouts</h2>
            <p className="text-sm text-[var(--fc-text-secondary)]">Latest logged activities</p>
          </div>
          <button className="text-sm text-[var(--fc-chart-3)] hover:text-[var(--fc-chart-4)] transition-colors">
            View All
          </button>
        </div>

        <div className="flex-1 w-full overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--fc-border)]">
                {["Date", "Type", "Dist (km)", "Duration", "Pace", "HR", "Elev (m)"].map((header, i) => {
                  const colKey = ["date", "type", "distance", "duration", "pace", "hr", "elev"][i];
                  return (
                    <th 
                      key={header} 
                      className="pb-3 text-xs font-medium text-[var(--fc-text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--fc-text-primary)] transition-colors"
                      onClick={() => handleSort(colKey)}
                    >
                      <div className={`flex items-center gap-1 ${i > 1 ? 'justify-end' : ''}`}>
                        {header}
                        <SortIcon active={sortCol === colKey} asc={sortAsc} />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {initialData.map((row) => (
                <tr key={row.id} className="border-b border-[var(--fc-border)]/50 hover:bg-[var(--fc-bg)] transition-colors group">
                  <td className="py-4 text-sm font-medium whitespace-nowrap">{row.date}</td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs
                      ${row.type === 'Easy Run' ? 'bg-[var(--fc-chart-4)]/10 text-[var(--fc-chart-4)]' : 
                        row.type === 'Long Run' ? 'bg-[var(--fc-chart-1)]/10 text-[var(--fc-chart-1)]' : 
                        'bg-[var(--fc-chart-5)]/10 text-[var(--fc-chart-5)]'}
                    `}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-right font-medium">{row.distance.toFixed(1)}</td>
                  <td className="py-4 text-sm text-right text-[var(--fc-text-secondary)] group-hover:text-[var(--fc-text-primary)] transition-colors">{row.duration}</td>
                  <td className="py-4 text-sm text-right">{row.pace}</td>
                  <td className="py-4 text-sm text-right">{row.hr}</td>
                  <td className="py-4 text-sm text-right text-[var(--fc-text-secondary)] group-hover:text-[var(--fc-text-primary)] transition-colors">{row.elev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
