const User = require("../../models/User");
const Order = require("../../models/Order");
const bcrypt = require("bcryptjs");

const getAllInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: "instructor" });
        res.status(200).json({
            success: true,
            data: instructors,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" });
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const onboardInstructor = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.role = "instructor";
        await user.save();

        res.status(200).json({
            success: true,
            message: "User onboarded as instructor successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const orders = await Order.find({ orderStatus: "confirmed" });
        const users = await User.find({ role: "user" });
        const instructors = await User.find({ role: "instructor" });

        const totalRevenue = orders.reduce(
            (acc, order) => acc + parseFloat(order.coursePricing),
            0
        );

        const revenuePerInstructor = orders.reduce((acc, order) => {
            const { instructorId, instructorName, coursePricing } = order;
            if (!acc[instructorId]) {
                acc[instructorId] = {
                    instructorName,
                    revenue: 0,
                };
            }
            acc[instructorId].revenue += parseFloat(coursePricing);
            return acc;
        }, {});

        // Mocking active user time since it's not tracked
        const userActiveTime = users.map((user) => ({
            userName: user.userName,
            timeActive: Math.floor(Math.random() * 100) + 10, // Mock data
        }));

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalUsers: users.length,
                totalInstructors: instructors.length,
                revenuePerInstructor: Object.values(revenuePerInstructor),
                userActiveTime,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

const crypto = require("crypto");

const addNewInstructor = async (req, res) => {
    try {
        const { userName, userEmail } = req.body;

        const existingUser = await User.findOne({
            $or: [{ userEmail }, { userName }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User name or user email already exists",
            });
        }

        const invitationToken = crypto.randomBytes(32).toString("hex");
        const invitationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const newUser = new User({
            userName,
            userEmail,
            role: "instructor",
            invitationToken,
            invitationTokenExpiry,
        });

        await newUser.save();

        // In a real app, send email here. 
        // For this demo, we'll return the invitation link in the response 
        // so the admin can copy/paste it or we can simulate it.
        const invitationLink = `${process.env.CLIENT_URL}/set-credentials/${invitationToken}`;

        res.status(201).json({
            success: true,
            message: "Instructor invited successfully!",
            data: {
                invitationLink
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

module.exports = {
    getAllInstructors,
    getAllUsers,
    onboardInstructor,
    getAdminStats,
    addNewInstructor,
};
