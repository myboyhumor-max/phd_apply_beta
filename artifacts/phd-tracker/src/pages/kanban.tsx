import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  useListApplications,
  useUpdateApplication,
  getListApplicationsQueryKey,
  type Application,
} from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, AlertTriangle, CalendarDays } from "lucide-react";

const STAGES = [
  "sourced",
  "interested",
  "applied",
  "interview_scheduled",
  "offer_received",
  "rejected",
  "withdrawn",
] as const;

type Stage = (typeof STAGES)[number];

const STAGE_LABELS: Record<Stage, string> = {
  sourced: "Sourced",
  interested: "Interested",
  applied: "Applied",
  interview_scheduled: "Interview Scheduled",
  offer_received: "Offer Received",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STAGE_HEADER: Record<Stage, string> = {
  sourced: "bg-slate-100 text-slate-700 border-slate-200",
  interested: "bg-blue-100 text-blue-700 border-blue-200",
  applied: "bg-violet-100 text-violet-700 border-violet-200",
  interview_scheduled: "bg-amber-100 text-amber-700 border-amber-200",
  offer_received: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
  withdrawn: "bg-gray-100 text-gray-500 border-gray-200",
};

const STAGE_DROP_ACTIVE: Record<Stage, string> = {
  sourced: "ring-2 ring-slate-400 bg-slate-50",
  interested: "ring-2 ring-blue-400 bg-blue-50",
  applied: "ring-2 ring-violet-400 bg-violet-50",
  interview_scheduled: "ring-2 ring-amber-400 bg-amber-50",
  offer_received: "ring-2 ring-green-400 bg-green-50",
  rejected: "ring-2 ring-red-400 bg-red-50",
  withdrawn: "ring-2 ring-gray-400 bg-gray-50",
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

function ApplicationCard({ app }: { app: Application }) {
  const days = app.deadline ? daysUntil(app.deadline) : null;
  const deadlineUrgent = days !== null && days <= 14 && days >= 0;

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("appId", String(app.id));
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white border border-border rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow select-none group"
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 flex-1">
          {app.university}
        </p>
        <Link
          href={`/applications/${app.id}`}
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        >
          <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
        </Link>
      </div>

      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
        {app.projectTitle ?? app.program ?? app.fieldArea ?? "—"}
      </p>

      <div className="flex items-center justify-between gap-1 flex-wrap">
        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">
          {app.country}
        </span>

        {(app.isUrgent || deadlineUrgent) && (
          <span className="flex items-center gap-0.5 text-[10px] text-red-600 font-medium">
            <AlertTriangle className="w-3 h-3" />
            Urgent
          </span>
        )}

        {app.deadline && days !== null && (
          <span
            className={`flex items-center gap-0.5 text-[10px] font-medium ${
              days < 0
                ? "text-gray-400"
                : days <= 7
                ? "text-red-600"
                : days <= 14
                ? "text-amber-600"
                : "text-muted-foreground"
            }`}
          >
            <CalendarDays className="w-3 h-3" />
            {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
          </span>
        )}
      </div>
    </div>
  );
}

function KanbanColumn({
  stage,
  apps,
  onDrop,
}: {
  stage: Stage;
  apps: Application[];
  onDrop: (appId: number, stage: Stage) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current++;
    setIsDragOver(true);
  }

  function handleDragLeave() {
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const appId = parseInt(e.dataTransfer.getData("appId"), 10);
    if (!isNaN(appId)) onDrop(appId, stage);
  }

  return (
    <div className="flex flex-col min-w-[220px] w-[220px] shrink-0">
      <div
        className={`rounded-t-lg border px-3 py-2 mb-2 flex items-center justify-between ${STAGE_HEADER[stage]}`}
      >
        <span className="text-xs font-semibold">{STAGE_LABELS[stage]}</span>
        <span className="text-xs font-bold tabular-nums">{apps.length}</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 min-h-[120px] rounded-lg border-2 border-dashed border-transparent p-1.5 space-y-2 transition-all duration-150 ${
          isDragOver
            ? STAGE_DROP_ACTIVE[stage]
            : "hover:border-border"
        }`}
      >
        {apps.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}

        {apps.length === 0 && !isDragOver && (
          <div className="h-20 flex items-center justify-center text-[11px] text-muted-foreground/50 italic">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

export default function Kanban() {
  const queryClient = useQueryClient();
  const { data: applications, isLoading } = useListApplications();
  const updateMutation = useUpdateApplication();

  function handleDrop(appId: number, newStage: Stage) {
    const app = applications?.find((a) => a.id === appId);
    if (!app || app.stage === newStage) return;

    queryClient.setQueryData(getListApplicationsQueryKey(), (old: Application[] | undefined) =>
      old ? old.map((a) => (a.id === appId ? { ...a, stage: newStage } : a)) : old
    );

    updateMutation.mutate(
      { id: appId, data: { stage: newStage } },
      {
        onError: () => {
          queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
        },
      }
    );
  }

  const byStage = (stage: Stage): Application[] =>
    (applications ?? []).filter((a) => a.stage === stage);

  return (
    <div className="flex flex-col h-screen">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-bold text-foreground">Kanban Board</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Drag cards between stages to update their status
        </p>
      </div>

      <div className="flex-1 overflow-x-auto px-6 py-4">
        {isLoading ? (
          <div className="flex gap-4">
            {STAGES.map((s) => (
              <div key={s} className="min-w-[220px]">
                <Skeleton className="h-9 w-full rounded-lg mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 h-full pb-4">
            {STAGES.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                apps={byStage(stage)}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
