import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetApplication,
  useUpdateApplication,
  useListDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useListOutreach,
  useCreateOutreach,
  useCreateReminder,
  getGetApplicationQueryKey,
  getListDocumentsQueryKey,
  getListOutreachQueryKey,
  getListRemindersQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, CheckSquare, Square, ExternalLink, Edit, Plus, AlertTriangle, CalendarPlus } from "lucide-react";
import { downloadICS } from "@/lib/ics";

const STAGES = [
  "sourced", "interested", "applied",
  "interview_scheduled", "offer_received",
  "rejected", "withdrawn",
];
const STAGE_LABELS: Record<string, string> = {
  sourced: "Sourced", interested: "Interested",
  applied: "Applied", interview_scheduled: "Interview Scheduled",
  offer_received: "Offer Received", rejected: "Rejected", withdrawn: "Withdrawn",
};
const STAGE_COLORS: Record<string, string> = {
  sourced: "bg-slate-100 text-slate-700", interested: "bg-blue-100 text-blue-700",
  applied: "bg-violet-100 text-violet-700", interview_scheduled: "bg-amber-100 text-amber-700",
  offer_received: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600", withdrawn: "bg-gray-100 text-gray-500",
};

const DEFAULT_DOCS = [
  "CV", "Motivation Letter", "Research Statement", "Transcripts",
  "Degree Certificate", "References", "English Certificate",
  "Passport Copy", "Research Proposal", "Writing Sample", "Portfolio",
];

