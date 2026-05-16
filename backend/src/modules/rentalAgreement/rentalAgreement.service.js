import prisma from "../../config/prisma.js";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

import {
  buildSinglePageAgreementHtml,
  buildStamp3PageAgreementHtml,
} from "./templates/rentalAgreementPdf.template.js";

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureUploadsDirectoryExists = () => {
  const uploadDir = path.join(process.cwd(), "uploads", "rental-agreements");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return uploadDir;
};

const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isApproved: user.isApproved,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const normalizeFormat = (format) => {
  if (format === "stamp3") return "stamp3";
  return "single";
};

const getAgreementFileName = (agreementId, format) => {
  if (format === "stamp3") {
    return `rental-agreement-${agreementId}-STAMP_3_PAGE.pdf`;
  }

  return `rental-agreement-${agreementId}-single-page.pdf`;
};

const getSettings = async () => {
  const settings = await prisma.appSetting.findFirst();

  return {
    showFooter: settings?.agreementFooterEnabled ?? true,
  };
};

const createPdfFile = async (html, filePath) => {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });
  } finally {
    await browser.close();
  }
};

const getBookingForAgreement = async (bookingId) => {
  const numericBookingId = Number(bookingId);

  if (Number.isNaN(numericBookingId)) {
    throw createAppError("Invalid booking id", 400);
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id: numericBookingId,
    },
    include: {
      tenant: true,
      landlord: true,
      house: {
        include: {
          landlord: true,
        },
      },
    },
  });

  if (!booking) {
    throw createAppError("Booking not found", 404);
  }

  if (booking.status !== "APPROVED") {
    throw createAppError(
      "Only approved bookings can generate rental agreement",
      400
    );
  }

  return {
    ...booking,
    tenant: sanitizeUser(booking.tenant),
    landlord: sanitizeUser(booking.landlord),
    house: {
      ...booking.house,
      landlord: sanitizeUser(booking.house?.landlord),
    },
  };
};

const canAccessAgreement = (agreement, user) => {
  if (!user || !user.userId || !user.role) {
    return false;
  }

  if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
    return true;
  }

  if (user.role === "TENANT" && agreement.booking?.tenantId === user.userId) {
    return true;
  }

  if (
    user.role === "LANDLORD" &&
    agreement.booking?.landlordId === user.userId
  ) {
    return true;
  }

  return false;
};

const sanitizeAgreementResponse = (agreement) => {
  return {
    ...agreement,
    booking: {
      ...agreement.booking,
      tenant: sanitizeUser(agreement.booking?.tenant),
      landlord: sanitizeUser(agreement.booking?.landlord),
      house: agreement.booking?.house,
    },
  };
};

const generateAgreementPdfByFormat = async (agreement, format) => {
  const normalizedFormat = normalizeFormat(format);

  const uploadDir = ensureUploadsDirectoryExists();

  const booking = await getBookingForAgreement(agreement.bookingId);

  const settings = await getSettings();

  const html =
    normalizedFormat === "stamp3"
      ? buildStamp3PageAgreementHtml(booking, settings, agreement)
      : buildSinglePageAgreementHtml(booking, settings, agreement);

  const fileName = getAgreementFileName(agreement.id, normalizedFormat);

  const filePath = path.join(uploadDir, fileName);

  await createPdfFile(html, filePath);

  return {
    fileName,
    filePath,
    pdfUrl: `/uploads/rental-agreements/${fileName}`,
  };
};

const createRentalAgreement = async (payload) => {
  const bookingId = Number(payload?.bookingId);

  if (Number.isNaN(bookingId)) {
    throw createAppError("Invalid booking id", 400);
  }

  const existingAgreement = await prisma.rentalAgreement.findFirst({
    where: {
      bookingId,
    },
    include: {
      booking: {
        include: {
          tenant: true,
          landlord: true,
          house: true,
        },
      },
    },
  });

  if (existingAgreement) {
    return sanitizeAgreementResponse(existingAgreement);
  }

  await getBookingForAgreement(bookingId);

  const agreement = await prisma.rentalAgreement.create({
    data: {
      bookingId,
      pdfUrl: "",
    },
    include: {
      booking: {
        include: {
          tenant: true,
          landlord: true,
          house: true,
        },
      },
    },
  });

  const singlePdf = await generateAgreementPdfByFormat(agreement, "single");

  const updatedAgreement = await prisma.rentalAgreement.update({
    where: {
      id: agreement.id,
    },
    data: {
      pdfUrl: singlePdf.pdfUrl,
    },
    include: {
      booking: {
        include: {
          tenant: true,
          landlord: true,
          house: true,
        },
      },
    },
  });

  return sanitizeAgreementResponse(updatedAgreement);
};

const getMyRentalAgreements = async (user) => {
  if (!user || !user.userId || !user.role) {
    throw createAppError("Unauthorized access", 401);
  }

  let whereClause = {};

  if (user.role === "TENANT") {
    whereClause = {
      booking: {
        tenantId: user.userId,
      },
    };
  } else if (user.role === "LANDLORD") {
    whereClause = {
      booking: {
        landlordId: user.userId,
      },
    };
  } else if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
    whereClause = {};
  } else {
    throw createAppError(
      "You are not allowed to access rental agreements",
      403
    );
  }

  const agreements = await prisma.rentalAgreement.findMany({
    where: whereClause,
    include: {
      booking: {
        include: {
          tenant: true,
          landlord: true,
          house: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return agreements.map((agreement) => sanitizeAgreementResponse(agreement));
};

const getRentalAgreementDetails = async (agreementId, user) => {
  const numericAgreementId = Number(agreementId);

  if (Number.isNaN(numericAgreementId)) {
    throw createAppError("Invalid agreement id", 400);
  }

  const agreement = await prisma.rentalAgreement.findUnique({
    where: {
      id: numericAgreementId,
    },
    include: {
      booking: {
        include: {
          tenant: true,
          landlord: true,
          house: true,
        },
      },
    },
  });

  if (!agreement) {
    throw createAppError("Rental agreement not found", 404);
  }

  if (!canAccessAgreement(agreement, user)) {
    throw createAppError(
      "You are not allowed to access this rental agreement",
      403
    );
  }

  return sanitizeAgreementResponse(agreement);
};

const getRentalAgreementPdfDownloadData = async (
  agreementId,
  user,
  format = "single"
) => {
  const normalizedFormat = normalizeFormat(format);

  const agreement = await getRentalAgreementDetails(agreementId, user);

  const fileName = getAgreementFileName(agreement.id, normalizedFormat);

  const filePath = path.join(
    process.cwd(),
    "uploads",
    "rental-agreements",
    fileName
  );

  if (!fs.existsSync(filePath)) {
    await generateAgreementPdfByFormat(agreement, normalizedFormat);
  }

  if (!fs.existsSync(filePath)) {
    throw createAppError("Rental agreement PDF file not found", 404);
  }

  return {
    agreement,
    filePath,
    fileName,
    format: normalizedFormat,
  };
};

export {
  createRentalAgreement,
  getMyRentalAgreements,
  getRentalAgreementDetails,
  getRentalAgreementPdfDownloadData,
};