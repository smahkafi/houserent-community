import prisma from "../../config/prisma.js";

const createHouse = async (payload, user, imageUrl) => {
  return await prisma.house.create({
    data: {
      ...payload,
      imageUrl: imageUrl || null,
      landlordId: user.userId,
      status: user.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING",
      isPublished: user.role === "SUPER_ADMIN",
    },
  });
};

const approveHouse = async (id) => {
  const house = await prisma.house.findUnique({ where: { id: Number(id) } });
  if (!house) throw new Error("House not found");
  if (house.status === "APPROVED") throw new Error("House already approved");
  return await prisma.house.update({
    where: { id: Number(id) },
    data: { status: "APPROVED", isPublished: true },
  });
};

const rejectHouse = async (id, rejectionReason) => {
  const house = await prisma.house.findUnique({ where: { id: Number(id) } });
  if (!house) throw new Error("House not found");
  return await prisma.house.update({
    where: { id: Number(id) },
    data: { status: "REJECTED", rejectionReason, isPublished: false },
  });
};

const getAllApprovedHouses = async () => {
  return await prisma.house.findMany({
    where: { status: "APPROVED", isPublished: true, isDeleted: false },
    include: {
      landlord: {
        select: { id: true, fullName: true, phone: true, email: true },
      },
      rentalUnits: {
        where: { status: "APPROVED", isPublished: true, isAvailable: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getSingleApprovedHouse = async (id) => {
  return await prisma.house.findFirst({
    where: { id: Number(id), status: "APPROVED", isPublished: true, isDeleted: false },
    include: {
      landlord: {
        select: { id: true, fullName: true, phone: true, email: true },
      },
      rentalUnits: {
        where: { status: "APPROVED", isPublished: true, isAvailable: true },
      },
    },
  });
};

const getMyHouses = async (user) => {
  return await prisma.house.findMany({
    where: user.role === "LANDLORD" ? { landlordId: user.userId, isDeleted: false } : { isDeleted: false },
    include: {
      rentalUnits: true,
      landlord: {
        select: { id: true, fullName: true, phone: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const softDeleteHouse = async (id, reason, user) => {
  const house = await prisma.house.findUnique({ where: { id: Number(id) } });
  if (!house) throw new Error("House not found");
  if (house.isDeleted) throw new Error("House is already deleted");
  if (user.role === "LANDLORD" && house.landlordId !== user.userId) {
    throw new Error("You are not allowed to delete this house");
  }
  return await prisma.house.update({
    where: { id: Number(id) },
    data: {
      isDeleted: true, deletedAt: new Date(), deleteReason: reason,
      deletedById: user.userId, isPublished: false, restoreRequested: false,
      restoreRequestedAt: null, restoreReason: null, restoreReviewedAt: null,
      restoreReviewNote: null, restoreReviewedById: null,
    },
  });
};

const requestRestoreHouse = async (id, reason, user) => {
  const house = await prisma.house.findUnique({ where: { id: Number(id) } });
  if (!house) throw new Error("House not found");
  if (!house.isDeleted) throw new Error("Only deleted house can be requested for restore");
  if (house.landlordId !== user.userId) throw new Error("You are not allowed to request restore for this house");
  if (house.restoreRequested) throw new Error("Restore request already submitted");
  return await prisma.house.update({
    where: { id: Number(id) },
    data: {
      restoreRequested: true, restoreRequestedAt: new Date(),
      restoreReason: reason, restoreReviewedAt: null,
      restoreReviewNote: null, restoreReviewedById: null,
    },
  });
};

const getDeletedHouses = async () => {
  return await prisma.house.findMany({
    where: { isDeleted: true },
    orderBy: { deletedAt: "desc" },
  });
};

const getRestoreRequests = async () => {
  return await prisma.house.findMany({
    where: { isDeleted: true, restoreRequested: true },
    orderBy: { restoreRequestedAt: "desc" },
  });
};

const reviewRestoreRequest = async (id, action, note, user) => {
  const house = await prisma.house.findUnique({ where: { id: Number(id) } });
  if (!house) throw new Error("House not found");
  if (!house.restoreRequested) throw new Error("No restore request found");
  if (action === "APPROVE") {
    return await prisma.house.update({
      where: { id: Number(id) },
      data: {
        isDeleted: false, deletedAt: null, deleteReason: null, deletedById: null,
        status: "PENDING", isPublished: false, restoreRequested: false,
        restoreReviewedAt: new Date(), restoreReviewNote: note, restoreReviewedById: user.userId,
      },
    });
  }
  if (action === "REJECT") {
    return await prisma.house.update({
      where: { id: Number(id) },
      data: {
        restoreRequested: false, restoreReviewedAt: new Date(),
        restoreReviewNote: note, restoreReviewedById: user.userId,
      },
    });
  }
  throw new Error("Invalid action");
};

const permanentDeleteHouse = async (id) => {
  return await prisma.house.delete({ where: { id: Number(id) } });
};

const getHouseAdminSummary = async () => {
  const pendingHousesCount = await prisma.house.count({
    where: { status: "PENDING", isDeleted: false },
  });
  const deletedHousesCount = await prisma.house.count({ where: { isDeleted: true } });
  const restoreRequestsCount = await prisma.house.count({
    where: { isDeleted: true, restoreRequested: true },
  });
  return { pendingHousesCount, deletedHousesCount, restoreRequestsCount };
};

export default {
  createHouse, approveHouse, rejectHouse, getAllApprovedHouses,
  getSingleApprovedHouse, getMyHouses, softDeleteHouse, requestRestoreHouse,
  getDeletedHouses, getRestoreRequests, reviewRestoreRequest,
  permanentDeleteHouse, getHouseAdminSummary,
};