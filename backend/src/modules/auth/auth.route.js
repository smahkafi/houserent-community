import express from "express";
import { authController } from "./auth.controller.js";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/social-login", authController.socialLoginUser);

export default router;