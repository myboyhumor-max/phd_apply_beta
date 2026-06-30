import { Router, type IRouter } from "express";
import { gte, lte, and, sql } from "drizzle-orm";
import { db, applicationsTable, documentsTable, outreachTable } from "@workspace/db";

const router: IRouter = Router();

function addDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

router.get("/analytics/summary", async (req, res): Promise<void> => {
  const applications = await db.select().from(applicationsTable);

  const byStage: Record<string, number> = {};
  for (const app of applications) {
    byStage[app.stage] = (byStage[app.stage] ?? 0) + 1;
  }

  const total = applications.length;
  const sourced = total;
  const applied = applications.filter((a) =>
    ["applied", "interview_scheduled", "offer_received"].includes(a.stage)
  ).length;
  const interviewed = applications.filter((a) =>
    ["interview_scheduled", "offer_received"].includes(a.stage)
  ).length;
  const offered = applications.filter((a) => a.stage === "offer_received").length;
  const accepted = 0;
  const rejected = applications.filter((a) => a.stage === "rejected").length;

  const todayStr = today();
  const in7 = addDays(7);
  const in14 = addDays(14);
  const in30 = addDays(30);

  const activeApps = applications.filter(
    (a) => !["rejected", "withdrawn"].includes(a.stage)
  );

  const deadlineIn7 = activeApps.filter(
    (a) => a.deadline && a.deadline >= todayStr && a.deadline <= in7
  ).length;
  const deadlineIn14 = activeApps.filter(
    (a) => a.deadline && a.deadline >= todayStr && a.deadline <= in14
  ).length;
  const deadlineIn30 = activeApps.filter(
    (a) => a.deadline && a.deadline >= todayStr && a.deadline <= in30
  ).length;

  const urgentCount = activeApps.filter(
    (a) =>
      a.isUrgent ||
      (a.deadline && a.deadline >= todayStr && a.deadline <= in14)
  ).length;

  // Outreach response rate
  const allOutreach = await db.select().from(outreachTable);
  const outreachResponseRate =
    allOutreach.length > 0
      ? allOutreach.filter((o) => o.responseReceived).length / allOutreach.length
      : 0;

  // Document completion rate
  const allDocs = await db.select().from(documentsTable);
  const requiredDocs = allDocs.filter((d) => d.isRequired);
  const documentCompletionRate =
    requiredDocs.length > 0
      ? requiredDocs.filter((d) => d.isUploaded && d.isVerified).length / requiredDocs.length
      : 0;

  const conversionRates = {
    sourcedToApplied: sourced > 0 ? applied / sourced : 0,
    appliedToInterview: applied > 0 ? interviewed / applied : 0,
    interviewToOffer: interviewed > 0 ? offered / interviewed : 0,
    offerToAccepted: 0,
  };

  res.json({
    totalApplications: total,
    byStage,
    conversionRates,
    urgentCount,
    deadlineIn7Days: deadlineIn7,
    deadlineIn14Days: deadlineIn14,
    deadlineIn30Days: deadlineIn30,
    outreachResponseRate,
    documentCompletionRate,
    interviewCount: interviewed,
    offerCount: offered,
    acceptedCount: 0,
    rejectedCount: rejected,
  });
});

router.get("/analytics/by-country", async (req, res): Promise<void> => {
  const applications = await db.select().from(applicationsTable);

  const map: Record<string, { count: number; applied: number; interviews: number; offers: number }> = {};

  for (const app of applications) {
    if (!map[app.country]) {
      map[app.country] = { count: 0, applied: 0, interviews: 0, offers: 0 };
    }
    map[app.country].count++;
    if (["applied", "interview_scheduled", "offer_received"].includes(app.stage)) {
      map[app.country].applied++;
    }
    if (["interview_scheduled", "offer_received"].includes(app.stage)) {
      map[app.country].interviews++;
    }
    if (app.stage === "offer_received") {
      map[app.country].offers++;
    }
  }

  const result = Object.entries(map)
    .map(([country, stats]) => ({ country, ...stats }))
    .sort((a, b) => b.count - a.count);

  res.json(result);
});

router.get("/analytics/by-stage", async (req, res): Promise<void> => {
  const applications = await db.select().from(applicationsTable);

  const stageOrder = [
    "sourced", "interested", "applied",
    "interview_scheduled", "offer_received",
    "rejected", "withdrawn",
  ];

  const map: Record<string, number> = {};
  for (const app of applications) {
    map[app.stage] = (map[app.stage] ?? 0) + 1;
  }

  const result = stageOrder
    .filter((stage) => map[stage] !== undefined)
    .map((stage) => ({ stage, count: map[stage] }));

  res.json(result);
});

router.get("/analytics/upcoming-deadlines", async (req, res): Promise<void> => {
  const todayStr = today();
  const in30 = addDays(30);

  const applications = await db.select().from(applicationsTable);

  const result = applications
    .filter(
      (a) =>
        a.deadline &&
        a.deadline >= todayStr &&
        a.deadline <= in30 &&
        !["rejected", "withdrawn"].includes(a.stage)
    )
    .sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });

  res.json(result);
});

export default router;
