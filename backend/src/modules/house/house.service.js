import prisma from "../../config/prisma.js";

const createHouse = async (payload, user) => {
  return await prisma.house.create({
    data: {
      ...payload,
      landlordId: user.userId,
      status: user.role === "SUPER_ADMIN" ? "APPROVED" : "PENDING",
      isPublished: user.role === "SUPER_ADMIN",
    },
  });
};

const approveHouse = async (id, user) => {
  const house = await prisma.house.findUnique({
    where: { id: Number(id) },
  });

  if (!house) {
    throw new Error("House not found");
  }

  if (house.status === "APPROVED") {
    throw new Error("House already approved");
  }

  return await prisma.house.update({
    where: { id: Number(id) },
    data: {
      status: "APPROVED",
      isPublished: true,
    },
  });
};

const getAllApprovedHouses = async () => {
  return await prisma.house.findMany({
    where: {
      status: "APPROVED",
      isPublished: true,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleApprovedHouse = async (id) => {
  return await prisma.house.findFirst({
    where: {
      id: Number(id),
      status: "APPROVED",
      isPublished: true,
      isDeleted: false,
    },
  });
};

const getMyHouses = async (user) => {
  return await prisma.house.findMany({
    where: user.role === "LANDLORD" ? { landlordId: user.userId } : {},
    orderBy: {
      createdAt: "desc",
    },
  });
};

const softDeleteHouse = async (id, reason, user) => {
  const house = await prisma.house.findUnique({
    where: { id: Number(id) },
  });

  if (!house) {
    throw new Error("House not found");
  }

  if (house.isDeleted) {
    throw new Error("House is already deleted");
  }

  if (user.role === "LANDLORD" && house.landlordId !== user.userId) {
    throw new Error("You are not allowed to delete this house");
  }

  return await prisma.house.update({
    where: { id: Number(id) },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deleteReason: reason,
      deletedById: user.userId,
      isPublished: false,
      restoreRequested: false,
      restoreRequestedAt: null,
      restoreReason: null,
      restoreReviewedAt: null,
      restoreReviewNote: null,
      restoreReviewedById: null,
    },
  });
};

const requestRestoreHouse = async (id, reason, user) => {
  const house = await prisma.house.findUnique({
    where: { id: Number(id) },
  });

  if (!house) {
    throw new Error("House not found");
  }

  if (!house.isDeleted) {
    throw new Error("Only deleted house can be requested for restore");
  }

  if (house.landlordId !== user.userId) {
    throw new Error("You are not allowed to request restore for this house");
  }

  if (house.restoreRequested) {
    throw new Error("Restore request already submitted");
  }

  return await prisma.house.update({
    where: { id: Number(id) },
    data: {
      restoreRequested: true,
      restoreRequestedAt: new Date(),
      restoreReason: reason,
      restoreReviewedAt: null,
      restoreReviewNote: null,
      restoreReviewedById: null,
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
    where: {
      isDeleted: true,
      restoreRequested: true,
    },
    orderBy: { restoreRequestedAt: "desc" },
  });
};

const reviewRestoreRequest = async (id, action, note, user) => {
  const house = await prisma.house.findUnique({
    where: { id: Number(id) },
  });

  if (!house) throw new Error("House not found");

  if (!house.restoreRequested) {
    throw new Error("No restore request found");
  }

  if (action === "APPROVE") {
    return await prisma.house.update({
      where: { id: Number(id) },
      data: {
        isDeleted: false,
        deletedAt: null,
        deleteReason: null,
        deletedById: null,
        status: "PENDING",
        isPublished: false,
        restoreRequested: false,
      },
    });
  }

  if (action === "REJECT") {
    return await prisma.house.update({
      where: { id: Number(id) },
      data: {
        restoreRequested: false,
      },
    });
  }

  throw new Error("Invalid action");
};

const permanentDeleteHouse = async (id) => {
  return await prisma.house.delete({
    where: { id: Number(id) },
  });
};

const getHouseAdminSummary = async () => {
  const deletedHousesCount = await prisma.house.count({
    where: { isDeleted: true },
  });

  const restoreRequestsCount = await prisma.house.count({
    where: {
      isDeleted: true,
      restoreRequested: true,
    },
  });

  return {
    deletedHousesCount,
    restoreRequestsCount,
  };
};

export default {
  createHouse,
  approveHouse,
  getAllApprovedHouses,
  getSingleApprovedHouse,
  getMyHouses,
  softDeleteHouse,
  requestRestoreHouse,
  getDeletedHouses,
  getRestoreRequests,
  reviewRestoreRequest,
  permanentDeleteHouse,
  getHouseAdminSummary,
};