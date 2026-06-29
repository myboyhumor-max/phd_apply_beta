import { pgTable, serial, text, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  university: text("university").notNull(),
  country: text("country").notNull(),
  program: text("program"),
  department: text("department"),
  projectTitle: text("project_title"),
  supervisorName: text("supervisor_name"),
  fundingSource: text("funding_source"),
  portalLink: text("portal_link"),
  fieldArea: text("field_area"),
  stage: text("stage").notNull().default("sourced"),
  dateSourced: date("date_sourced", { mode: "string" }),
  deadline: date("deadline", { mode: "string" }),
  dateApplied: date("date_applied", { mode: "string" }),
  interviewDate: date("interview_date", { mode: "string" }),
  outcomeDate: date("outcome_date", { mode: "string" }),
  offerStatus: text("offer_status"),
  notes: text("notes"),
  priorityScore: integer("priority_score"),
  fitScore: integer("fit_score"),
  statusReason: text("status_reason"),
  nextAction: text("next_action"),
  nextActionDate: date("next_action_date", { mode: "string" }),
  researchFitReason: text("research_fit_reason"),
  supervisorFitReason: text("supervisor_fit_reason"),
  papersToRead: text("papers_to_read"),
  skillsMatch: text("skills_match"),
  missingRequirements: text("missing_requirements"),
  risks: text("risks"),
  outreachAngle: text("outreach_angle"),
  isUrgent: boolean("is_urgent").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
