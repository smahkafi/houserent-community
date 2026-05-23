import { z } from "zod";

export const createRentalUnitSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  rentAmount: z.number().positive(),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().int().min(1),
  attachedBathrooms: z.number().int().min(0).optional().nullable(),
  commonBathrooms: z.number().int().min(0).optional().nullable(),
  balconies: z.number().int().min(0).optional().nullable(),
  floorNo: z.number().int().min(0).optional().nullable(),
  sizeInSqft: z.number().positive().optional().nullable(),
  availableFrom: z.string().optional().nullable(),
});

export const updateRentalUnitSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  rentAmount: z.number().positive().optional(),
  bedrooms: z.number().int().min(1).optional(),
  bathrooms: z.number().int().min(1).optional(),
  attachedBathrooms: z.number().int().min(0).optional().nullable(),
  commonBathrooms: z.number().int().min(0).optional().nullable(),
  balconies: z.number().int().min(0).optional().nullable(),
  floorNo: z.number().int().min(0).optional().nullable(),
  sizeInSqft: z.number().positive().optional().nullable(),
  availableFrom: z.string().optional().nullable(),
});

export const rejectRentalUnitSchema = z.object({
  rejectionReason: z.string().min(3),
});