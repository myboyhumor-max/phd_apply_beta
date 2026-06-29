import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, documentsTable } from "@workspace/db";
import {
  ListDocumentsParams,
  CreateDocumentParams,
  CreateDocumentBody,
  UpdateDocumentParams,
  UpdateDocumentBody,
  DeleteDocumentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get(
  "/applications/:applicationId/documents",
  async (req, res): Promise<void> => {
    const params = ListDocumentsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const docs = await db
      .select()
      .from(documentsTable)
      .where(eq(documentsTable.applicationId, params.data.applicationId))
      .orderBy(documentsTable.docType);

    res.json(docs);
  }
);

router.post(
  "/applications/:applicationId/documents",
  async (req, res): Promise<void> => {
    const params = CreateDocumentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = CreateDocumentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [doc] = await db
      .insert(documentsTable)
      .values({
        ...parsed.data,
        applicationId: params.data.applicationId,
      })
      .returning();

    res.status(201).json(doc);
  }
);

router.patch(
  "/applications/:applicationId/documents/:id",
  async (req, res): Promise<void> => {
    const params = UpdateDocumentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = UpdateDocumentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [doc] = await db
      .update(documentsTable)
      .set(parsed.data)
      .where(
        and(
          eq(documentsTable.id, params.data.id),
          eq(documentsTable.applicationId, params.data.applicationId)
        )
      )
      .returning();

    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.json(doc);
  }
);

router.delete(
  "/applications/:applicationId/documents/:id",
  async (req, res): Promise<void> => {
    const params = DeleteDocumentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [doc] = await db
      .delete(documentsTable)
      .where(
        and(
          eq(documentsTable.id, params.data.id),
          eq(documentsTable.applicationId, params.data.applicationId)
        )
      )
      .returning();

    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    res.sendStatus(204);
  }
);

export default router;
