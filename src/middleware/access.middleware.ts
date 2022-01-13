import { NextFunction, Request, Response } from "express";
import FluidError from "../FluidError";
const jwt = require("jsonwebtoken");
import User from '../User/User.schema';
import { STATUS } from '../Types/enums';
interface RequestWithUser extends Request {
  userID: any;
}

 const protect = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new FluidError("You are not logged in!", STATUS.UNAUTHORIZE));
  }
  try {
    const decode = jwt.verify(token, "" + process.env.JWT_SECRET);
    let user = await User.findById(decode.id).select("_id");
    if (!user) return next(new FluidError("User Not Found!", STATUS.UNAUTHORIZE));
    req.userID = user._id;
    next();
  } catch (error: any) {
     return next(new FluidError("Invalid Token!", STATUS.UNAUTHORIZE));
  }
};

export default protect;