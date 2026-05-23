import prisma from "../../config/prisma.js";

const createBooking = async (tenantId, payload) => {
  const rentalUnit = await prisma.rentalUnit.findFirst({
    where: {
      id: payload.rentalUnitId,
      status: "APPROVED",
      isPublished: true,
      isAvailable: true,
    },
    include: {
      house: {
        include: {
          landlord: {
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true,
              role: true,
              isActive: true,
              isApproved: true,
            },
          },
        },
      },
    },
  });

  if (!rentalUnit) {
    throw new Error("Rental unit not found or not available for booking");
  }

  if (!rentalUnit.house.landlord.isActive || !rentalUnit.house.landlord.isApproved) {
    throw new Error("Landlord is not active or approved");
  }

  if (rentalUnit.house.landlordId === tenantId) {
    throw new Error("You cannot book your own rental unit");
  }

  const existingPendingBooking = await prisma.booking.findFirst({
    where: {
      tenantId,
      rentalUnitId: payload.rentalUnitId,
      status: "PENDING",
    },
  });

  if (existingPendingBooking) {
    throw new Error("You already have a pending booking request for this unit");
  }

  const booking = await prisma.booking.create({
    data: {
      tenantId,
      rentalUnitId: payload.rentalUnitId,
      landlordId: rentalUnit.house.landlordId,
      message: payload.message || null,
      moveInDate: payload.moveInDate ? new Date(payload.moveInDate) : null,
    },
    include: {
      tenant: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
      landlord: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
      rentalUnit: {
        select: {
          id: true,
          title: true,
          rentAmount: true,
          bedrooms: true,
          bathrooms: true,
          floorNo: true,
          house: {
            select: {
              id: true,
              title: true,
              address: true,
              area: true,
            },
          },
        },
      },
    },
  });

  return booking;
};

const getMyBookings = async (tenantId) => {
  return await prisma.booking.findMany({
    where: { tenantId },
    include: {
      rentalUnit: {
        select: {
          id: true,
          title: true,
          rentAmount: true,
          bedrooms: true,
          bathrooms: true,
          floorNo: true,
          house: {
            select: {
              id: true,
              title: true,
              address: true,
              area: true,
            },
          },
        },
      },
      landlord: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getLandlordBookings = async (landlordId) => {
  return await prisma.booking.findMany({
    where: { landlordId },
    include: {
      tenant: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
          isActive: true,
          isApproved: true,
        },
      },
      rentalUnit: {
        select: {
          id: true,
          title: true,
          rentAmount: true,
          bedrooms: true,
          bathrooms: true,
          floorNo: true,
          house: {
            select: {
              id: true,
              title: true,
              address: true,
              area: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const reviewBooking = async (bookingId, landlordId, payload) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, landlordId },
    include: { rentalUnit: true },
  });

  if (!booking) throw new Error("Booking not found");
  if (booking.status !== "PENDING") throw new Error("Only pending bookings can be reviewed");

  if (payload.status === "REJECTED" && !payload.rejectionReason?.trim()) {
    throw new Error("Rejection reason is required when rejecting a booking");
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: payload.status,
      rejectionReason: payload.status === "REJECTED" ? payload.rejectionReason?.trim() || null : null,
      landlordNote: payload.landlordNote?.trim() || null,
    },
    include: {
      tenant: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
      landlord: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
      rentalUnit: {
        select: {
          id: true,
          title: true,
          rentAmount: true,
          house: {
            select: {
              id: true,
              title: true,
              address: true,
              area: true,
            },
          },
        },
      },
    },
  });
};

export default {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  reviewBooking,
};