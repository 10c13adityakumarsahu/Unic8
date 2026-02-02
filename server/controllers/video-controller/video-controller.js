const { generateStreamToken } = require("../../lib/stream");

/**
 * Generate Stream token for video calls
 * This endpoint accepts user info from your existing auth system
 * POST /api/video/token
 * Body: { userId: string, userName?: string, userImage?: string }
 */
const getStreamToken = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        error: "Missing userId in request body",
      });
    }

    const token = generateStreamToken(userId);

    res.status(200).json({
      token,
      apiKey: process.env.STREAM_API_KEY,
    });
  } catch (error) {
    console.error("Error in getStreamToken controller:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { getStreamToken };
