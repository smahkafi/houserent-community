import {
  createRentalAgreement,
  getMyRentalAgreements,
  getRentalAgreementDetails,
  getRentalAgreementPdfDownloadData,
} from "./rentalAgreement.service.js";

const handleErrorResponse = (res, error, defaultMessage) => {
  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || defaultMessage,
  });
};

const createRentalAgreementController = async (req, res) => {
  try {
    const result = await createRentalAgreement(req.body);

    return res.status(201).json({
      success: true,
      message: "Rental agreement created successfully",
      data: result,
    });
  } catch (error) {
    return handleErrorResponse(
      res,
      error,
      "Failed to create rental agreement"
    );
  }
};

const getMyRentalAgreementsController = async (req, res) => {
  try {
    const result = await getMyRentalAgreements(req.user);

    return res.status(200).json({
      success: true,
      message: "My rental agreements fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleErrorResponse(
      res,
      error,
      "Failed to fetch my rental agreements"
    );
  }
};

const getRentalAgreementDetailsController = async (req, res) => {
  try {
    const result = await getRentalAgreementDetails(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Rental agreement details fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleErrorResponse(
      res,
      error,
      "Failed to fetch rental agreement details"
    );
  }
};

const downloadRentalAgreementPdfController = async (req, res) => {
  try {
    const result = await getRentalAgreementPdfDownloadData(
      req.params.id,
      req.user,
      req.query.format
    );

    return res.download(result.filePath, result.fileName);
  } catch (error) {
    return handleErrorResponse(
      res,
      error,
      "Failed to download rental agreement PDF"
    );
  }
};

export {
  createRentalAgreementController,
  getMyRentalAgreementsController,
  getRentalAgreementDetailsController,
  downloadRentalAgreementPdfController,
};