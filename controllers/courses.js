const { ObjectId } = require("mongodb");
const client = require("../config/db");
const connection = client.collection("courses");

const catchError = require("../utilities/catchError");
const throwError = require("../utilities/throwError");
const { ensureObject } = require("../utilities/helper");

exports.createCourse = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const isDuplicateCourse = await connection.findOne({
    subject: requestData.subject,
  });

  if (isDuplicateCourse)
    return next(new throwError("course already exists", 403));

  const rslt = await connection.insertOne(requestData);

  if (!rslt.acknowledged) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "course added successfully",
    data: {
      course_id: rslt.insertedId,
    },
  });
});

// implement pagegation on this endpoint
exports.getCourses = catchError(async (req, resp, next) => {
  let query = {};
  const { id } = ensureObject(req.params);
  const queryParam = ensureObject(req.query);

  if (id && !ObjectId.isValid(id))
    return next(new throwError("invalid course id", 400));

  if (queryParam) {
    delete queryParam.page;
    delete queryParam.count;
    query = { ...query, ...queryParam };
  }

  const rslt = id
    ? await connection.findOne({ _id: new ObjectId(id) })
    : await connection.find(query).toArray();
  const rsltCount = rslt?.length;

  resp.status(200).json({
    success: true,
    message: `${rsltCount ? "courses" : "course"} fetched successfully`,
    count: rsltCount ? rsltCount : undefined,
    data: rslt,
  });
});

exports.updateCourse = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);
  const requestData = ensureObject(req.body);

  if (!id || !ObjectId.isValid(id))
    return next(new throwError("invalid course id", 403));

  if (requestData.subject) {
    const course = await connection.findOne({ subject: requestData.subject });

    if (course)
      return next(
        new throwError(
          `course (${requestData.subject}) already exiists, please choose a unique course name`,
          403
        )
      );
  }

  const rslt = await connection.updateOne(
    { _id: new ObjectId(id) },
    { $set: requestData }
  );

  if (!rslt?.modifiedCount)
    return next(new throwError("invalid course ID", 400));

  resp.status(200).json({
    success: true,
    message: "course updated successfully",
  });
});

exports.deleteCourse = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);

  if (!id && !ObjectId.isValid(id))
    return next(new throwError("invalid course id", 400));

  const rslt = await connection.deleteOne({ _id: new ObjectId(id) });

  if (!rslt?.deletedCount)
    return next(new throwError("invalid course ID", 400));

  resp.status(201).json({
    success: true,
    message: "course deleted successfully",
  });
});
