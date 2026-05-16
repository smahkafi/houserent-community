import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import rentalApplicationUpload from "../../middlewares/rentalApplicationUpload.middleware.js";
import rentalApplicationController from "./rentalApplication.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    rentalApplicationUpload(req, res, function (error) {
      if (error) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size must be less than or equal to 500KB",
          });
        }

        return res.status(400).json({
          success: false,
          message: error.message || "File upload failed",
        });
      }

      next();
    });
  },
  rentalApplicationController.createRentalApplication
);

router.get(
  "/my-applications",
  authMiddleware,
  rentalApplicationController.getMyApplications
);

export default router;