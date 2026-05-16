import prisma from "../../config/prisma.js";

export const getSettings = async () => {
  const settings = await prisma.appSetting.findFirst();
  return settings;
};

export const updateSettings = async (payload) => {
  const updated = await prisma.appSetting.update({
    where: { id: 1 },
    data: {
      agreementFooterEnabled: payload.agreementFooterEnabled,
    },
  });

  return updated;
};