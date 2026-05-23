import rentalUnitService from "./rentalUnit.service.js";
import {
  createRentalUnitSchema,
  updateRentalUnitSchema,
  rejectRentalUnitSchema,
} from "./rentalUnit.validation.js";

const createRentalUnit = async (req, res) => {
  try {
    const data = createRentalUnitSchema.parse(req.body);
    const result = await rentalUnitService.createRentalUnit(req.params.houseId, data, req.user);

    return res.status(201).json({
      success: true,
      message: "Rental unit created successfully and waiting for admin approval",
      data: result,
    });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getMyRentalUnits = async (req, res) => {
  try {
    const data = await rentalUnitService.getMyRentalUnits(req.user);
    return res.status(200).json({ success: true, message: "Rental units fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const getRentalUnitsByHouse = async (req, res) => {
  try {
    const data = await rentalUnitService.getRentalUnitsByHouse(req.params.houseId, req.user);
    return res.status(200).json({ success: true, message: "Rental units fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

const updateRentalUnit = async (req, res) => {
  try {
    const data = updateRentalUnitSchema.parse(req.body);
    const result = await rentalUnitService.updateRentalUnit(req.params.id, data, req.user);
    return res.status(200).json({ success: true, message: "Rental unit updated successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const deleteRentalUnit = async (req, res) => {
  try {
    await rentalUnitService.deleteRentalUnit(req.params.id, req.user);
    return res.status(200).json({ success: true, message: "Rental unit deleted successfully" });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const approveRentalUnit = async (req, res) => {
  try {
    const result = await rentalUnitService.approveRentalUnit(req.params.id);
    return res.status(200).json({ success: true, message: "Rental unit approved successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const rejectRentalUnit = async (req, res) => {
  try {
    const data = rejectRentalUnitSchema.parse(req.body);
    const result = await rentalUnitService.rejectRentalUnit(req.params.id, data.rejectionReason);
    return res.status(200).json({ success: true, message: "Rental unit rejected successfully", data: result });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
};

const getPendingRentalUnits = async (req, res) => {
  try {
    const data = await rentalUnitService.getPendingRentalUnits();
    return res.status(200).json({ success: true, message: "Pending rental units fetched successfully", data });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
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