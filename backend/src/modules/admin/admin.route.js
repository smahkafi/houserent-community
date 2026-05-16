import express from "express";
import prisma from "../../config/prisma.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import validateUserId from "../../middlewares/validateUserId.middleware.js";

const router = express.Router();

// Get all users
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
      const { role, isApproved, isActive, search } = req.query;

      const where = {};

      if (role) where.role = role;

      if (isApproved === "true") where.isApproved = true;
      else if (isApproved === "false") where.isApproved = false;

      if (isActive === "true") where.isActive = true;
      else if (isActive === "false") where.isActive = false;

      if (search) {
        where.OR = [
          { fullName: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
        ];
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { id: "desc" },
      });

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
      });
    }
  }
);

// Pending users
router.get(
  "/users/pending",
  authMiddleware,
  roleMiddleware("ADMIN"),
  async (req, res) => {
    try {
      const { search } = req.query;

      const where = { isApproved: false };

      if (search) {
        where.OR = [
          { fullName: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
        ];
      }

      const users = await prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { id: "desc" },
      });

      return res.status(200).json({
        success: true,
        message: "Pending users fetched successfully",
        data: users,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch pending users",
      });
    }
  }
);

// Single user
router.get(
  "/users/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateUserId,
  async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
      });
    }
  }
);

// Approve
router.patch(
  "/users/:id/approve",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateUserId,
  async (req, res) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: { isApproved: true, isActive: true },
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "User approved successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to approve user",
      });
    }
  }
);

// Reject
router.patch(
  "/users/:id/reject",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateUserId,
  async (req, res) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: { isApproved: false, isActive: false },
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "User rejected successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to reject user",
      });
    }
  }
);

// Toggle active
router.patch(
  "/users/:id/toggle-active",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateUserId,
  async (req, res) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: req.userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: req.userId },
        data: { isActive: !existingUser.isActive },
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          isApproved: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: existingUser.isActive
          ? "User deactivated successfully"
          : "User activated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to toggle user",
      });
    }
  }
);

export default router;