import express from "express";
import rentalUnitController from "./rentalUnit.controller.js";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";

const router = express.Router();

router.get(
  "/my-units",
  auth,
  role("LANDLORD"),
  rentalUnitController.getMyRentalUnits
);

router.get(
  "/house/:houseId",
  auth,
  role("LANDLORD", "ADMIN", "SUPER_ADMIN"),
  rentalUnitController.getRentalUnitsByHouse
);

router.get(
  "/pending",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  rentalUnitController.getPendingRentalUnits
);

router.post(
  "/house/:houseId",
  auth,
  role("LANDLORD"),
  rentalUnitController.createRentalUnit
);

router.patch(
  "/:id",
  auth,
  role("LANDLORD"),
  rentalUnitController.updateRentalUnit
);

router.delete(
  "/:id",
  auth,
  role("LANDLORD"),
  rentalUnitController.deleteRentalUnit
);

router.patch(
  "/:id/approve",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  rentalUnitController.approveRentalUnit
);

router.patch(
  "/:id/reject",
  auth,
  role("ADMIN", "SUPER_ADMIN"),
  rentalUnitController.rejectRentalUnit
);

export default router;