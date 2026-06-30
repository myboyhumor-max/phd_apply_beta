function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toICSDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function toICSDateTime(dateStr: string, hour = 9): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(hour)}0000`;
}

function uid(): string {
  return `phd-tracker-${Date.now()}-${Math.random().toString(36).slice(2)}@replit`;
}

export interface ICSEvent {
  summary: string;
  description?: string;
  dateStr: string;
  allDay?: boolean;
  durationHours?: number;
}

export function downloadICS(event: ICSEvent, filename: string) {
  const start = event.allDay
    ? toICSDate(event.dateStr)
    : toICSDateTime(event.dateStr, 9);

  const end = event.allDay
    ? toICSDate(event.dateStr)
    : toICSDateTime(event.dateStr, 9 + (event.durationHours ?? 1));

  const dtProp = event.allDay ? "DATE" : "DATE-TIME";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PhD Tracker//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid()}`,
    `DTSTAMP:${toICSDateTime(new Date().toISOString().split("T")[0])}Z`,
    `DTSTART;VALUE=${dtProp}:${start}`,
    `DTEND;VALUE=${dtProp}:${end}`,
    `SUMMARY:${event.summary}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
