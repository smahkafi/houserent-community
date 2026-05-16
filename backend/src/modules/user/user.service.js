const prisma = require("../../config/prisma");

const getAllUsersFromDB = async () => {
  return await prisma.user.findMany({
    orderBy: { id: "desc" },
  });
};

const getSingleUserFromDB = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return user;
};

const createUserIntoDB = async (payload) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ phone: payload.phone }, { email: payload.email }],
    },
  });

  if (existingUser) {
    throw new Error("Phone or email already exists");
  }

  return await prisma.user.create({ data: payload });
};

const updateUserStatusIntoDB = async (id, payload) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new Error("User not found");

  return await prisma.user.update({
    where: { id },
    data: {
      isActive: payload.isActive,
      isApproved: payload.isApproved,
    },
  });
};

const updateUserRoleIntoDB = async (id, role) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });
  if (!existingUser) throw new Error("User not found");

  return await prisma.user.update({
    where: { id },
    data: { role },
  });
};

module.exports = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  createUserIntoDB,
  updateUserStatusIntoDB,
  updateUserRoleIntoDB,
};