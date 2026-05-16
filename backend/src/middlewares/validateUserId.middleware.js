const validateUserId = (req, res, next) => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user id",
    });
  }

  req.userId = userId;
  next();
};

export default validateUserId;