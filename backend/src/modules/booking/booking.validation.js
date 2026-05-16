import { z } from "zod";

export const createBookingSchema = z.object({
  houseId: z
    .number({
      required_error: "House id is required",
      invalid_type_error: "House id must be a number",
    })
    .int("House id must be an integer")
    .positive("House id must be a positive number"),

  message: z
    .string()
    .trim()
    .max(500, "Message cannot be more than 500 characters")
    .optional(),

  moveInDate: z
    .string()
    .datetime("Move-in date must be a valid ISO date")
    .optional(),
});

export const reviewBookingSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be APPROVED or REJECTED",
  }),

  rejectionReason: z
    .string()
    .trim()
    .max(300, "Rejection reason cannot be more than 300 characters")
    .optional(),

  landlordNote: z
    .string()
    .trim()
    .max(500, "Landlord note cannot be more than 500 characters")
    .optional(),
});