import { NextFunction, Request, Response } from "express";
import FluidError from '../FluidError'
import { STATUS } from '../Types/enums';

const extensionChecker = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
    return next(new FluidError("No files were uploaded.",STATUS.BAD_REQUEST));
    }
    let file: any = (req.files as any).image;
    let ext = file.name.split(".").pop();
    if (["jpg", "jpeg", "webp", "png", "bmp"].includes(ext) === false) {
    return next(new FluidError("File extension not supported.", STATUS.BAD_REQUEST));
    }
    return next();
  } catch (error) {
    return next(new FluidError("something went wrong.",STATUS.INTERNAL_SERVER_ERROR));
  }
};

export default extensionChecker;
