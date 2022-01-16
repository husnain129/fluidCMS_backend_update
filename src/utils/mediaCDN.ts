import { NextFunction, Response } from "express";
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums';

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export let uploadImage = async (size: any, filePath: any) => {
  let img: any;
  img = await cloudinary.uploader
    .upload(
      filePath,
      {
        secure: true,
        transformation: [size],
      },
      (err: any) => {
        if (err) {
          throw new FluidError(err.message,STATUS.INTERNAL_SERVER_ERROR);
        }
        console.log("Image uploaded");
      }
    )
    .then((res: Response) => {
      return {
        url: (res as any).url,
        cdn_id: (res as any).public_id,
      };
    });
  return img;
};

export let deleteImage = async (cdn_id: string) => {
  cloudinary.uploader
    .destroy(cdn_id, (err: any) => {
      if (err) {
        throw new FluidError(err.message,STATUS.INTERNAL_SERVER_ERROR);
      }
    })
    .then((res: Response) => {
      return "Image deleted";
    });
};
