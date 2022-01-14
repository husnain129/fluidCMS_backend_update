import { NextFunction, Request, Response } from "express";
import FieldService from './Field.service';
import { STATUS } from "../Types/enums";


class Field {
	static async createField(req: Request, res: Response, next: NextFunction) {
		try {
			const { name, alias, field_type, validation } = req.body;
			const { model_alias: modelAlias } = req.params;
			const projectID = (req as any).projectID as string;

			res.status(STATUS.CREATED).json({
				ok: true,
				field: await FieldService.createField({ projectID, modelAlias, name, alias, field_type, validation })
			})
		} catch (err) {
			next(err);
		}
	}

	static async getOneField(req: Request, res: Response, next: NextFunction) {
		try {
			const { alias: fieldAlias, model_alias: modelAlias } = req.params;
			const projectID = (req as any).projectID as string;
			res.status(STATUS.OK).json({
				ok: true,
				field: await FieldService.getOneField(projectID, fieldAlias, modelAlias)
			})

		} catch (err) {
			next(err)
		}
	}

	static async getAllFields(req: Request, res: Response, next: NextFunction) {
		try {
			const { model_alias: modelAlias } = req.params;
			const projectID = (req as any).projectID as string;
			res.status(STATUS.OK).json({
				ok: true,
				fields: await FieldService.getAllFields(modelAlias, projectID)
			})
		} catch (err) {
			next(err);
		}
	}

}

export default Field;