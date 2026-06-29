import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, remindersTable } from "@workspace/db";
import {
  ListRemindersQueryParams,
  CreateReminderBody,
  UpdateReminderParams,
  UpdateReminderBody,
  DeleteReminderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reminders", async (req, res): Promise<void> => {
  const params = ListRemindersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(remindersTable).$dynamic();

  const conditions = [];
  if (params.data.applicationId) {
    conditions.push(eq(remindersTable.applicationId, params.data.applicationId));
  }
  if (params.data.status) {
    conditions.push(eq(remindersTable.status, params.data.status));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const reminders = await query.orderBy(remindersTable.dueDate);
  res.json(reminders);
});

router.post("/reminders", async (req, res): Promise<void> => {
  const parsed = CreateReminderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [reminder] = await db
    .insert(remindersTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(reminder);
});

router.patch("/reminders/:id", async (req, res): Promise<void> => {
  const params = UpdateReminderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateReminderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [reminder] = await db
    .update(remindersTable)
    .set(parsed.data)
    .where(eq(remindersTable.id, params.data.id))
    .returning();

  if (!reminder) {
    res.status(404).json({ error: "Reminder not found" });
    return;
  }

  res.json(reminder);
});

router.delete("/reminders/:id", async (req, res): Promise<void> => {
  const params = DeleteReminderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [reminder] = await db
    .delete(remindersTable)
    .where(eq(remindersTable.id, params.data.id))
    .returning();

  if (!reminder) {
    res.status(404).json({ error: "Reminder not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
