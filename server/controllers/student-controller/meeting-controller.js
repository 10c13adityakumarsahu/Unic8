const Meeting = require("../../models/Meeting");
const User = require("../../models/User");

const createMeetingRequest = async (req, res) => {
    try {
        const { mentorId, mentorName, studentId, studentName, studentEmail, date, time } = req.body;

        const newMeeting = new Meeting({
            mentorId,
            mentorName,
            studentId,
            studentName,
            studentEmail,
            date,
            time,
            status: "pending",
        });

        await newMeeting.save();

        res.status(201).json({
            success: true,
            message: "Meeting request sent successfully!",
            data: newMeeting,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getMeetingsForInstructor = async (req, res) => {
    try {
        const { instructorId } = req.params;
        const meetings = await Meeting.find({ mentorId: instructorId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: meetings,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getMeetingsForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const meetings = await Meeting.find({ studentId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: meetings,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const updateMeetingStatus = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { status, meetingLink, rescheduleRequestedBy, date, time } = req.body;

        const updatedMeeting = await Meeting.findByIdAndUpdate(
            meetingId,
            { status, meetingLink, rescheduleRequestedBy, date, time },
            { new: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Meeting updated successfully!`,
            data: updatedMeeting,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const captureMeetingPayment = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const updatedMeeting = await Meeting.findByIdAndUpdate(
            meetingId,
            { paymentStatus: "paid" },
            { new: true }
        );

        if (!updatedMeeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment captured and meeting confirmed!",
            data: updatedMeeting,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const rateMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { rating, review } = req.body;

        const updatedMeeting = await Meeting.findByIdAndUpdate(
            meetingId,
            { rating, review },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Thank you for your feedback!",
            data: updatedMeeting,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = {
    createMeetingRequest,
    getMeetingsForInstructor,
    getMeetingsForStudent,
    updateMeetingStatus,
    captureMeetingPayment,
    rateMeeting
};
