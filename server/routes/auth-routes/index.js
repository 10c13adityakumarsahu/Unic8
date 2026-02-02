const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  setCredentials,
  verifyOTP,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const User = require("../../models/User");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/set-credentials", setCredentials);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/update/:userId", authenticateMiddleware, updateUser);
router.post("/change-password", authenticateMiddleware, changePassword);
router.get("/check-auth", authenticateMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const freshUser = await User.findById(userId);

    if (!freshUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      data: {
        user: {
          _id: freshUser._id,
          userName: freshUser.userName,
          userEmail: freshUser.userEmail,
          role: freshUser.role,
          image: freshUser.image,
          bio: freshUser.bio,
          educationLevel: freshUser.educationLevel,
          profession: freshUser.profession,
          learningGoals: freshUser.learningGoals,
          interests: freshUser.interests,
          experienceLevel: freshUser.experienceLevel,
        },
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
    });
  }
});

module.exports = router;
