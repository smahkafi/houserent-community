import * as settingsService from "./settings.service.js";

export const getSettings = async (req, res) => {
  try {
    const data = await settingsService.getSettings();

    return res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const data = await settingsService.updateSettings(req.body);

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};