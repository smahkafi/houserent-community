import prisma from "../../config/prisma.js";

const createRentalUnit = async (houseId, payload, user) => {
  const house = await prisma.house.findUnique({
    where: { id: Number(houseId) },
  });

  if (!house) throw new Error("House not found");
  if (house.landlordId !== user.userId) throw new Error("You are not allowed to add unit to this house");

  return await prisma.rentalUnit.create({
    data: {
      ...payload,
      houseId: Number(houseId),
      availableFrom: payload.availableFrom ? new Date(payload.availableFrom) : null,
      status: "PENDING",
      isPublished: false,
    },
  });
};

const getMyRentalUnits = async (user) => {
  return await prisma.rentalUnit.findMany({
    where: {
      house: {
        landlordId: user.userId,
      },
    },
    include: {
      house: {
        select: {
          id: true,
          title: true,
          address: true,
          area: true,
          totalFloors: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getRentalUnitsByHouse = async (houseId, user) => {
  const house = await prisma.house.findUnique({
    where: { id: Number(houseId) },
  });

  if (!house) throw new Error("House not found");
  if (house.landlordId !== user.userId) throw new Error("You are not allowed to view units of this house");

  return await prisma.rentalUnit.findMany({
    where: { houseId: Number(houseId) },
    orderBy: { createdAt: "desc" },
  });
};

const updateRentalUnit = async (id, payload, user) => {
  const unit = await prisma.rentalUnit.findUnique({
    where: { id: Number(id) },
    include: { house: true },
  });

  if (!unit) throw new Error("Rental unit not found");
  if (unit.house.landlordId !== user.userId) throw new Error("You are not allowed to update this unit");

  return await prisma.rentalUnit.update({
    where: { id: Number(id) },
    data: {
      ...payload,
      availableFrom: payload.availableFrom ? new Date(payload.availableFrom) : null,
      status: "PENDING",
      isPublished: false,
    },
  });
};

const deleteRentalUnit = async (id, user) => {
  const unit = await prisma.rentalUnit.findUnique({
    where: { id: Number(id) },
    include: { house: true },
  });

  if (!unit) throw new Error("Rental unit not found");
  if (unit.house.landlordId !== user.userId) throw new Error("You are not allowed to delete this unit");

  return await prisma.rentalUnit.delete({
    where: { id: Number(id) },
  });
};

const approveRentalUnit = async (id) => {
  const unit = await prisma.rentalUnit.findUnique({
    where: { id: Number(id) },
  });

  if (!unit) throw new Error("Rental unit not found");
  if (unit.status === "APPROVED") throw new Error("Rental unit already approved");

  return await prisma.rentalUnit.update({
    where: { id: Number(id) },
    data: {
      status: "APPROVED",
      isPublished: true,
    },
  });
};

const rejectRentalUnit = async (id, rejectionReason) => {
  const unit = await prisma.rentalUnit.findUnique({
    where: { id: Number(id) },
  });

  if (!unit) throw new Error("Rental unit not found");

  return await prisma.rentalUnit.update({
    where: { id: Number(id) },
    data: {
      status: "REJECTED",
      rejectionReason,
      isPublished: false,
    },
  });
};

const getPendingRentalUnits = async () => {
  return await prisma.rentalUnit.findMany({
    where: { status: "PENDING" },
    include: {
      house: {
        select: {
          id: true,
          title: true,
          address: true,
          area: true,
          landlord: {
            select: {
              id: true,
              fullName: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export default {
  createRentalUnit,
  getMyRentalUnits,
  getRentalUnitsByHouse,
  updateRentalUnit,
  deleteRentalUnit,
  approveRentalUnit,
  rejectRentalUnit,
  getPendingRentalUnits,
};