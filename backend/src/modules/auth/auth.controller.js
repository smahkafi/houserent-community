import { authService } from "./auth.service.js";

const registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      data: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const socialLoginUser = async (req, res) => {
  try {
    const result = await authService.socialLoginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Social login successful",
      token: result.token,
      data: result.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Social login failed",
      error: error.message,
    });
  }
};

export const authController = {
  registerUser,
  loginUser,
  socialLoginUser,
};