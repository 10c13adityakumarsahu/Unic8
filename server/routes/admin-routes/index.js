const express = require("express");
const {
    getAllInstructors,
    getAllUsers,
    onboardInstructor,
    getAdminStats,
    addNewInstructor,
} = require("../../controllers/admin-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");

const router = express.Router();

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin role required.",
        });
    }
    next();
};

router.get("/instructors", authenticateMiddleware, adminMiddleware, getAllInstructors);
router.get("/users", authenticateMiddleware, adminMiddleware, getAllUsers);
router.post("/onboard", authenticateMiddleware, adminMiddleware, onboardInstructor);
router.get("/stats", authenticateMiddleware, adminMiddleware, getAdminStats);
router.post("/add-instructor", authenticateMiddleware, adminMiddleware, addNewInstructor);

module.exports = router;
