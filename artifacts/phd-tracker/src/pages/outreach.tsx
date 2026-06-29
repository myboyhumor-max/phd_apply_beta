import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListOutreach,
  useCreateOutreach,
  useUpdateOutreach,
  useDeleteOutreach,
  useListApplications,
  getListOutreachQueryKey,
  type Outreach,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mail, CheckCircle2, Clock, XCircle, Trash2, Edit } from "lucide-react";

const THREAD_STATUSES: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  replied: { label: "Replied", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  no_response: { label: "No Response", color: "bg-gray-100 text-gray-600", icon: XCircle },
  bounced: { label: "Bounced", color: "bg-red-100 text-red-700", icon: XCircle },
};

const TONE_COLORS: Record<string, string> = {
  cold: "bg-blue-100 text-blue-700",
  warm: "bg-orange-100 text-orange-700",
  enthusiastic: "bg-green-100 text-green-700",
};

function daysAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.round((now.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 30) return `${diff}d ago`;
  return dateStr;
}

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

const emptyForm = {
  applicationId: "", professorName: "", institution: "", email: "",
  dateContacted: "", subjectLine: "", messageSummary: "",
  threadStatus: "pending", followUpCount: "0",
  nextFollowUpDate: "", responseReceived: false,
  responseSummary: "", outcome: "", toneQuality: "cold", attachmentsSent: "",
};

