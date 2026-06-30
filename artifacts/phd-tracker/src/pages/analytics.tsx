import {
  useGetAnalyticsSummary,
  useGetAnalyticsByCountry,
  useGetAnalyticsByStage,
  useGetUpcomingDeadlines,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STAGE_COLORS: Record<string, string> = {
  sourced: "#94a3b8", interested: "#60a5fa",
  applied: "#a78bfa", interview_scheduled: "#f59e0b",
  offer_received: "#22c55e", rejected: "#ef4444", withdrawn: "#9ca3af",
};

const STAGE_LABELS: Record<string, string> = {
  sourced: "Sourced", interested: "Interested",
  applied: "Applied", interview_scheduled: "Interview Scheduled",
  offer_received: "Offer Received",
  rejected: "Rejected", withdrawn: "Withdrawn",
};

function pct(n: number) { return `${Math.round(n * 100)}%`; }

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86400000);
}

function BarChart({ data, maxVal }: { data: { label: string; value: number; color?: string }[]; maxVal: number }) {
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground truncate max-w-[180px]">{d.label}</span>
            <span className="font-semibold ml-2">{d.value}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: maxVal > 0 ? `${(d.value / maxVal) * 100}%` : "0%",
                backgroundColor: d.color ?? "hsl(var(--primary))",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { data: summary, isLoading: loadingSummary } = useGetAnalyticsSummary();
  const { data: byCountry, isLoading: loadingCountry } = useGetAnalyticsByCountry();
  const { data: byStage, isLoading: loadingStage } = useGetAnalyticsByStage();
  const { data: deadlines, isLoading: loadingDeadlines } = useGetUpcomingDeadlines();

  const totalApps = summary?.totalApplications ?? 0;
  const maxCountry = Math.max(...(byCountry ?? []).map((c) => c.count), 1);
  const maxStage = Math.max(...(byStage ?? []).map((s) => s.count), 1);

  return (
    <div className="p-6 max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Pipeline performance and conversion metrics</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loadingSummary ? (
          Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardContent className="pt-6"><Skeleton className="h-12 w-full" /></CardContent></Card>)
        ) : (
          <>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold">{totalApps}</div>
                <div className="text-xs text-muted-foreground mt-1">Total Applications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-violet-600">{summary?.interviewCount ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Interviews</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-emerald-600">{summary?.offerCount ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Offers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <div className="text-3xl font-bold text-red-500">{summary?.rejectedCount ?? 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Rejections</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader><CardTitle className="text-base">Conversion Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loadingSummary ? <Skeleton className="h-40 w-full" /> : (
              <>
                {[
                  { label: "Sourced → Applied", value: summary?.conversionRates?.sourcedToApplied ?? 0, color: "#a78bfa" },
                  { label: "Applied → Interview", value: summary?.conversionRates?.appliedToInterview ?? 0, color: "#f59e0b" },
                  { label: "Interview → Offer", value: summary?.conversionRates?.interviewToOffer ?? 0, color: "#22c55e" },
                  { label: "Offer → Accepted", value: summary?.conversionRates?.offerToAccepted ?? 0, color: "#10b981" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-bold">{pct(row.value)}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: pct(row.value), backgroundColor: row.color }} />
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-amber-600">{summary?.deadlineIn7Days ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Due 7d</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600">{summary?.deadlineIn14Days ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Due 14d</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{summary?.deadlineIn30Days ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Due 30d</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Health Metrics */}
        <Card>
          <CardHeader><CardTitle className="text-base">Health Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loadingSummary ? <Skeleton className="h-40 w-full" /> : (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Document Completion</span>
                    <span className="font-bold">{pct(summary?.documentCompletionRate ?? 0)}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: pct(summary?.documentCompletionRate ?? 0) }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Outreach Response Rate</span>
                    <span className="font-bold">{pct(summary?.outreachResponseRate ?? 0)}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: pct(summary?.outreachResponseRate ?? 0) }} />
                  </div>
                </div>
                <div className="border-t pt-3 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{summary?.acceptedCount ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{summary?.urgentCount ?? 0}</div>
                    <div className="text-xs text-muted-foreground">Urgent</div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* By Stage */}
        <Card>
          <CardHeader><CardTitle className="text-base">Applications by Stage</CardTitle></CardHeader>
          <CardContent>
            {loadingStage ? <Skeleton className="h-40 w-full" /> : (byStage ?? []).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            ) : (
              <BarChart
                data={(byStage ?? []).map((s) => ({
                  label: STAGE_LABELS[s.stage] ?? s.stage,
                  value: s.count,
                  color: STAGE_COLORS[s.stage],
                }))}
                maxVal={maxStage}
              />
            )}
          </CardContent>
        </Card>

        {/* By Country */}
        <Card>
          <CardHeader><CardTitle className="text-base">Applications by Country</CardTitle></CardHeader>
          <CardContent>
            {loadingCountry ? <Skeleton className="h-40 w-full" /> : (byCountry ?? []).length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-2">
                {(byCountry ?? []).slice(0, 10).map((c) => (
                  <div key={c.country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{c.country}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-violet-600">{c.applied} applied</span>
                        <span className="text-amber-600">{c.interviews} int.</span>
                        <span className="font-semibold">{c.count} total</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-full"
                        style={{ width: `${(c.count / maxCountry) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deadline Risk */}
      <Card>
        <CardHeader><CardTitle className="text-base">Deadline Risk — Next 30 Days</CardTitle></CardHeader>
        <CardContent>
          {loadingDeadlines ? <Skeleton className="h-32 w-full" /> : (deadlines ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No upcoming deadlines in 30 days</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">University</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Country</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Project</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Deadline</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(deadlines ?? []).map((app) => {
                    const days = app.deadline ? daysUntil(app.deadline) : null;
                    const cls = days !== null && days <= 7 ? "text-red-600 font-semibold" : days !== null && days <= 14 ? "text-amber-600 font-semibold" : "text-muted-foreground";
                    return (
                      <tr key={app.id} className="hover:bg-muted/30">
                        <td className="py-2 font-medium">{app.university}</td>
                        <td className="py-2 text-muted-foreground">{app.country}</td>
                        <td className="py-2 text-muted-foreground truncate max-w-xs">{app.projectTitle ?? "—"}</td>
                        <td className="py-2 text-muted-foreground">{app.deadline}</td>
                        <td className={`py-2 ${cls}`}>{days === 0 ? "Today" : days === 1 ? "1 day" : `${days} days`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
