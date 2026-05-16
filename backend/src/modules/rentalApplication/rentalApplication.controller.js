import rentalApplicationService from "./rentalApplication.service.js";
import { validateCreateRentalApplication } from "./rentalApplication.validation.js";

const createRentalApplication = async (req, res) => {
  try {
    const { isValid, errors } = validateCreateRentalApplication(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const application = await rentalApplicationService.createRentalApplication(
      req.user,
      req.body,
      req.files
    );

    return res.status(201).json({
      success: true,
      message: "Rental application created successfully",
      data: application,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create rental application",
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await rentalApplicationService.getMyApplications(
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "My rental applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch rental applications",
    });
  }
};

export default {
  createRentalApplication,
  getMyApplications,
};