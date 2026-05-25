import express from "express";
import houseController from "./house.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  auth,
  role("LANDLORD", "ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  houseController.createHouse
);

router.get("/my-houses", auth, role("LANDLORD", "ADMIN", "SUPER_ADMIN"), houseController.getMyHouses);
router.get("/deleted-houses", auth, role("SUPER_ADMIN"), houseController.getDeletedHouses);
router.get("/restore-requests", auth, role("SUPER_ADMIN"), houseController.getRestoreRequests);
router.get("/admin-summary", auth, role("ADMIN", "SUPER_ADMIN"), houseController.getHouseAdminSummary);
router.get("/", houseController.getAllApprovedHouses);
router.get("/:id", houseController.getSingleApprovedHouse);
router.patch("/:id/approve", auth, role("ADMIN", "SUPER_ADMIN"), houseController.approveHouse);
router.patch("/:id/reject", auth, role("ADMIN", "SUPER_ADMIN"), houseController.rejectHouse);
router.patch("/:id/delete", auth, role("LANDLORD", "ADMIN", "SUPER_ADMIN"), houseController.softDeleteHouse);
router.patch("/:id/request-restore", auth, role("LANDLORD"), houseController.requestRestoreHouse);
router.patch("/:id/review-restore", auth, role("SUPER_ADMIN"), houseController.reviewRestoreRequest);
router.delete("/:id/permanent-delete", auth, role("SUPER_ADMIN"), houseController.permanentDeleteHouse);

export default router;