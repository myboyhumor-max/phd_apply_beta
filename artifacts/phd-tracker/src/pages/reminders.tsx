import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListReminders,
  useCreateReminder,
  useUpdateReminder,
  useDeleteReminder,
  useListApplications,
  getListRemindersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Bell, CheckCircle2, Clock, AlertTriangle, Trash2, CalendarPlus } from "lucide-react";
import { downloadICS } from "@/lib/ics";

const REMINDER_TYPES = [
  { value: "deadline", label: "Deadline" },
  { value: "interview", label: "Interview" },
  { value: "follow_up", label: "Follow-up" },
  { value: "document", label: "Document" },
  { value: "recommendation", label: "Recommendation Letter" },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  deadline: AlertTriangle,
  interview: Clock,
  follow_up: Bell,
  document: Bell,
  recommendation: Bell,
};

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

const emptyForm = {
  applicationId: "", reminderType: "deadline", dueDate: "",
  priority: "medium", status: "pending", notes: "",
};

export default function Reminders() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: reminders, isLoading } = useListReminders(
    statusFilter ? { status: statusFilter } : undefined
  );
  const { data: applications } = useListApplications();

  const createMutation = useCreateReminder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() });
        setShowCreate(false);
        setForm({ ...emptyForm });
      },
    },
  });

  const updateMutation = useUpdateReminder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() });
      },
    },
  });

  const deleteMutation = useDeleteReminder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() });
      },
    },
  });

  function handleComplete(id: number) {
    updateMutation.mutate({ id, data: { isCompleted: true, status: "done" } });
  }

  function handleSnooze(id: number, dueDate: string) {
    const newDate = new Date(dueDate);
    newDate.setDate(newDate.getDate() + 3);
    updateMutation.mutate({ id, data: { isSnoozed: true, dueDate: newDate.toISOString().split("T")[0] } });
  }

  function getAppLabel(id: number | null | undefined) {
    if (id == null) return null;
    const app = (applications ?? []).find((a) => a.id === id);
    return app ? `${app.university}` : `App #${id}`;
  }

  const overdue = (reminders ?? []).filter((r) => !r.isCompleted && daysUntil(r.dueDate) < 0);
  const dueToday = (reminders ?? []).filter((r) => !r.isCompleted && daysUntil(r.dueDate) === 0);
  const upcoming = (reminders ?? []).filter((r) => !r.isCompleted && daysUntil(r.dueDate) > 0);
  const completed = (reminders ?? []).filter((r) => r.isCompleted);

  function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({
      data: {
        applicationId: form.applicationId ? parseInt(form.applicationId) : undefined,
        reminderType: form.reminderType,
        dueDate: form.dueDate,
        priority: form.priority || undefined,
        status: form.status || undefined,
        notes: form.notes || undefined,
      },
    });
  }

  function ReminderCard({ r }: { r: NonNullable<typeof reminders>[number] }) {
    const days = daysUntil(r.dueDate);
    const Icon = TYPE_ICONS[r.reminderType] ?? Bell;
    const urgency = days < 0 ? "border-red-300 bg-red-50" : days === 0 ? "border-amber-300 bg-amber-50" : "";
    const typeLabel = REMINDER_TYPES.find((t) => t.value === r.reminderType)?.label ?? r.reminderType;
    return (
      <Card className={`transition-shadow hover:shadow-sm ${urgency}`}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${days < 0 ? "text-red-500" : days === 0 ? "text-amber-500" : "text-muted-foreground"}`} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{typeLabel}</span>
                  {r.priority && (
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[r.priority] ?? ""}`}>
                      {r.priority}
                    </span>
                  )}
                  {r.isSnoozed && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">snoozed</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {days < 0 ? (
                    <span className="text-red-600 font-medium">{Math.abs(days)} day{Math.abs(days) !== 1 ? "s" : ""} overdue</span>
                  ) : days === 0 ? (
                    <span className="text-amber-600 font-medium">Due today</span>
                  ) : days === 1 ? (
                    <span>Due tomorrow</span>
                  ) : (
                    <span>Due in {days} days — {r.dueDate}</span>
                  )}
                  {r.applicationId && <span className="ml-2 text-primary/70">{getAppLabel(r.applicationId)}</span>}
                </div>
                {r.notes && <div className="text-xs text-muted-foreground mt-1">{r.notes}</div>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                title="Export to Calendar (.ics)"
                onClick={() =>
                  downloadICS({
                    summary: `PhD Reminder: ${typeLabel}`,
                    description: r.notes ?? undefined,
                    dateStr: r.dueDate,
                    allDay: true,
                  }, `reminder-${r.reminderType}-${r.dueDate}`)
                }
              >
                <CalendarPlus className="w-3.5 h-3.5" />
              </Button>
              {!r.isCompleted && (
                <>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700" onClick={() => handleComplete(r.id)}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => handleSnooze(r.id, r.dueDate)} title="Snooze 3 days">
                    <Clock className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete reminder?")) deleteMutation.mutate({ id: r.id }); }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground text-sm mt-1">Deadlines, follow-ups, and document alerts</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Reminder
        </Button>
      </div>

      <div className="flex gap-2">
        {[
          { value: "pending", label: "Pending" },
          { value: "done", label: "Completed" },
          { value: "", label: "All" },
        ].map((f) => (
          <Button key={f.value} variant={statusFilter === f.value ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(f.value)}>
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}</div>
      ) : (
        <div className="space-y-6">
          {overdue.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">Overdue ({overdue.length})</h2>
              <div className="space-y-2">{overdue.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
            </div>
          )}
          {dueToday.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2">Due Today ({dueToday.length})</h2>
              <div className="space-y-2">{dueToday.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
            </div>
          )}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Upcoming ({upcoming.length})</h2>
              <div className="space-y-2">{upcoming.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
            </div>
          )}
          {completed.length > 0 && statusFilter !== "pending" && (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Completed ({completed.length})</h2>
              <div className="space-y-2 opacity-60">{completed.map((r) => <ReminderCard key={r.id} r={r} />)}</div>
            </div>
          )}
          {(reminders ?? []).length === 0 && (
            <Card><CardContent className="py-16 text-center">
              <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No reminders</p>
              <Button className="mt-4" onClick={() => setShowCreate(true)}>Add your first reminder</Button>
            </CardContent></Card>
          )}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Reminder</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitCreate} className="space-y-4">
            <div>
              <Label>Type *</Label>
              <Select value={form.reminderType} onValueChange={(v) => setForm({ ...form, reminderType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REMINDER_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Due Date *</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Linked Application</Label>
              <Select value={form.applicationId || "_none"} onValueChange={(v) => setForm({ ...form, applicationId: v === "_none" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {(applications ?? []).map((a) => <SelectItem key={a.id} value={a.id.toString()}>{a.university} — {a.country}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Adding..." : "Add Reminder"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
