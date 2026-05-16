const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No role found",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to access this route",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Role middleware error",
      });
    }
  };
};

export default roleMiddleware;