import { z } from "zod";

export const createReportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["ROAD", "ELECTRICITY", "WATER", "GAS", "SECURITY", "SANITATION", "OTHER"]),
  location: z.string().min(3),
  affectedHouseIds: z.array(z.number()).optional().default([]),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]),
  adminNote: z.string().optional().nullable(),
});