export default function Outreach() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const { data: outreachList, isLoading } = useListOutreach();
  const { data: applications } = useListApplications();

  const createMutation = useCreateOutreach({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOutreachQueryKey() });
        setShowCreate(false);
        setForm({ ...emptyForm });
      },
    },
  });

  const updateMutation = useUpdateOutreach({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOutreachQueryKey() });
        setEditing(null);
        setForm({ ...emptyForm });
      },
    },
  });

  const deleteMutation = useDeleteOutreach({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOutreachQueryKey() });
      },
    },
  });

  const filtered = (outreachList ?? []).filter((o) => {
    if (statusFilter && o.threadStatus !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.professorName.toLowerCase().includes(q) ||
      (o.institution ?? "").toLowerCase().includes(q) ||
      (o.email ?? "").toLowerCase().includes(q)
    );
  });

  function getAppLabel(id: number | null | undefined) {
    if (id == null) return null;
    const app = (applications ?? []).find((a) => a.id === id);
    return app ? `${app.university} — ${app.country}` : `App #${id}`;
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      applicationId: form.applicationId ? parseInt(form.applicationId) : undefined,
      professorName: form.professorName,
      institution: form.institution || undefined,
      email: form.email || undefined,
      dateContacted: form.dateContacted || undefined,
      subjectLine: form.subjectLine || undefined,
      messageSummary: form.messageSummary || undefined,
      threadStatus: form.threadStatus || undefined,
      followUpCount: form.followUpCount ? parseInt(form.followUpCount) : undefined,
      nextFollowUpDate: form.nextFollowUpDate || undefined,
      responseReceived: form.responseReceived,
      responseSummary: form.responseSummary || undefined,
      outcome: form.outcome || undefined,
      toneQuality: form.toneQuality || undefined,
      attachmentsSent: form.attachmentsSent || undefined,
    };

    if (editing !== null) {
      updateMutation.mutate({ id: editing, data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  }

  function startEdit(o: Outreach) {
    if (!o) return;
    setForm({
      applicationId: o.applicationId?.toString() ?? "",
      professorName: o.professorName,
      institution: o.institution ?? "",
      email: o.email ?? "",
      dateContacted: o.dateContacted ?? "",
      subjectLine: o.subjectLine ?? "",
      messageSummary: o.messageSummary ?? "",
      threadStatus: o.threadStatus ?? "pending",
      followUpCount: (o.followUpCount ?? 0).toString(),
      nextFollowUpDate: o.nextFollowUpDate ?? "",
      responseReceived: o.responseReceived ?? false,
      responseSummary: o.responseSummary ?? "",
      outcome: o.outcome ?? "",
      toneQuality: o.toneQuality ?? "cold",
      attachmentsSent: o.attachmentsSent ?? "",
    });
    setEditing(o.id);
  }

  const totalContacted = (outreachList ?? []).length;
  const responded = (outreachList ?? []).filter((o) => o.responseReceived).length;
  const awaitingReply = (outreachList ?? []).filter((o) => o.threadStatus === "pending").length;
  const dueFollowUp = (outreachList ?? []).filter((o) => {
    if (!o.nextFollowUpDate || o.responseReceived) return false;
    return daysUntil(o.nextFollowUpDate) <= 3;
  }).length;

  return (
    <div className="p-6 max-w-7xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Outreach</h1>
          <p className="text-muted-foreground text-sm mt-1">Track professor and supervisor contacts</p>
        </div>
        <Button onClick={() => { setForm({ ...emptyForm }); setEditing(null); setShowCreate(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Log Contact
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold">{totalContacted}</div>
          <div className="text-xs text-muted-foreground">Total Contacted</div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-green-600">{responded}</div>
          <div className="text-xs text-muted-foreground">Responded</div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-amber-600">{awaitingReply}</div>
          <div className="text-xs text-muted-foreground">Awaiting Reply</div>
        </CardContent></Card>
        <Card><CardContent className="pt-4 pb-4">
          <div className="text-2xl font-bold text-red-500">{dueFollowUp}</div>
          <div className="text-xs text-muted-foreground">Follow-up Due</div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Search professor, institution..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={statusFilter || "_all"} onValueChange={(v) => setStatusFilter(v === "_all" ? "" : v)}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All statuses</SelectItem>
            {Object.entries(THREAD_STATUSES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {(search || statusFilter) && <Button variant="ghost" onClick={() => { setSearch(""); setStatusFilter(""); }}>Clear</Button>}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <Mail className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No outreach contacts found</p>
          <Button className="mt-4" onClick={() => setShowCreate(true)}>Log your first contact</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const status = THREAD_STATUSES[o.threadStatus ?? "pending"] ?? THREAD_STATUSES.pending;
            const StatusIcon = status.icon;
            const followUpDays = o.nextFollowUpDate ? daysUntil(o.nextFollowUpDate) : null;
            return (
              <Card key={o.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{o.professorName}</span>
                        {o.institution && <span className="text-muted-foreground text-sm">— {o.institution}</span>}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        {o.toneQuality && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${TONE_COLORS[o.toneQuality] ?? ""}`}>
                            {o.toneQuality}
                          </span>
                        )}
                        {o.responseReceived && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Replied
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        {o.email && <span>{o.email}</span>}
                        {o.dateContacted && <span>Contacted {daysAgo(o.dateContacted)}</span>}
                        {o.followUpCount != null && o.followUpCount > 0 && (
                          <span>{o.followUpCount} follow-up{o.followUpCount !== 1 ? "s" : ""}</span>
                        )}
                        {o.applicationId && (
                          <span className="text-primary/80">{getAppLabel(o.applicationId)}</span>
                        )}
                      </div>
                      {o.subjectLine && (
                        <div className="mt-2 text-sm text-muted-foreground italic truncate">"{o.subjectLine}"</div>
                      )}
                      {o.messageSummary && (
                        <div className="mt-1 text-sm text-muted-foreground truncate">{o.messageSummary}</div>
                      )}
                      {o.responseSummary && (
                        <div className="mt-1 text-sm bg-green-50 border border-green-200 rounded px-2 py-1 truncate">
                          <span className="text-green-700 font-medium">Reply: </span>
                          <span className="text-green-900">{o.responseSummary}</span>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {followUpDays !== null && !o.responseReceived && (
                        <div className={`text-xs font-medium mb-2 ${followUpDays <= 0 ? "text-red-600" : followUpDays <= 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                          {followUpDays <= 0 ? "Follow-up overdue" : followUpDays === 1 ? "Follow-up tomorrow" : `Follow-up in ${followUpDays}d`}
                        </div>
                      )}
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(o)}><Edit className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this outreach entry?")) deleteMutation.mutate({ id: o.id }); }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={showCreate || editing !== null} onOpenChange={(open) => { if (!open) { setShowCreate(false); setEditing(null); setForm({ ...emptyForm }); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing !== null ? "Edit Contact" : "Log New Contact"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitForm} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Professor / PI Name *</Label>
                <Input value={form.professorName} onChange={(e) => setForm({ ...form, professorName: e.target.value })} required placeholder="e.g. Prof. Marie Curie" />
              </div>
              <div>
                <Label>Institution</Label>
                <Input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="e.g. University of Paris" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="professor@university.edu" />
              </div>
              <div>
                <Label>Linked Application</Label>
                <Select value={form.applicationId || "_none"} onValueChange={(v) => setForm({ ...form, applicationId: v === "_none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="_none">None</SelectItem>
                    {(applications ?? []).map((a) => (
                      <SelectItem key={a.id} value={a.id.toString()}>{a.university} — {a.country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date Contacted</Label>
                <Input type="date" value={form.dateContacted} onChange={(e) => setForm({ ...form, dateContacted: e.target.value })} />
              </div>
              <div className="col-span-2">
                <Label>Subject Line</Label>
                <Input value={form.subjectLine} onChange={(e) => setForm({ ...form, subjectLine: e.target.value })} placeholder="e.g. Research collaboration inquiry" />
              </div>
              <div className="col-span-2">
                <Label>Message Summary</Label>
                <Textarea value={form.messageSummary} onChange={(e) => setForm({ ...form, messageSummary: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>Thread Status</Label>
                <Select value={form.threadStatus} onValueChange={(v) => setForm({ ...form, threadStatus: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(THREAD_STATUSES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tone / Relationship</Label>
                <Select value={form.toneQuality} onValueChange={(v) => setForm({ ...form, toneQuality: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cold">Cold</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Follow-up Count</Label>
                <Input type="number" min="0" value={form.followUpCount} onChange={(e) => setForm({ ...form, followUpCount: e.target.value })} />
              </div>
              <div>
                <Label>Next Follow-up Date</Label>
                <Input type="date" value={form.nextFollowUpDate} onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })} />
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="responseReceived" checked={form.responseReceived} onChange={(e) => setForm({ ...form, responseReceived: e.target.checked })} className="w-4 h-4" />
                  <Label htmlFor="responseReceived">Response received</Label>
                </div>
              </div>
              {form.responseReceived && (
                <div className="col-span-2">
                  <Label>Response Summary</Label>
                  <Textarea value={form.responseSummary} onChange={(e) => setForm({ ...form, responseSummary: e.target.value })} rows={2} />
                </div>
              )}
              <div>
                <Label>Outcome</Label>
                <Input value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} placeholder="e.g. Invited to apply" />
              </div>
              <div>
                <Label>Attachments Sent</Label>
                <Input value={form.attachmentsSent} onChange={(e) => setForm({ ...form, attachmentsSent: e.target.value })} placeholder="e.g. CV, Research Statement" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setShowCreate(false); setEditing(null); }}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editing !== null ? (updateMutation.isPending ? "Saving..." : "Save Changes") : (createMutation.isPending ? "Logging..." : "Log Contact")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
