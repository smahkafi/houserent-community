import prisma from "../../config/prisma.js";

const createReport = async (userId, payload, imageUrls = []) => {
  return await prisma.communityReport.create({
    data: {
      ...payload,
      reportedById: userId,
      imageUrls: imageUrls.length > 0 ? imageUrls : [],
    },
  });
};

const getMyReports = async (userId) => {
  return await prisma.communityReport.findMany({
    where: { reportedById: userId },
    orderBy: { createdAt: "desc" },
  });
};

const getAllReports = async () => {
  return await prisma.communityReport.findMany({
    include: {
      reportedBy: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateReportStatus = async (id, payload) => {
  const report = await prisma.communityReport.findUnique({
    where: { id: Number(id) },
  });
  if (!report) throw new Error("Report not found");

  return await prisma.communityReport.update({
    where: { id: Number(id) },
    data: {
      status: payload.status,
      adminNote: payload.adminNote || null,
    },
  });
};

export default {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
};