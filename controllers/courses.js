const client = require("../config/db");
const connection = client.collection("cart");

const catchError = require("../utilities/catchError");
const { ensureObject } = require("../utilities/helper");

exports.createCourse = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const rslt = await connection.insertOne(requestData);

  if (rslt.modifiedCount) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
  });
});

exports.getCourses = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const rslt = await connection.insertOne(requestData);

  if (rslt.modifiedCount) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
  });
});

exports.updateCourse = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const rslt = await connection.insertOne(requestData);

  if (rslt.modifiedCount) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
  });
});

exports.deleteCourse = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const rslt = await connection.insertOne(requestData);

  if (rslt.modifiedCount) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
  });
});
