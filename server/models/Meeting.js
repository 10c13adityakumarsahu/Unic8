const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mentorName: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    studentName: String,
    studentEmail: String,
    date: Date,
    time: String,
    duration: { type: Number, default: 30 }, // duration in minutes
    status: { type: String, enum: ["pending", "accepted", "rejected", "reschedule_requested"], default: "pending" },
    meetingLink: String,
    amount: { type: Number, default: 999 },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    rescheduleRequestedBy: { type: String, enum: ["mentor", "student", null], default: null },
    rating: { type: Number, default: 0 },
    review: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
