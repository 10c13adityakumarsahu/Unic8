const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetailsByID,
  updateCourseByID,
  getCoursesByInstructorId,
} = require("../../controllers/instructor-controller/course-controller");
const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/details/:id", getCourseDetailsByID);
router.get("/get/instructor/:instructorId", getCoursesByInstructorId);
router.put("/update/:id", updateCourseByID);

module.exports = router;
