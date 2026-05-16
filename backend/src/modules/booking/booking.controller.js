import bookingService from "./booking.service.js";
import {
  createBookingSchema,
  reviewBookingSchema,
} from "./booking.validation.js";

const createBooking = async (req, res) => {
  try {
    const validatedData = createBookingSchema.parse(req.body);

    const booking = await bookingService.createBooking(
      req.user.userId,
      validatedData
    );

    return res.status(201).json({
      success: true,
      message: "Booking request created successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create booking request",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getMyBookings(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "My bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch my bookings",
    });
  }
};

const getLandlordBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getLandlordBookings(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Landlord bookings fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch landlord bookings",
    });
  }
};

const reviewBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);

    if (Number.isNaN(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking id",
      });
    }

    const validatedData = reviewBookingSchema.parse(req.body);

    const booking = await bookingService.reviewBooking(
      bookingId,
      req.user.userId,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: `Booking ${validatedData.status.toLowerCase()} successfully`,
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to review booking",
    });
  }
};

export default {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  reviewBooking,
};