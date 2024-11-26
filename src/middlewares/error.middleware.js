import mongoose from "mongoose";
import { apiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  if (error.name == "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `The ${field} already exists. Please use a different ${field}.`;
  }

  if (!(error instanceof apiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // set a message from native Error instance or a custom one
    const message = error.message || "Something went wrong";
    error = new apiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...{ stack: error.stack },
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };