import { useState } from "react";
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
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
    if (!active) return <ChevronDown size={12} className="opacity-0 group-hover:opacity-30 transition-opacity" />;
    return asc ? <ChevronUp size={12} className="text-[var(--fc-text-primary)]" /> : <ChevronDown size={12} className="text-[var(--fc-text-primary)]" />;
  };

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(false);
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Easy Run': return { bg: 'bg-[var(--fc-chart-4)]/10', text: 'text-[var(--fc-chart-4)]', dot: 'bg-[var(--fc-chart-4)]' };
      case 'Long Run': return { bg: 'bg-[var(--fc-chart-1)]/10', text: 'text-[var(--fc-chart-1)]', dot: 'bg-[var(--fc-chart-1)]' };
      case 'Tempo': return { bg: 'bg-[var(--fc-chart-2)]/10', text: 'text-[var(--fc-chart-2)]', dot: 'bg-[var(--fc-chart-2)]' };
      default: return { bg: 'bg-[var(--fc-chart-5)]/10', text: 'text-[var(--fc-chart-5)]', dot: 'bg-[var(--fc-chart-5)]' };
    }
  };

  return (
    <div className="fc-wrapper min-h-screen w-full flex items-center justify-center p-4 font-sans antialiased text-[var(--fc-text-primary)]">
      <div className="fc-card w-full max-w-[600px] h-[500px] rounded-[16px] p-6 flex flex-col">
        <div className="fc-card-content flex flex-col h-full">
          <div className="mb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 text-[var(--fc-text-secondary)]">
                <BarChart3 size={14} />
                <span className="text-[10px] uppercase tracking-[0.18em] font-medium">LOG · ACTIVITIES</span>
              </div>
              <h2 className="text-white font-semibold text-[17px] mb-0.5">Recent Workouts</h2>
              <p className="text-[13px] text-[var(--fc-text-secondary)]">Latest logged activities</p>
            </div>
            <div className="flex gap-4 text-[11px] font-medium bg-[var(--fc-surface-light)] border border-[var(--fc-border)] px-3 py-1.5 rounded-lg">
              <div><span className="text-[var(--fc-text-secondary)] mr-1">KM</span>68.2</div>
              <div className="w-px h-3 bg-[var(--fc-border)] self-center"></div>
              <div><span className="text-[var(--fc-text-secondary)] mr-1">TIME</span>5h 51m</div>
              <div className="w-px h-3 bg-[var(--fc-border)] self-center"></div>
              <div><span className="text-[var(--fc-text-secondary)] mr-1">AVG HR</span>146</div>
            </div>
          </div>

          <div className="flex-1 w-full overflow-hidden mt-2 relative rounded-lg border border-[var(--fc-border)] bg-[var(--fc-surface-light)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--fc-border)] bg-[var(--fc-surface)]">
                  {["Date", "Type", "Dist", "Time", "Pace", "HR"].map((header, i) => {
                    const colKey = ["date", "type", "distance", "duration", "pace", "hr"][i];
                    return (
                      <th 
                        key={header} 
                        className="py-3 px-3 text-[11px] font-medium text-[var(--fc-text-secondary)] uppercase tracking-wider cursor-pointer hover:text-[var(--fc-text-primary)] transition-colors group select-none"
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
                {initialData.map((row, idx) => {
                  const style = getTypeStyle(row.type);
                  // Make the second row permanently hovered for the preview
                  const isHovered = idx === 1;
                  return (
                    <tr 
                      key={row.id} 
                      className={`
                        border-b border-[var(--fc-border)]/50 transition-all duration-200 cursor-pointer relative
                        ${isHovered ? 'bg-[var(--fc-surface)] bg-gradient-to-r from-[rgba(45,212,191,0.05)] to-transparent shadow-[inset_2px_0_0_var(--fc-chart-3)]' : 'hover:bg-[var(--fc-surface)] hover:bg-gradient-to-r hover:from-[rgba(255,255,255,0.02)] hover:to-transparent hover:shadow-[inset_2px_0_0_rgba(255,255,255,0.2)]'}
                      `}
                    >
                      <td className="py-3.5 px-3 text-[13px] font-medium whitespace-nowrap text-white">{row.date}</td>
                      <td className="py-3.5 px-3 text-[13px]">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${style.bg} ${style.text}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
                          {row.type}
                        </div>
                      </td>
                      <td className={`py-3.5 px-3 text-[13px] text-right tabular-nums ${isHovered ? 'text-white font-medium' : 'text-[var(--fc-text-secondary)]'}`}>
                        {row.distance.toFixed(1)} <span className="text-[10px] opacity-50">km</span>
                      </td>
                      <td className={`py-3.5 px-3 text-[13px] text-right tabular-nums ${isHovered ? 'text-white' : 'text-[var(--fc-text-secondary)]'}`}>{row.duration}</td>
                      <td className={`py-3.5 px-3 text-[13px] text-right tabular-nums ${isHovered ? 'text-white' : 'text-[var(--fc-text-secondary)]'}`}>{row.pace}</td>
                      <td className={`py-3.5 px-3 text-[13px] text-right tabular-nums ${isHovered ? 'text-white' : 'text-[var(--fc-text-secondary)]'}`}>{row.hr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
