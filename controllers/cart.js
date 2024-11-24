const client = require("../config/db");
const connection = client.collection("cart");

const catchError = require("../utilities/catchError");
const throwError = require("../utilities/throwError");
const { ensureObject } = require("../utilities/helper");
const { ObjectId } = require("mongodb");

/**
 * ensure course id is unique
 */
exports.addCart = catchError(async (req, resp, next) => {
  const requestData = ensureObject(req.body);
  const rslt = !Array.isArray(requestData)
    ? await connection.insertOne(requestData)
    : await connection.insertMany(requestData);

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
    data: {
      cart_ids: requestData?.length
        ? rslt.insertedIds.map((id) => id.toString())
        : rslt.insertedId,
    },
  });
});

exports.getCart = catchError(async (req, resp, next) => {
  const rslt = await connection.find().toArray();

  resp.status(201).json({
    success: true,
    message: "cart added successfully",
    count: rslt.length,
    data: rslt,
  });
});

/**
 * delete by course id
 */
exports.deletCart = catchError(async (req, resp, next) => {
  const { id } = ensureObject(req.params);

  if (id || !ObjectId.isValid(id))
    return next(new throwError("invalid cart ID", 400));

  const rslt = id
    ? await connection.deleteOne({ _id: new ObjectId(id) })
    : await connection.deleteMany();

  if (!rslt?.deletedCount) return next(new throwError("invalid cart ID", 400));

  resp.status(201).json({
    success: true,
    message: `${id ? "cart item" : "carts"} deleted successfully`,
  });
});
