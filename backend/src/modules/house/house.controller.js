import houseService from "./house.service.js";
import {
  createHouseSchema, rejectHouseSchema, softDeleteHouseSchema,
  restoreRequestSchema, reviewRestoreSchema, permanentDeleteHouseSchema,
} from "./house.validation.js";

const createHouse = async (req, res) => {
  try {
    const data = createHouseSchema.parse(req.body);
    const imageUrl = req.file ? req.file.path : null;
    const result = await houseService.createHouse(data, req.user, imageUrl);
    return res.status(201).json({
      success: true,
      message: req.user.role === "SUPER_ADMIN"
        ? "House created and published successfully"
        : "House created successfully and waiting for admin approval",
      data: result,
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const approveHouse = async (req, res) => {
  try {
    const result = await houseService.approveHouse(req.params.id);
    return res.status(200).json({ success: true, message: "House approved successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const rejectHouse = async (req, res) => {
  try {
    const data = rejectHouseSchema.parse(req.body);
    const result = await houseService.rejectHouse(req.params.id, data.rejectionReason);
    return res.status(200).json({ success: true, message: "House rejected successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getAllApprovedHouses = async (req, res) => {
  try {
    const data = await houseService.getAllApprovedHouses();
    return res.status(200).json({ success: true, message: "Approved houses fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getSingleApprovedHouse = async (req, res) => {
  try {
    const data = await houseService.getSingleApprovedHouse(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "House not found or not approved" });
    return res.status(200).json({ success: true, message: "House fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getMyHouses = async (req, res) => {
  try {
    const data = await houseService.getMyHouses(req.user);
    return res.status(200).json({ success: true, message: "My houses fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const softDeleteHouse = async (req, res) => {
  try {
    const data = softDeleteHouseSchema.parse(req.body);
    const result = await houseService.softDeleteHouse(req.params.id, data.deleteReason, req.user);
    return res.status(200).json({ success: true, message: "House soft deleted successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const requestRestoreHouse = async (req, res) => {
  try {
    const data = restoreRequestSchema.parse(req.body);
    const result = await houseService.requestRestoreHouse(req.params.id, data.restoreReason, req.user);
    return res.status(200).json({ success: true, message: "Restore request submitted successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getDeletedHouses = async (req, res) => {
  try {
    const data = await houseService.getDeletedHouses();
    return res.status(200).json({ success: true, message: "Deleted houses fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getRestoreRequests = async (req, res) => {
  try {
    const data = await houseService.getRestoreRequests();
    return res.status(200).json({ success: true, message: "Restore requests fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const reviewRestoreRequest = async (req, res) => {
  try {
    const data = reviewRestoreSchema.parse(req.body);
    const result = await houseService.reviewRestoreRequest(req.params.id, data.action, data.note, req.user);
    return res.status(200).json({
      success: true,
      message: data.action === "APPROVE" ? "House restore approved successfully" : "House restore rejected successfully",
      data: result,
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const permanentDeleteHouse = async (req, res) => {
  try {
    const data = permanentDeleteHouseSchema.parse(req.body);
    const result = await houseService.permanentDeleteHouse(req.params.id, data.reason, req.user);
    return res.status(200).json({ success: true, message: "House permanently deleted successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getHouseAdminSummary = async (req, res) => {
  try {
    const data = await houseService.getHouseAdminSummary();
    return res.status(200).json({ success: true, message: "House admin summary fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export default {
  createHouse, approveHouse, rejectHouse, getAllApprovedHouses,
  getSingleApprovedHouse, getMyHouses, softDeleteHouse, requestRestoreHouse,
  getDeletedHouses, getRestoreRequests, reviewRestoreRequest,
  permanentDeleteHouse, getHouseAdminSummary,
};