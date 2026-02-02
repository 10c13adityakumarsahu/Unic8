const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  phoneNumber: String,
  password: String,
  role: String,
  image: String,
  bio: String,
  educationLevel: String,
  profession: String,
  learningGoals: [String],
  interests: [String],
  experienceLevel: String,
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
  invitationToken: String,
  invitationTokenExpiry: Date,
});

module.exports = mongoose.model("User", UserSchema);
