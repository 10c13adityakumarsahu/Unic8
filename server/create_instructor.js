require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createInstructor = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const userEmail = "instructor@unic8.com";
        const password = "password123";
        const userName = "Instructor";

        // Check if user already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            console.log("Instructor user already exists.");
            console.log(`Email: ${userEmail}`);
            console.log(`Password: ${password} (if you haven't changed it)`);
            process.exit(0);
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            userEmail,
            role: "instructor",
            password: hashPassword,
        });

        await newUser.save();
        console.log("Instructor account created successfully!");
        console.log(`Email: ${userEmail}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error("Error creating instructor:", error);
        process.exit(1);
    }
};

createInstructor();
