import express from "express";
import communityReportController from "./communityReport.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  auth,
  role("RESIDENT"),
  communityReportController.createReport
);

router.get(
  "/my-reports",
  auth,
  role("RESIDENT"),
  communityReportController.getMyReports
);

router.get(
  "/all",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  communityReportController.getAllReports
);

router.patch(
  "/:id/status",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  communityReportController.updateReportStatus
);

export default router;