const EUROPEAN_COUNTRIES = [
  "Germany", "Netherlands", "Sweden", "Finland", "Denmark", "Belgium",
  "France", "Italy", "Spain", "Switzerland", "Austria", "Norway",
  "UK", "Portugal", "Czech Republic", "Poland", "Hungary", "Ireland",
  "Luxembourg", "Estonia", "Latvia", "Lithuania", "Other",
];

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const appId = parseInt(id ?? "0");
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Record<string, string | boolean | number>>({});
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDocType, setNewDocType] = useState("CV");
  const [showAddOutreach, setShowAddOutreach] = useState(false);
  const [outreachForm, setOutreachForm] = useState({
    professorName: "", institution: "", email: "",
    dateContacted: "", subjectLine: "", messageSummary: "",
    threadStatus: "pending", responseReceived: false,
  });

  const { data: app, isLoading } = useGetApplication(appId, {
    query: { enabled: !!appId, queryKey: getGetApplicationQueryKey(appId) },
  });
  const { data: documents } = useListDocuments(appId, {
    query: { enabled: !!appId, queryKey: getListDocumentsQueryKey(appId) },
  });
  const { data: outreachList } = useListOutreach(
    { applicationId: appId },
    { query: { enabled: !!appId, queryKey: getListOutreachQueryKey({ applicationId: appId }) } }
  );

  const updateMutation = useUpdateApplication({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetApplicationQueryKey(appId) });
        setEditMode(false);
      },
    },
  });

  const createDocMutation = useCreateDocument({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(appId) });
        setShowAddDoc(false);
      },
    },
  });

  const updateDocMutation = useUpdateDocument({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(appId) });
      },
    },
  });

  const deleteDocMutation = useDeleteDocument({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListDocumentsQueryKey(appId) });
      },
    },
  });

  const createOutreachMutation = useCreateOutreach({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOutreachQueryKey() });
        setShowAddOutreach(false);
        setOutreachForm({ professorName: "", institution: "", email: "", dateContacted: "", subjectLine: "", messageSummary: "", threadStatus: "pending", responseReceived: false });
      },
    },
  });

  const createReminderMutation = useCreateReminder({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListRemindersQueryKey() });
      },
    },
  });

  if (isLoading) {
    return <div className="p-6 space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-64 w-full" /></div>;
  }
  if (!app) {
    return <div className="p-6"><p className="text-muted-foreground">Application not found.</p></div>;
  }

  function startEdit() {
    setEditForm({
      university: app!.university,
      country: app!.country,
      program: app!.program ?? "",
      department: app!.department ?? "",
      projectTitle: app!.projectTitle ?? "",
      supervisorName: app!.supervisorName ?? "",
      fundingSource: app!.fundingSource ?? "",
      portalLink: app!.portalLink ?? "",
      fieldArea: app!.fieldArea ?? "",
      stage: app!.stage,
      deadline: app!.deadline ?? "",
      dateApplied: app!.dateApplied ?? "",
      interviewDate: app!.interviewDate ?? "",
      notes: app!.notes ?? "",
      priorityScore: app!.priorityScore ?? "",
      fitScore: app!.fitScore ?? "",
      nextAction: app!.nextAction ?? "",
      nextActionDate: app!.nextActionDate ?? "",
      researchFitReason: app!.researchFitReason ?? "",
      supervisorFitReason: app!.supervisorFitReason ?? "",
      papersToRead: app!.papersToRead ?? "",
      skillsMatch: app!.skillsMatch ?? "",
      missingRequirements: app!.missingRequirements ?? "",
      risks: app!.risks ?? "",
      outreachAngle: app!.outreachAngle ?? "",
    });
    setEditMode(true);
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate({
      id: appId,
      data: {
        university: editForm.university as string,
        country: editForm.country as string,
        program: (editForm.program as string) || undefined,
        department: (editForm.department as string) || undefined,
        projectTitle: (editForm.projectTitle as string) || undefined,
        supervisorName: (editForm.supervisorName as string) || undefined,
        fundingSource: (editForm.fundingSource as string) || undefined,
        portalLink: (editForm.portalLink as string) || undefined,
        fieldArea: (editForm.fieldArea as string) || undefined,
        stage: editForm.stage as string,
        deadline: (editForm.deadline as string) || undefined,
        dateApplied: (editForm.dateApplied as string) || undefined,
        interviewDate: (editForm.interviewDate as string) || undefined,
        notes: (editForm.notes as string) || undefined,
        priorityScore: editForm.priorityScore ? parseInt(editForm.priorityScore as string) : undefined,
        fitScore: editForm.fitScore ? parseInt(editForm.fitScore as string) : undefined,
        nextAction: (editForm.nextAction as string) || undefined,
        nextActionDate: (editForm.nextActionDate as string) || undefined,
        researchFitReason: (editForm.researchFitReason as string) || undefined,
        supervisorFitReason: (editForm.supervisorFitReason as string) || undefined,
        papersToRead: (editForm.papersToRead as string) || undefined,
        skillsMatch: (editForm.skillsMatch as string) || undefined,
        missingRequirements: (editForm.missingRequirements as string) || undefined,
        risks: (editForm.risks as string) || undefined,
        outreachAngle: (editForm.outreachAngle as string) || undefined,
      },
    });
  }

  function quickStage(stage: string) {
    updateMutation.mutate({ id: appId, data: { stage } });
    queryClient.invalidateQueries({ queryKey: getGetApplicationQueryKey(appId) });
  }

  function toggleDocField(docId: number, field: "isUploaded" | "isVerified" | "isSent", current: boolean) {
    updateDocMutation.mutate({
      applicationId: appId,
      id: docId,
      data: { [field]: !current },
    });
  }

  const uploadedCount = (documents ?? []).filter((d) => d.isUploaded).length;
  const totalRequired = (documents ?? []).filter((d) => d.isRequired).length;

  return (
    <div className="p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/applications")} className="mt-0.5">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{app.university}</h1>
            {app.isUrgent && <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs font-semibold"><AlertTriangle className="w-3 h-3" /> Urgent</span>}
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STAGE_COLORS[app.stage] ?? ""}`}>
              {STAGE_LABELS[app.stage] ?? app.stage}
            </span>
            {app.country && <span className="text-sm text-muted-foreground">{app.country}</span>}
            {app.projectTitle && <span className="text-sm text-muted-foreground truncate max-w-sm">{app.projectTitle}</span>}
            {app.portalLink && (
              <a href={app.portalLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
                <ExternalLink className="w-3.5 h-3.5" /> Portal
              </a>
            )}
          </div>
        </div>
        <Button onClick={startEdit} variant="outline" size="sm">
          <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit
        </Button>
      </div>

      {/* Stage Progress */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-1 flex-wrap">
            {STAGES.filter((s) => !["rejected", "withdrawn"].includes(s)).map((s, i) => {
              const stageIdx = STAGES.indexOf(app.stage);
              const thisIdx = STAGES.indexOf(s);
              const isActive = s === app.stage;
              const isPast = stageIdx > thisIdx && !["rejected", "withdrawn"].includes(app.stage);
              return (
                <button
                  key={s}
                  onClick={() => quickStage(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    isActive ? `${STAGE_COLORS[s]} ring-2 ring-offset-1 ring-current` :
                    isPast ? "bg-muted/60 text-muted-foreground line-through opacity-60" :
                    "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {STAGE_LABELS[s]}
                </button>
              );
            })}
            <button onClick={() => quickStage("rejected")} className={`px-2.5 py-1 rounded text-xs font-medium ml-2 ${app.stage === "rejected" ? "bg-red-100 text-red-700 ring-2 ring-offset-1 ring-red-400" : "bg-muted text-muted-foreground hover:bg-red-50"}`}>Rejected</button>
            <button onClick={() => quickStage("withdrawn")} className={`px-2.5 py-1 rounded text-xs font-medium ${app.stage === "withdrawn" ? "bg-gray-100 text-gray-600 ring-2 ring-offset-1 ring-gray-400" : "bg-muted text-muted-foreground hover:bg-gray-50"}`}>Withdrawn</button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="documents">
            Documents {documents && documents.length > 0 ? `(${uploadedCount}/${documents.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="outreach">Outreach {outreachList && outreachList.length > 0 ? `(${outreachList.length})` : ""}</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Application Info</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { label: "Program", value: app.program },
                  { label: "Department", value: app.department },
                  { label: "Supervisor", value: app.supervisorName },
                  { label: "Funding", value: app.fundingSource },
                  { label: "Field", value: app.fieldArea },
                  { label: "Deadline", value: app.deadline },
                  { label: "Date Applied", value: app.dateApplied },
                  { label: "Interview Date", value: app.interviewDate },
                  { label: "Offer Status", value: app.offerStatus },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-muted-foreground w-32 shrink-0">{label}</span>
                    <span className="font-medium">{value ?? <span className="text-muted-foreground">—</span>}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Scores & Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {app.fitScore != null && (
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-muted-foreground">Fit Score</span><span className="font-bold">{app.fitScore}/100</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${app.fitScore}%` }} /></div>
                  </div>
                )}
                {app.priorityScore != null && (
                  <div>
                    <div className="flex justify-between mb-1"><span className="text-muted-foreground">Priority Score</span><span className="font-bold">{app.priorityScore}/100</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-violet-500 rounded-full" style={{ width: `${app.priorityScore}%` }} /></div>
                  </div>
                )}
                {app.nextAction && (
                  <div className="pt-2 border-t">
                    <div className="text-muted-foreground mb-1">Next Action</div>
                    <div className="font-medium">{app.nextAction}</div>
                    {app.nextActionDate && <div className="text-xs text-muted-foreground mt-0.5">Due: {app.nextActionDate}</div>}
                  </div>
                )}
                {app.statusReason && (
                  <div className="pt-2 border-t">
                    <div className="text-muted-foreground mb-1">Status Reason</div>
                    <div>{app.statusReason}</div>
                  </div>
                )}
                {app.notes && (
                  <div className="pt-2 border-t">
                    <div className="text-muted-foreground mb-1">Notes</div>
                    <div className="whitespace-pre-wrap text-xs">{app.notes}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions: deadline */}
          {app.deadline && (
            <Card className="border-dashed">
              <CardContent className="pt-4 pb-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="text-sm"><span className="font-medium">Deadline:</span> <span className="text-muted-foreground">{app.deadline}</span></div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() =>
                    downloadICS({
                      summary: `PhD Deadline: ${app.university}`,
                      description: `Application deadline for ${app.program ?? app.projectTitle ?? "PhD"} at ${app.university}, ${app.country}.`,
                      dateStr: app.deadline!,
                      allDay: true,
                    }, `deadline-${app.university.replace(/\s+/g, "-")}`)
                  }>
                    <CalendarPlus className="w-3.5 h-3.5 mr-1.5" /> Export to Calendar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    createReminderMutation.mutate({
                      data: {
                        applicationId: appId,
                        reminderType: "deadline",
                        dueDate: app.deadline!,
                        priority: "high",
                      },
                    });
                  }}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick actions: interview */}
          {app.interviewDate && (
            <Card className="border-dashed border-amber-200 bg-amber-50/40">
              <CardContent className="pt-4 pb-4 flex items-center justify-between gap-2 flex-wrap">
                <div className="text-sm"><span className="font-medium">Interview:</span> <span className="text-muted-foreground">{app.interviewDate}</span></div>
                <Button size="sm" variant="outline" onClick={() =>
                  downloadICS({
                    summary: `PhD Interview: ${app.university}`,
                    description: `Interview for ${app.program ?? app.projectTitle ?? "PhD"} at ${app.university}, ${app.country}.`,
                    dateStr: app.interviewDate!,
                    allDay: false,
                    durationHours: 1,
                  }, `interview-${app.university.replace(/\s+/g, "-")}`)
                }>
                  <CalendarPlus className="w-3.5 h-3.5 mr-1.5" /> Export to Calendar
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Why this program fits", value: app.researchFitReason },
              { label: "Why this supervisor fits", value: app.supervisorFitReason },
              { label: "Papers to read", value: app.papersToRead },
              { label: "Skills match", value: app.skillsMatch },
              { label: "Missing requirements", value: app.missingRequirements },
              { label: "Risks", value: app.risks },
              { label: "Outreach angle", value: app.outreachAngle },
            ].map(({ label, value }) => (
              <Card key={label}>
                <CardContent className="pt-4 pb-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{label}</div>
                  <div className="text-sm whitespace-pre-wrap">{value ?? <span className="text-muted-foreground italic">Not filled in yet</span>}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {uploadedCount} of {(documents ?? []).length} uploaded, {(documents ?? []).filter((d) => d.isVerified).length} verified
            </p>
            <Button size="sm" onClick={() => setShowAddDoc(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Document
            </Button>
          </div>
          {(documents ?? []).length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground text-sm">No documents tracked yet</p>
                <Button className="mt-3" size="sm" onClick={() => {
                  DEFAULT_DOCS.forEach((docType) => {
                    createDocMutation.mutate({ applicationId: appId, data: { docType, isRequired: true } });
                  });
                }}>Initialize default document checklist</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Document</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Required</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Uploaded</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Verified</th>
                    <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">Sent</th>
                    <th className="px-3 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(documents ?? []).map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5">
                        <div className="font-medium">{doc.docType}</div>
                        {doc.fileName && <div className="text-xs text-muted-foreground">{doc.fileName}</div>}
                        {doc.notes && <div className="text-xs text-muted-foreground italic">{doc.notes}</div>}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={() => toggleDocField(doc.id, "isUploaded", false)}>
                          {doc.isRequired ? <CheckSquare className="w-4 h-4 text-primary mx-auto" /> : <Square className="w-4 h-4 text-muted-foreground mx-auto" />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={() => toggleDocField(doc.id, "isUploaded", doc.isUploaded ?? false)}>
                          {doc.isUploaded ? <CheckSquare className="w-4 h-4 text-emerald-600 mx-auto" /> : <Square className="w-4 h-4 text-muted-foreground mx-auto" />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={() => toggleDocField(doc.id, "isVerified", doc.isVerified ?? false)}>
                          {doc.isVerified ? <CheckSquare className="w-4 h-4 text-blue-600 mx-auto" /> : <Square className="w-4 h-4 text-muted-foreground mx-auto" />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button onClick={() => toggleDocField(doc.id, "isSent", doc.isSent ?? false)}>
                          {doc.isSent ? <CheckSquare className="w-4 h-4 text-violet-600 mx-auto" /> : <Square className="w-4 h-4 text-muted-foreground mx-auto" />}
                        </button>
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => deleteDocMutation.mutate({ applicationId: appId, id: doc.id })} className="text-destructive/60 hover:text-destructive text-xs">remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Outreach Tab */}
        <TabsContent value="outreach" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{(outreachList ?? []).length} contact{(outreachList ?? []).length !== 1 ? "s" : ""}</p>
            <Button size="sm" onClick={() => setShowAddOutreach(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Log Contact
            </Button>
          </div>
          {(outreachList ?? []).length === 0 ? (
            <Card><CardContent className="py-10 text-center"><p className="text-muted-foreground text-sm">No outreach logged for this application</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {(outreachList ?? []).map((o) => (
                <Card key={o.id}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{o.professorName}</div>
                        {o.institution && <div className="text-sm text-muted-foreground">{o.institution}</div>}
                        {o.email && <div className="text-xs text-muted-foreground">{o.email}</div>}
                        {o.subjectLine && <div className="text-sm italic mt-1">"{o.subjectLine}"</div>}
                        {o.responseSummary && <div className="text-sm bg-green-50 border border-green-200 rounded px-2 py-1 mt-1">Reply: {o.responseSummary}</div>}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${o.responseReceived ? "bg-green-100 text-green-700" : o.threadStatus === "no_response" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-700"}`}>
                          {o.responseReceived ? "Replied" : o.threadStatus ?? "Pending"}
                        </span>
                        {o.dateContacted && <div className="text-xs text-muted-foreground mt-1">{o.dateContacted}</div>}
                        {o.nextFollowUpDate && !o.responseReceived && (
                          <div className="text-xs text-amber-600 mt-0.5">Follow-up: {o.nextFollowUpDate}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Application</DialogTitle></DialogHeader>
          <form onSubmit={saveEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label>University *</Label><Input value={editForm.university as string ?? ""} onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} required /></div>
              <div>
                <Label>Country *</Label>
                <Select value={editForm.country as string ?? ""} onValueChange={(v) => setEditForm({ ...editForm, country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EUROPEAN_COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stage</Label>
                <Select value={editForm.stage as string ?? "sourced"} onValueChange={(v) => setEditForm({ ...editForm, stage: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STAGES.map((s) => <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {[
                { key: "program", label: "Program" }, { key: "department", label: "Department" },
                { key: "projectTitle", label: "Project Title", col2: true },
                { key: "supervisorName", label: "Supervisor" }, { key: "fundingSource", label: "Funding Source" },
                { key: "fieldArea", label: "Field / Research Area" }, { key: "portalLink", label: "Portal Link" },
              ].map(({ key, label, col2 }) => (
                <div key={key} className={col2 ? "col-span-2" : ""}>
                  <Label>{label}</Label>
                  <Input value={editForm[key] as string ?? ""} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} />
                </div>
              ))}
              <div><Label>Deadline</Label><Input type="date" value={editForm.deadline as string ?? ""} onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })} /></div>
              <div><Label>Date Applied</Label><Input type="date" value={editForm.dateApplied as string ?? ""} onChange={(e) => setEditForm({ ...editForm, dateApplied: e.target.value })} /></div>
              <div><Label>Interview Date</Label><Input type="date" value={editForm.interviewDate as string ?? ""} onChange={(e) => setEditForm({ ...editForm, interviewDate: e.target.value })} /></div>
              <div></div>
              <div><Label>Fit Score (0–100)</Label><Input type="number" min="0" max="100" value={editForm.fitScore as string ?? ""} onChange={(e) => setEditForm({ ...editForm, fitScore: e.target.value })} /></div>
              <div><Label>Priority Score (0–100)</Label><Input type="number" min="0" max="100" value={editForm.priorityScore as string ?? ""} onChange={(e) => setEditForm({ ...editForm, priorityScore: e.target.value })} /></div>
              <div className="col-span-2"><Label>Next Action</Label><Input value={editForm.nextAction as string ?? ""} onChange={(e) => setEditForm({ ...editForm, nextAction: e.target.value })} /></div>
              <div><Label>Next Action Date</Label><Input type="date" value={editForm.nextActionDate as string ?? ""} onChange={(e) => setEditForm({ ...editForm, nextActionDate: e.target.value })} /></div>
              <div></div>
              {[
                { key: "researchFitReason", label: "Why this program fits" },
                { key: "supervisorFitReason", label: "Why this supervisor fits" },
                { key: "papersToRead", label: "Papers to read" },
                { key: "skillsMatch", label: "Skills match" },
                { key: "missingRequirements", label: "Missing requirements" },
                { key: "risks", label: "Risks" },
                { key: "outreachAngle", label: "Outreach angle" },
              ].map(({ key, label }) => (
                <div key={key} className="col-span-2">
                  <Label>{label}</Label>
                  <Textarea value={editForm[key] as string ?? ""} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} rows={2} />
                </div>
              ))}
              <div className="col-span-2"><Label>Notes</Label><Textarea value={editForm.notes as string ?? ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={3} /></div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Document Modal */}
      <Dialog open={showAddDoc} onOpenChange={setShowAddDoc}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Document</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Document Type</Label>
              <Select value={newDocType} onValueChange={setNewDocType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEFAULT_DOCS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDoc(false)}>Cancel</Button>
            <Button onClick={() => createDocMutation.mutate({ applicationId: appId, data: { docType: newDocType, isRequired: true } })} disabled={createDocMutation.isPending}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Outreach Modal */}
      <Dialog open={showAddOutreach} onOpenChange={setShowAddOutreach}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Log Contact</DialogTitle></DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); createOutreachMutation.mutate({ data: { ...outreachForm, applicationId: appId, followUpCount: 0, institution: outreachForm.institution || undefined, email: outreachForm.email || undefined, dateContacted: outreachForm.dateContacted || undefined, subjectLine: outreachForm.subjectLine || undefined, messageSummary: outreachForm.messageSummary || undefined } }); }} className="space-y-3">
            <div><Label>Professor Name *</Label><Input value={outreachForm.professorName} onChange={(e) => setOutreachForm({ ...outreachForm, professorName: e.target.value })} required /></div>
            <div><Label>Institution</Label><Input value={outreachForm.institution} onChange={(e) => setOutreachForm({ ...outreachForm, institution: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={outreachForm.email} onChange={(e) => setOutreachForm({ ...outreachForm, email: e.target.value })} /></div>
            <div><Label>Date Contacted</Label><Input type="date" value={outreachForm.dateContacted} onChange={(e) => setOutreachForm({ ...outreachForm, dateContacted: e.target.value })} /></div>
            <div><Label>Subject Line</Label><Input value={outreachForm.subjectLine} onChange={(e) => setOutreachForm({ ...outreachForm, subjectLine: e.target.value })} /></div>
            <div><Label>Message Summary</Label><Textarea value={outreachForm.messageSummary} onChange={(e) => setOutreachForm({ ...outreachForm, messageSummary: e.target.value })} rows={2} /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddOutreach(false)}>Cancel</Button>
              <Button type="submit" disabled={createOutreachMutation.isPending}>Log</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
