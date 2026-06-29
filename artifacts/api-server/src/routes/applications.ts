import { Router, type IRouter } from "express";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { db, applicationsTable } from "@workspace/db";
import {
  ListApplicationsQueryParams,
  CreateApplicationBody,
  GetApplicationParams,
  UpdateApplicationParams,
  UpdateApplicationBody,
  DeleteApplicationParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/applications", async (req, res): Promise<void> => {
  const params = ListApplicationsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(applicationsTable).$dynamic();

  const conditions = [];
  if (params.data.stage) {
    conditions.push(eq(applicationsTable.stage, params.data.stage));
  }
  if (params.data.country) {
    conditions.push(eq(applicationsTable.country, params.data.country));
  }
  if (params.data.field) {
    conditions.push(eq(applicationsTable.fieldArea, params.data.field));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const today = new Date().toISOString().split("T")[0];
  const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const applications = await query.orderBy(applicationsTable.createdAt);

  const result = applications.map((app) => ({
    ...app,
    isUrgent:
      app.isUrgent ||
      (app.deadline != null && app.deadline >= today && app.deadline <= in14Days),
  }));

  res.json(result);
});

router.post("/applications", async (req, res): Promise<void> => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const isUrgent =
    parsed.data.deadline != null &&
    parsed.data.deadline >= today &&
    parsed.data.deadline <= in14Days;

  const [app] = await db
    .insert(applicationsTable)
    .values({
      ...parsed.data,
      stage: parsed.data.stage ?? "sourced",
      isUrgent,
    })
    .returning();

  res.status(201).json(app);
});

router.get("/applications/:id", async (req, res): Promise<void> => {
  const params = GetApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [app] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, params.data.id));

  if (!app) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(app);
});

router.patch("/applications/:id", async (req, res): Promise<void> => {
  const params = UpdateApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const in14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const updateData: Record<string, unknown> = { ...parsed.data };

  if (parsed.data.deadline !== undefined) {
    updateData.isUrgent =
      parsed.data.deadline != null &&
      parsed.data.deadline >= today &&
      parsed.data.deadline <= in14Days;
  }

  if (parsed.data.isUrgent !== undefined) {
    updateData.isUrgent = parsed.data.isUrgent;
  }

  const [app] = await db
    .update(applicationsTable)
    .set(updateData)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!app) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(app);
});

router.delete("/applications/:id", async (req, res): Promise<void> => {
  const params = DeleteApplicationParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [app] = await db
    .delete(applicationsTable)
    .where(eq(applicationsTable.id, params.data.id))
    .returning();

  if (!app) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
