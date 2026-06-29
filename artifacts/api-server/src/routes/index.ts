import { Router, type IRouter } from "express";
import healthRouter from "./health";
import applicationsRouter from "./applications";
import documentsRouter from "./documents";
import outreachRouter from "./outreach";
import remindersRouter from "./reminders";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(applicationsRouter);
router.use(documentsRouter);
router.use(outreachRouter);
router.use(remindersRouter);
router.use(analyticsRouter);

export default router;
