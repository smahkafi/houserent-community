import communityReportService from "./communityReport.service.js";
import {
  createReportSchema,
  updateReportStatusSchema,
} from "./communityReport.validation.js";

const createReport = async (req, res) => {
  try {
    const data = createReportSchema.parse(req.body);
    const result = await communityReportService.createReport(req.user.userId, data);
    return res.status(201).json({ success: true, message: "Report submitted successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const data = await communityReportService.getMyReports(req.user.userId);
    return res.status(200).json({ success: true, message: "Reports fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const data = await communityReportService.getAllReports();
    return res.status(200).json({ success: true, message: "All reports fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const data = updateReportStatusSchema.parse(req.body);
    const result = await communityReportService.updateReportStatus(req.params.id, data);
    return res.status(200).json({ success: true, message: "Report status updated successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

export default {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
};