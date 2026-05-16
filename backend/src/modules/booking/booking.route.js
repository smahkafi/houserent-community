import express from "express";
import auth from "../../middlewares/auth.middleware.js";
import role from "../../middlewares/role.middleware.js";
import bookingController from "./booking.controller.js";

const router = express.Router();

router.post(
  "/",
  auth,
  role("TENANT"),
  bookingController.createBooking
);

router.get(
  "/my-bookings",
  auth,
  role("TENANT"),
  bookingController.getMyBookings
);

router.get(
  "/landlord",
  auth,
  role("LANDLORD"),
  bookingController.getLandlordBookings
);

router.patch(
  "/:id/review",
  auth,
  role("LANDLORD"),
  bookingController.reviewBooking
);

export default router;