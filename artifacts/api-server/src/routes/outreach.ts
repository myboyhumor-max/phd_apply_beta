import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, outreachTable } from "@workspace/db";
import {
  ListOutreachQueryParams,
  CreateOutreachBody,
  GetOutreachParams,
  UpdateOutreachParams,
  UpdateOutreachBody,
  DeleteOutreachParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/outreach", async (req, res): Promise<void> => {
  const params = ListOutreachQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(outreachTable).$dynamic();

  if (params.data.applicationId) {
    query = query.where(
      eq(outreachTable.applicationId, params.data.applicationId)
    );
  }

  const entries = await query.orderBy(outreachTable.createdAt);
  res.json(entries);
});

router.post("/outreach", async (req, res): Promise<void> => {
  const parsed = CreateOutreachBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db
    .insert(outreachTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(entry);
});

router.get("/outreach/:id", async (req, res): Promise<void> => {
  const params = GetOutreachParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [entry] = await db
    .select()
    .from(outreachTable)
    .where(eq(outreachTable.id, params.data.id));

  if (!entry) {
    res.status(404).json({ error: "Outreach entry not found" });
    return;
  }

  res.json(entry);
});

router.patch("/outreach/:id", async (req, res): Promise<void> => {
  const params = UpdateOutreachParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOutreachBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db
    .update(outreachTable)
    .set(parsed.data)
    .where(eq(outreachTable.id, params.data.id))
    .returning();

  if (!entry) {
    res.status(404).json({ error: "Outreach entry not found" });
    return;
  }

  res.json(entry);
});

router.delete("/outreach/:id", async (req, res): Promise<void> => {
  const params = DeleteOutreachParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [entry] = await db
    .delete(outreachTable)
    .where(eq(outreachTable.id, params.data.id))
    .returning();

  if (!entry) {
    res.status(404).json({ error: "Outreach entry not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
