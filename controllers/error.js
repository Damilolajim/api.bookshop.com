/* eslint-disable no-unused-vars */
const throwError = require("../utilities/throwError");

const errorHandler = (err, req, resp, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Something went wrong";

  if (process.env.DEV_ENV === "production") {
    let error = { ...err, message: err.message };
    error = transformError(error);

    return sendProductionError(error, resp);
  }

  sendDevelopmentError(err, resp);
};

const sendDevelopmentError = (err, resp) => {
  resp.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stackTraceP: err.stack,
  });
};

const sendProductionError = (err, resp) => {
  if (!err.isOperational)
    return resp.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });

  resp.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

const transformError = (err) => {
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
    return new throwError(err.message, 401);

  if (err.name === "CastError") {
    const message = `invalid ${err.path}: ${err.value}`;
    return new throwError(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate key: '${Object.keys(err.keyValue)[0]}'`;
    return new throwError(message, 400);
  }

  if (err?.type === "entity.parse.failed")
    return new throwError("Invalid request body sent", 400);

  return err;
};

module.exports = errorHandler;
