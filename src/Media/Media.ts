import { NextFunction, Request, Response } from "express";
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums'
import MediaService from './Media.service'


class Media {
	static async uploadImage(req: Request, res: Response, next: NextFunction) {
		try {

			const file = (req.files as any).image;
			if (!file) throw new FluidError("file not found", STATUS.BAD_REQUEST);

			res.status(STATUS.CREATED).json({
				ok: true,
				media: await MediaService.uploadImage(file)
			})
		} catch (err: any) {
			next(err)
		}
	}

	static async updateImage(req: Request, res: Response, next: NextFunction) {
		try {
			const file = (req.files as any).image;
			const { cdn_id } = req.params;

			if (!file) throw new FluidError("file not found", STATUS.BAD_REQUEST);

			res.status(STATUS.OK).json({
				ok: true,
				media: await MediaService.updateImage(file, cdn_id)
			})
		} catch (err: any) {
			next(err);
		}
	}

	static async getImage(req: Request, res: Response, next: NextFunction) {
		try {
			const { id: imageID } = req.params;
			if (!imageID) throw new FluidError("please enter id", STATUS.BAD_REQUEST);

			res.status(STATUS.OK).json({
				ok: true,
				media: await MediaService.getImage(imageID)
			})
		} catch (err: any) {
			next(err);
		}
	}
}

export default Media;