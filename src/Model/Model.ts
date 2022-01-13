import { NextFunction, Request, Response } from "express";
import { STATUS } from '../Types/enums';
import ModelService from './Model.service';

class Model {
	static async createModel(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectID } = req as any;
			const { name, alias } = req.body;
			res.status(STATUS.OK).json({
				ok: true,
				model: await ModelService.createModel(projectID, name, alias)
			})
		} catch (err) {
			next(err);
		}
	}
}

export default Model;