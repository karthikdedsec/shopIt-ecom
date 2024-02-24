import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

//checks if user is authenticated or not
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("Unauthorized : Login to access the resource", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);

  next();
});
