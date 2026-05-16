import prisma from "../../config/prisma.js";

const createRentalApplication = async (user, payload, files) => {
  if (!user || user.role !== "TENANT") {
    const error = new Error("Only tenants can create rental applications");
    error.statusCode = 403;
    throw error;
  }

  const bookingId = Number(payload.bookingId);

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tenantId: user.userId,
      status: "APPROVED",
    },
  });

  if (!booking) {
    const error = new Error("Approved booking not found for this tenant");
    error.statusCode = 404;
    throw error;
  }

  const existingApplication = await prisma.rentalApplication.findUnique({
    where: {
      bookingId,
    },
  });

  if (existingApplication) {
    const error = new Error(
      "Rental application already exists for this booking"
    );
    error.statusCode = 409;
    throw error;
  }

  const nidDocumentFile = files?.nidDocument?.[0];
  const photoFile = files?.photo?.[0];
  const additionalDocumentFile = files?.additionalDocument?.[0];

  if (!nidDocumentFile) {
    const error = new Error("nidDocument file is required");
    error.statusCode = 400;
    throw error;
  }

  if (!photoFile) {
    const error = new Error("photo file is required");
    error.statusCode = 400;
    throw error;
  }

  const application = await prisma.rentalApplication.create({
    data: {
      tenantId: user.userId,
      bookingId,
      nidDocument: nidDocumentFile.path.replace(/\\/g, "/"),
      photo: photoFile.path.replace(/\\/g, "/"),
      additionalDocument: additionalDocumentFile
        ? additionalDocumentFile.path.replace(/\\/g, "/")
        : null,
      notes: payload.notes || null,
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
      booking: {
        include: {
          house: {
            select: {
              id: true,
              title: true,
              address: true,
              area: true,
              rentAmount: true,
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
      },
    },
  });

  return application;
};

const getMyApplications = async (user) => {
  if (!user || user.role !== "TENANT") {
    const error = new Error("Only tenants can view their rental applications");
    error.statusCode = 403;
    throw error;
  }

  const applications = await prisma.rentalApplication.findMany({
    where: {
      tenantId: user.userId,
    },
    include: {
      booking: {
        include: {
          house: {
            select: {
              id: true,
              title: true,
              address: true,
              area: true,
              rentAmount: true,
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
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return applications;
};

export default {
  createRentalApplication,
  getMyApplications,
};