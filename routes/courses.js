const express = require("express");
const router = express.Router();

const validatSchema = require("../middlewares/joi");
const cleanupData = require("../middlewares/cleanupData");

const {
  courseSchema,
  updateCourseSchema,
} = require("../utilities/validators/courseSchema");

const {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
} = require("../controllers/courses");

router
  .route("/")
  .get(getCourses)
  .post(cleanupData, validatSchema(courseSchema), createCourse);

router
  .route("/:id")
  .get(getCourses)
  .patch(cleanupData, validatSchema(updateCourseSchema), updateCourse)
  .delete(deleteCourse);

module.exports = router;
