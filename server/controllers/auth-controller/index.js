const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, phoneNumber, role } = req.body;
  console.log(`[AUTH] Registration request for: ${userEmail}`);

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }, { phoneNumber }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name, email, or phone number already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  // LOG OTP TO TERMINAL (SIMULATED EMAIL/SMS)
  console.log(`\n*********************************`);
  console.log(`🚀 VERIFICATION OTP 🚀`);
  console.log(`USER: ${userEmail}`);
  console.log(`CODE: ${otp}`);
  console.log(`*********************************\n`);

  const newUser = new User({
    userName,
    userEmail,
    phoneNumber,
    role,
    password: hashPassword,
    otp,
    otpExpiry,
    isVerified: false,
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "OTP sent! (For Dev: " + otp + ")",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  console.log(`[AUTH] Login request for: ${userEmail}`);

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (!checkUser.isVerified && checkUser.role !== "admin") {
    // Generate new OTP if missing or expired
    if (!checkUser.otp || checkUser.otpExpiry < Date.now()) {
      checkUser.otp = Math.floor(100000 + Math.random() * 900000).toString();
      checkUser.otpExpiry = Date.now() + 10 * 60 * 1000;
      await checkUser.save();
    }

    // LOG OTP TO TERMINAL AGAIN
    console.log(`\n*********************************`);
    console.log(`🚀 RE-SENT VERIFICATION OTP 🚀`);
    console.log(`USER: ${userEmail}`);
    console.log(`CODE: ${checkUser.otp}`);
    console.log(`*********************************\n`);

    return res.status(403).json({
      success: false,
      message: "Please verify your account! (Dev OTP: " + checkUser.otp + ")",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
      educationLevel: checkUser.educationLevel,
      profession: checkUser.profession,
      learningGoals: checkUser.learningGoals,
      interests: checkUser.interests,
      experienceLevel: checkUser.experienceLevel,
    },
    process.env.JWT_SECRET,
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
        image: checkUser.image,
        bio: checkUser.bio,
        educationLevel: checkUser.educationLevel,
        profession: checkUser.profession,
        learningGoals: checkUser.learningGoals,
        interests: checkUser.interests,
        experienceLevel: checkUser.experienceLevel,
      },
    },
  });
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      userName,
      image,
      bio,
      educationLevel,
      profession,
      learningGoals,
      interests,
      experienceLevel
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        userName,
        image,
        bio,
        educationLevel,
        profession,
        learningGoals,
        interests,
        experienceLevel,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Exclude sensitive fields from response
    updatedUser.password = undefined;
    updatedUser.otp = undefined;
    updatedUser.otpExpiry = undefined;
    updatedUser.invitationToken = undefined;
    updatedUser.invitationTokenExpiry = undefined;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const setCredentials = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      invitationToken: token,
      invitationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invitation token",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.invitationToken = undefined;
    user.invitationTokenExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password set successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userEmail, otp } = req.body;

    const user = await User.findOne({
      userEmail,
      otp,
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP!",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account verified successfully! You can now log in.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const user = await User.findOne({ userEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`\n*********************************`);
    console.log(`🚀 PASSWORD RESET OTP 🚀`);
    console.log(`USER: ${userEmail}`);
    console.log(`CODE: ${otp}`);
    console.log(`*********************************\n`);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your terminal! (For Dev: " + otp + ")",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userEmail, otp, newPassword } = req.body;

    const user = await User.findOne({
      userEmail,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP!",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isVerified = true; // Auto verify if they reset password successfully

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully! You can now log in.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = { registerUser, loginUser, updateUser, setCredentials, verifyOTP, changePassword, forgotPassword, resetPassword };
