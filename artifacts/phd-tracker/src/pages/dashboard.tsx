import { Link } from "wouter";
import { useGetAnalyticsSummary, useGetUpcomingDeadlines, useGetAnalyticsByStage } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STAGE_COLORS: Record<string, string> = {
  sourced: "bg-slate-100 text-slate-700",
  interested: "bg-blue-100 text-blue-700",
  shortlisted: "bg-indigo-100 text-indigo-700",
  applied: "bg-violet-100 text-violet-700",
  under_review: "bg-purple-100 text-purple-700",
  interview_scheduled: "bg-amber-100 text-amber-700",
  interview_completed: "bg-orange-100 text-orange-700",
  offer_received: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
  accepted: "bg-emerald-100 text-emerald-800",
};

const STAGE_LABELS: Record<string, string> = {
  sourced: "Sourced",
  interested: "Interested",
  shortlisted: "Shortlisted",
  applied: "Applied",
  under_review: "Under Review",
  interview_scheduled: "Interview Scheduled",
  interview_completed: "Interview Completed",
  offer_received: "Offer Received",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
  accepted: "Accepted",
};

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function pct(n: number) {
  return `${Math.round(n * 100)}%`;
}

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetAnalyticsSummary();
  const { data: deadlines, isLoading: loadingDeadlines } = useGetUpcomingDeadlines();
  const { data: byStage, isLoading: loadingStage } = useGetAnalyticsByStage();

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Your PhD application pipeline at a glance</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loadingSummary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-12 w-full" /></CardContent></Card>
          ))
        ) : (
          <>
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{summary?.totalApplications ?? 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Applications</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-amber-600">{summary?.urgentCount ?? 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Urgent (14 days)</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-violet-500">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-violet-600">{summary?.interviewCount ?? 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Interviews</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-600">{summary?.offerCount ?? 0}</div>
                <div className="text-sm text-muted-foreground mt-1">Offers</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingSummary ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              [
                { label: "Sourced → Applied", value: summary?.conversionRates?.sourcedToApplied ?? 0 },
                { label: "Applied → Interview", value: summary?.conversionRates?.appliedToInterview ?? 0 },
                { label: "Interview → Offer", value: summary?.conversionRates?.interviewToOffer ?? 0 },
                { label: "Offer → Accepted", value: summary?.conversionRates?.offerToAccepted ?? 0 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold">{pct(row.value)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: pct(row.value) }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pipeline by Stage */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStage ? (
              <Skeleton className="h-40 w-full" />
            ) : (
              <div className="space-y-2">
                {(byStage ?? []).map((s) => (
                  <div key={s.stage} className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-44 ${STAGE_COLORS[s.stage] ?? "bg-gray-100 text-gray-700"}`}>
                      {STAGE_LABELS[s.stage] ?? s.stage}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-full"
                        style={{
                          width: summary?.totalApplications
                            ? `${(s.count / summary.totalApplications) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-6 text-right">{s.count}</span>
                  </div>
                ))}
                {(byStage ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document & Outreach Stats */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Health Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSummary ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Doc completion rate</span>
                    <span className="font-semibold">{pct(summary?.documentCompletionRate ?? 0)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: pct(summary?.documentCompletionRate ?? 0) }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Outreach response rate</span>
                    <span className="font-semibold">{pct(summary?.outreachResponseRate ?? 0)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: pct(summary?.outreachResponseRate ?? 0) }}
                    />
                  </div>
                </div>
                <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-amber-600">{summary?.deadlineIn7Days ?? 0}</div>
                    <div className="text-xs text-muted-foreground">7 days</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{summary?.deadlineIn14Days ?? 0}</div>
                    <div className="text-xs text-muted-foreground">14 days</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{summary?.deadlineIn30Days ?? 0}</div>
                    <div className="text-xs text-muted-foreground">30 days</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center">Deadlines remaining</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
          <Link href="/applications" className="text-sm text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {loadingDeadlines ? (
            <Skeleton className="h-32 w-full" />
          ) : (deadlines ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No upcoming deadlines in the next 30 days</p>
          ) : (
            <div className="divide-y">
              {(deadlines ?? []).slice(0, 8).map((app) => {
                const days = app.deadline ? daysUntil(app.deadline) : null;
                const urgency = days !== null && days <= 7 ? "text-red-600 font-semibold" : days !== null && days <= 14 ? "text-amber-600 font-semibold" : "text-muted-foreground";
                return (
                  <div key={app.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0">
                      <Link href={`/applications/${app.id}`} className="text-sm font-medium hover:text-primary truncate block">
                        {app.university} — {app.projectTitle ?? app.program ?? "PhD Position"}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STAGE_COLORS[app.stage] ?? ""}`}>
                          {STAGE_LABELS[app.stage] ?? app.stage}
                        </span>
                        <span className="text-xs text-muted-foreground">{app.country}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <div className={`text-sm ${urgency}`}>
                        {days !== null ? (days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">{app.deadline}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
