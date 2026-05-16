const validateCreateRentalApplication = (data) => {
  const errors = [];

  if (!data.bookingId) {
    errors.push("bookingId is required");
  }

  if (data.bookingId && isNaN(Number(data.bookingId))) {
    errors.push("bookingId must be a valid number");
  }

  if (
    data.notes !== undefined &&
    data.notes !== null &&
    typeof data.notes !== "string"
  ) {
    errors.push("notes must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export { validateCreateRentalApplication };