import { z } from "zod";

export const createHouseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  address: z.string().min(3),
  area: z.string().min(2),
  rentAmount: z.number().positive(),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().int().min(1),
  attachedBathrooms: z.number().int().min(0).optional().nullable(),
  commonBathrooms: z.number().int().min(0).optional().nullable(),
  balconies: z.number().int().min(0).optional().nullable(),
  floorNo: z.number().int().min(0).optional().nullable(),
  totalFloors: z.number().int().min(1).optional().nullable(),
  sizeInSqft: z.number().positive().optional().nullable(),
  availableFrom: z.string().optional().nullable(),
});

export const updateHouseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  address: z.string().min(3).optional(),
  area: z.string().min(2).optional(),
  rentAmount: z.number().positive().optional(),
  bedrooms: z.number().int().min(1).optional(),
  bathrooms: z.number().int().min(1).optional(),
  attachedBathrooms: z.number().int().min(0).optional().nullable(),
  commonBathrooms: z.number().int().min(0).optional().nullable(),
  balconies: z.number().int().min(0).optional().nullable(),
  floorNo: z.number().int().min(0).optional().nullable(),
  totalFloors: z.number().int().min(1).optional().nullable(),
  sizeInSqft: z.number().positive().optional().nullable(),
  availableFrom: z.string().optional().nullable(),
});

export const rejectHouseSchema = z.object({
  rejectionReason: z.string().min(3),
});

export const softDeleteHouseSchema = z.object({
  deleteReason: z.string().min(3),
});

export const restoreRequestSchema = z.object({
  restoreReason: z.string().min(3),
});

export const reviewRestoreSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  note: z.string().min(2),
});

export const permanentDeleteHouseSchema = z.object({
  confirm: z.literal("DELETE"),
  reason: z.string().min(3),
});