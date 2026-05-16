import prisma from "../../config/prisma.js";

const createBooking = async (tenantId, payload) => {
  const house = await prisma.house.findFirst({
    where: {
      id: payload.houseId,
      status: "APPROVED",
      isPublished: true
    },
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
  });

  if (!house) {
    throw new Error("House not found or not available for booking");
  }

  if (!house.landlord.isActive || !house.landlord.isApproved) {
    throw new Error("Landlord is not active or approved");
  }

  if (house.landlordId === tenantId) {
    throw new Error("You cannot book your own house");
  }

  const existingPendingBooking = await prisma.booking.findFirst({
    where: {
      tenantId,
      houseId: payload.houseId,
      status: "PENDING",
    },
  });

  if (existingPendingBooking) {
    throw new Error("You already have a pending booking request for this house");
  }

  const booking = await prisma.booking.create({
    data: {
      tenantId,
      houseId: payload.houseId,
      landlordId: house.landlordId,
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
      house: {
        select: {
          id: true,
          title: true,
          address: true,
          area: true,
          rentAmount: true,
          status: true,
          isPublished: true,
        },
      },
    },
  });

  return booking;
};

const getMyBookings = async (tenantId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      tenantId,
    },
    include: {
      house: {
        select: {
          id: true,
          title: true,
          address: true,
          area: true,
          rentAmount: true,
          bedrooms: true,
          bathrooms: true,
          status: true,
          isPublished: true
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const getLandlordBookings = async (landlordId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      landlordId,
    },
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
      house: {
        select: {
          id: true,
          title: true,
          address: true,
          area: true,
          rentAmount: true,
          status: true,
          isPublished: true
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const reviewBooking = async (bookingId, landlordId, payload) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      landlordId,
    },
    include: {
      house: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.status !== "PENDING") {
    throw new Error("Only pending bookings can be reviewed");
  }

  if (payload.status === "REJECTED" && !payload.rejectionReason?.trim()) {
    throw new Error("Rejection reason is required when rejecting a booking");
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: payload.status,
      rejectionReason:
        payload.status === "REJECTED"
          ? payload.rejectionReason?.trim() || null
          : null,
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
      house: {
        select: {
          id: true,
          title: true,
          address: true,
          area: true,
          rentAmount: true,
        },
      },
    },
  });

  return updatedBooking;
};

export default {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  reviewBooking,
};