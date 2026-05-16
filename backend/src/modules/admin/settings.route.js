import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import {
  getSettings,
  updateSettings,
} from "./settings.controller.js";

const router = express.Router();

// GET Settings
router.get(
  "/settings",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  getSettings
);

// UPDATE Settings
router.patch(
  "/settings",
  authMiddleware,
  roleMiddleware("SUPER_ADMIN"),
  updateSettings
);

export default router;