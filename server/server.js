require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Routes
const videoRoutes = require("./routes/video-routes/video-routes");
const authRoutes = require("./routes/auth-routes/index");
const mediaRoutes = require("./routes/instructor-routes/media-routes");
const instructorCourseRoutes = require("./routes/instructor-routes/course-routes");
const studentViewCourseRoutes = require("./routes/student-routes/course-routes");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes");
const studentCoursesRoutes = require("./routes/student-routes/student-courses-routes");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");
const meetingRoutes = require("./routes/student-routes/meeting-routes");
const adminRoutes = require("./routes/admin-routes/index");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ------------------ CORS ------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------ Security Middleware ------------------
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ------------------ Rate Limiting ------------------
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ------------------ Body Parsers ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------ Static Files ------------------
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ------------------ Health Check ------------------
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// ------------------ Routes ------------------
app.use("/api/video", videoRoutes);

app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);

app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);
app.use("/student/meeting", meetingRoutes);

app.use("/admin", adminRoutes);

// ------------------ Database ------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ MongoDB connection error:", e));

// ------------------ Error Handler ------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

// ------------------ Server Start ------------------
app.listen(PORT, () => {
  // Server is starting... verified env vars loaded
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

  if (!process.env.STREAM_API_KEY || !process.env.STREAM_API_SECRET) {
    console.warn("⚠️ STREAM_API_KEY or STREAM_API_SECRET missing!");
  }

  if (!MONGO_URI) {
    console.warn("⚠️ MONGO_URI missing!");
  }
});
