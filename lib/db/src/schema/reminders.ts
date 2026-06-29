import { pgTable, serial, integer, text, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { applicationsTable } from "./applications";
import { outreachTable } from "./outreach";

export const remindersTable = pgTable("reminders", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(() => applicationsTable.id, { onDelete: "cascade" }),
  outreachId: integer("outreach_id").references(() => outreachTable.id, { onDelete: "set null" }),
  reminderType: text("reminder_type").notNull(),
  dueDate: date("due_date", { mode: "string" }).notNull(),
  priority: text("priority").default("medium"),
  deliveryChannel: text("delivery_channel").default("in_app"),
  status: text("status").notNull().default("pending"),
  isSnoozed: boolean("is_snoozed").notNull().default(false),
  isCompleted: boolean("is_completed").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertReminderSchema = createInsertSchema(remindersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof remindersTable.$inferSelect;
