const express = require("express");
const { getStreamToken } = require("../../controllers/video-controller/video-controller");

const router = express.Router();

// Generate Stream token for video calls
// This endpoint should be protected by your existing auth middleware
router.post("/token", getStreamToken);

module.exports = router;
