import { z } from "zod";

export const createHouseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  houseNo: z.string().min(1),
  plotNo: z.string().optional().nullable(),
  roadNo: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  area: z.string().min(2),
  mapLocation: z.string().min(3),
  unionName: z.string().optional().nullable(),
  totalFloors: z.number().int().min(1).optional().nullable(),
});

export const updateHouseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  houseNo: z.string().min(1).optional(),
  plotNo: z.string().optional().nullable(),
  roadNo: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  area: z.string().min(2).optional(),
  mapLocation: z.string().min(3).optional(),
  unionName: z.string().optional().nullable(),
  totalFloors: z.number().int().min(1).optional().nullable(),
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