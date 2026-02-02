const express = require("express");
const {
    createMeetingRequest,
    getMeetingsForInstructor,
    getMeetingsForStudent,
    updateMeetingStatus,
    captureMeetingPayment,
    rateMeeting
} = require("../../controllers/student-controller/meeting-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const router = express.Router();

router.post("/create", authenticateMiddleware, createMeetingRequest);
router.get("/instructor/:instructorId", authenticateMiddleware, getMeetingsForInstructor);
router.get("/student/:studentId", authenticateMiddleware, getMeetingsForStudent);
router.put("/update/:meetingId", authenticateMiddleware, updateMeetingStatus);
router.put("/capture-payment/:meetingId", authenticateMiddleware, captureMeetingPayment);
router.put("/rate/:meetingId", authenticateMiddleware, rateMeeting);

module.exports = router;
