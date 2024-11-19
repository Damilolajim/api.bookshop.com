const client = require("../config/db");
const connection = client.collection("cart");

const catchError = require("../utilities/catchError");
const throwError = require("../utilities/throwError");
const { ensureObject } = require("../utilities/helper");

exports.addCart = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const rslt = await connection.insertOne(requestData);

  if (rslt.modifiedCount) return next(new throwError("an error occured", 500));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
  });
});

exports.getCart = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.query);
  const rslt = await connection.findOne({ email: requestData.email });

  if (!rslt) return next(new throwError("invalid email address", 404));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
    data: rslt,
  });
});

exports.updateCart = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.query);
  const rslt = await connection.findOne({ email: requestData.email });

  if (!rslt) return next(new throwError("invalid email address", 404));

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
    data: rslt,
  });
});

exports.deletCart = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);
  const rslt = await connection.deleOne({ _id: new ObjectId(id) });

  if (!rslt?.modifiedCount)
    return next(new throwError("invalid email address", 404));

  resp.status(201).json({
    success: true,
    message: "cart deleted successfully",
  });
});

exports.clearCart = catchError(async (req, resp, next) => {
  const rslt = await connection.delete();

  if (!rslt?.modifiedCount)
    return next(new throwError("invalid email address", 404));

  resp.status(201).json({
    success: true,
    message: "cart cleared successfully",
  });
});
