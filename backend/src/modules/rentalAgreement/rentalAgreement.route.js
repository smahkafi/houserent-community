import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import {
  createRentalAgreementController,
  getMyRentalAgreementsController,
  getRentalAgreementDetailsController,
  downloadRentalAgreementPdfController,
} from "./rentalAgreement.controller.js";

const router = express.Router();

/**
 * Create agreement
 * Protected
 */
router.post("/", authMiddleware, createRentalAgreementController);

/**
 * My agreements
 * TENANT token => agreements where tenantId = req.user.userId
 * LANDLORD token => agreements where landlordId = req.user.userId
 * ADMIN / SUPER_ADMIN => all agreements
 */
router.get("/my", authMiddleware, getMyRentalAgreementsController);

/**
 * Agreement details
 * Only related tenant / landlord / admin / super admin
 */
router.get("/:id", authMiddleware, getRentalAgreementDetailsController);

/**
 * Agreement PDF download
 * Only related tenant / landlord / admin / super admin
 */
router.get(
  "/:id/download",
  authMiddleware,
  downloadRentalAgreementPdfController
);

export default router;