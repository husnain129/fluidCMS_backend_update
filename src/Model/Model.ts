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

	static async getOneModel(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectID } = req as any;
			const { model_alias: modelAlias } = req.params;
			res.status(STATUS.OK).json({
				ok: true,
				model: await ModelService.getOneModel(projectID, modelAlias)
			})
		} catch (err) {
			next(err);
		}
	}

	static async getAllModel(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectID } = req as any;
			console.log("model", projectID)
			res.status(STATUS.OK).json({
				ok: true,
				models: await ModelService.getAllModel(projectID),
			})
		} catch (err) {
			next(err);

		}
	}

	static async deleteModel(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectID } = req as any;
			let { model_alias: alias } = req.params;
			res.status(STATUS.OK).json({
				ok: true,
				message: await ModelService.deleteModel(projectID, alias)
			})
		} catch (err) {
			next(err);
		}
	}

	static async updateModel(req: Request, res: Response, next: NextFunction) {
		try {
			const { projectID } = req as any;
			let { model_alias: modelAlias } = req.params;
			const { name, alias } = req.body;
			res.status(STATUS.OK).json({
				ok: true,
				message: await ModelService.updateModel(projectID, modelAlias, name, alias)
			})
		} catch (err) {
			next(err);
		}
	}
}


export default Model;