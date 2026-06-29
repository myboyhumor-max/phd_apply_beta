import { pgTable, serial, integer, text, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { applicationsTable } from "./applications";

export const outreachTable = pgTable("outreach", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id, { onDelete: "set null" }),
  professorName: text("professor_name").notNull(),
  institution: text("institution"),
  email: text("email"),
  dateContacted: date("date_contacted", { mode: "string" }),
  subjectLine: text("subject_line"),
  messageSummary: text("message_summary"),
  threadStatus: text("thread_status").default("pending"),
  followUpCount: integer("follow_up_count").default(0),
  lastFollowUpDate: date("last_follow_up_date", { mode: "string" }),
  nextFollowUpDate: date("next_follow_up_date", { mode: "string" }),
  responseReceived: boolean("response_received").notNull().default(false),
  responseSummary: text("response_summary"),
  outcome: text("outcome"),
  toneQuality: text("tone_quality"),
  attachmentsSent: text("attachments_sent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOutreachSchema = createInsertSchema(outreachTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOutreach = z.infer<typeof insertOutreachSchema>;
export type Outreach = typeof outreachTable.$inferSelect;
