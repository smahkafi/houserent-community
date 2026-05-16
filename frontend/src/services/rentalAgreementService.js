import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getToken } from "../utils/auth";

const getAuthHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getMyRentalAgreements = async () => {
  const response = await axios.get(`${API_BASE_URL}/rental-agreements/my`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const getRentalAgreementDetails = async (agreementId) => {
  const response = await axios.get(
    `${API_BASE_URL}/rental-agreements/${agreementId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const downloadRentalAgreementPdf = async (agreementId, format) => {
  const response = await axios.get(
    `${API_BASE_URL}/rental-agreements/${agreementId}/download?format=${format}`,
    {
      headers: getAuthHeaders(),
      responseType: "blob",
    }
  );

  const fileName =
    format === "stamp3"
      ? `rental-agreement-${agreementId}-STAMP_3_PAGE.pdf`
      : `rental-agreement-${agreementId}-single-page.pdf`;

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = blobUrl;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);

  return true;
};
