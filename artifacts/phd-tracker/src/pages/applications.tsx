import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListApplications,
  useCreateApplication,
  useDeleteApplication,
  getListApplicationsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ExternalLink, Trash2, AlertTriangle } from "lucide-react";

const STAGES = [
  "sourced", "interested", "applied",
  "interview_scheduled", "offer_received",
  "rejected", "withdrawn",
];

const STAGE_LABELS: Record<string, string> = {
  sourced: "Sourced",
  interested: "Interested",
  applied: "Applied",
  interview_scheduled: "Interview Scheduled",
  offer_received: "Offer Received",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STAGE_COLORS: Record<string, string> = {
  sourced: "bg-slate-100 text-slate-700 border-slate-200",
  interested: "bg-blue-100 text-blue-700 border-blue-200",
  applied: "bg-violet-100 text-violet-700 border-violet-200",
  interview_scheduled: "bg-amber-100 text-amber-700 border-amber-200",
  offer_received: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const EUROPEAN_COUNTRIES = [
  "Germany", "Netherlands", "Sweden", "Finland", "Denmark", "Belgium",
  "France", "Italy", "Spain", "Switzerland", "Austria", "Norway",
  "UK", "Portugal", "Czech Republic", "Poland", "Hungary", "Ireland",
  "Luxembourg", "Estonia", "Latvia", "Lithuania", "Other",
];

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

export default function Applications() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [stageFilter, setStageFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    university: "", country: "", program: "", department: "",
    projectTitle: "", supervisorName: "", fundingSource: "",
    portalLink: "", fieldArea: "", stage: "sourced",
    deadline: "", dateSourced: "", notes: "",
    priorityScore: "", fitScore: "",
  });

  const { data: applications, isLoading } = useListApplications(
    stageFilter || countryFilter ? { stage: stageFilter || undefined, country: countryFilter || undefined } : undefined
  );

  const createMutation = useCreateApplication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
        setShowCreate(false);
        setForm({
          university: "", country: "", program: "", department: "",
          projectTitle: "", supervisorName: "", fundingSource: "",
          portalLink: "", fieldArea: "", stage: "sourced",
          deadline: "", dateSourced: "", notes: "",
          priorityScore: "", fitScore: "",
        });
      },
    },
  });

  const deleteMutation = useDeleteApplication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
      },
    },
  });

  const filtered = (applications ?? []).filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.university.toLowerCase().includes(q) ||
      (a.projectTitle ?? "").toLowerCase().includes(q) ||
      (a.supervisorName ?? "").toLowerCase().includes(q) ||
      (a.fieldArea ?? "").toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
    );
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({
      data: {
        university: form.university,
        country: form.country,
        program: form.program || undefined,
        department: form.department || undefined,
        projectTitle: form.projectTitle || undefined,
        supervisorName: form.supervisorName || undefined,
        fundingSource: form.fundingSource || undefined,
        portalLink: form.portalLink || undefined,
        fieldArea: form.fieldArea || undefined,
        stage: form.stage,
        deadline: form.deadline || undefined,
        dateSourced: form.dateSourced || undefined,
        notes: form.notes || undefined,
        priorityScore: form.priorityScore ? parseInt(form.priorityScore) : undefined,
        fitScore: form.fitScore ? parseInt(form.fitScore) : undefined,
      },
    });
  }

  return (
    <div className="p-6 max-w-7xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} application{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search university, project, supervisor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={stageFilter || "_all"} onValueChange={(v) => setStageFilter(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={countryFilter || "_all"} onValueChange={(v) => setCountryFilter(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All countries</SelectItem>
            {EUROPEAN_COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(stageFilter || countryFilter || search) && (
          <Button variant="ghost" onClick={() => { setStageFilter(""); setCountryFilter(""); setSearch(""); }}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No applications found</p>
            <Button className="mt-4" onClick={() => setShowCreate(true)}>Add your first application</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">University / Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Country</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stage</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Deadline</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Score</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Next Action</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((app) => {
                const days = app.deadline ? daysUntil(app.deadline) : null;
                const deadlineColor =
                  days !== null && days <= 7 ? "text-red-600 font-semibold" :
                  days !== null && days <= 14 ? "text-amber-600 font-semibold" :
                  "text-muted-foreground";
                return (
                  <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {app.isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <div>
                          <Link href={`/applications/${app.id}`} className="font-medium hover:text-primary">
                            {app.university}
                          </Link>
                          {app.projectTitle && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs">{app.projectTitle}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{app.country}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${STAGE_COLORS[app.stage] ?? ""}`}>
                        {STAGE_LABELS[app.stage] ?? app.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {app.deadline ? (
                        <div>
                          <div className={`text-xs ${deadlineColor}`}>
                            {days === 0 ? "Today" : days === 1 ? "Tomorrow" : days !== null && days < 0 ? "Overdue" : `${days}d`}
                          </div>
                          <div className="text-xs text-muted-foreground">{app.deadline}</div>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {app.fitScore != null ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${app.fitScore}%` }} />
                          </div>
                          <span className="text-xs font-medium">{app.fitScore}</span>
                        </div>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {app.nextAction ?? "—"}
                      </div>
                      {app.nextActionDate && (
                        <div className="text-xs text-muted-foreground">{app.nextActionDate}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/applications/${app.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Delete this application?")) {
                              deleteMutation.mutate({ id: app.id });
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>University *</Label>
                <Input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} required placeholder="e.g. TU Delft" />
              </div>
              <div>
                <Label>Country *</Label>
                <Select value={form.country} onValueChange={(v) => setForm({ ...form, country: v })}>
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {EUROPEAN_COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stage</Label>
                <Select value={form.stage} onValueChange={(v) => setForm({ ...form, stage: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Program / Department</Label>
                <Input value={form.program} onChange={(e) => setForm({ ...form, program: e.target.value })} placeholder="e.g. Computer Science" />
              </div>
              <div>
                <Label>Field / Research Area</Label>
                <Input value={form.fieldArea} onChange={(e) => setForm({ ...form, fieldArea: e.target.value })} placeholder="e.g. Machine Learning" />
              </div>
              <div className="col-span-2">
                <Label>Project Title</Label>
                <Input value={form.projectTitle} onChange={(e) => setForm({ ...form, projectTitle: e.target.value })} placeholder="e.g. Deep Learning for Medical Imaging" />
              </div>
              <div>
                <Label>Supervisor Name</Label>
                <Input value={form.supervisorName} onChange={(e) => setForm({ ...form, supervisorName: e.target.value })} placeholder="e.g. Prof. Jane Smith" />
              </div>
              <div>
                <Label>Funding Source</Label>
                <Input value={form.fundingSource} onChange={(e) => setForm({ ...form, fundingSource: e.target.value })} placeholder="e.g. NWO, DAAD, EU Horizon" />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div>
                <Label>Date Sourced</Label>
                <Input type="date" value={form.dateSourced} onChange={(e) => setForm({ ...form, dateSourced: e.target.value })} />
              </div>
              <div>
                <Label>Fit Score (0–100)</Label>
                <Input type="number" min="0" max="100" value={form.fitScore} onChange={(e) => setForm({ ...form, fitScore: e.target.value })} placeholder="0-100" />
              </div>
              <div>
                <Label>Priority Score (0–100)</Label>
                <Input type="number" min="0" max="100" value={form.priorityScore} onChange={(e) => setForm({ ...form, priorityScore: e.target.value })} placeholder="0-100" />
              </div>
              <div>
                <Label>Portal / Source Link</Label>
                <Input value={form.portalLink} onChange={(e) => setForm({ ...form, portalLink: e.target.value })} placeholder="https://..." />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
