import { NextFunction, Request, Response } from "express";
import { STATUS } from "../Types/enums";
import RecordService from './Record.service'

class Record {
	static async createRecord(req: Request, res: Response, next: NextFunction) {
		try {
			const recordBody: { [key: string]: string } = req.body.fields;
			const { model_alias: modelAlias } = req.params;
			const projectID = (req as any).projectID as string;
			res.status(STATUS.CREATED).json({
				ok: true,
				record: await RecordService.createRecord(recordBody, projectID, modelAlias)
			})
		} catch (err) {
			next(err);
		}
	}
	static async getOneRecord(req: Request, res: Response, next: NextFunction) {
		try {
			const { id: recordID } = req.params;
			res.status(STATUS.CREATED).json({
				ok: true,
				record: await RecordService.getOneRecord(recordID)
			})
		} catch (err) {
			next(err);
		}
	}
	static async getAllRecords(req: Request, res: Response, next: NextFunction) {
		try {
			const { model_alias: modelAlias } = req.params;
			const projectID = (req as any).projectID as string;

			res.status(STATUS.CREATED).json({
				ok: true,
				record: await RecordService.getAllRecords(projectID, modelAlias)
			})
		} catch (err) {
			next(err);
		}
	}
	static async deleteRecord(req: Request, res: Response, next: NextFunction) {
		try {
			const { id: recordID } = req.params;

			res.status(STATUS.CREATED).json({
				ok: true,
				record: await RecordService.deleteRecord(recordID)
			})
		} catch (err) {
			next(err);
		}
	}
	static async deleteRecords(req: Request, res: Response, next: NextFunction) {
		try {
			let recordIDs: Array<string> = req.body.ids;
			res.status(STATUS.CREATED).json({
				ok: true,
				record: await RecordService.deleteRecords(recordIDs)
			})
		} catch (err) {
			next(err);
		}
	}
}

export default Record;