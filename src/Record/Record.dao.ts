import { nanoid } from 'nanoid';
import Record from './Record.schema'
import { IFieldReturn } from '../Field/Field.interface'
import FieldDao from "../Field/Field.dao";
import Model from "../Model/Model.schema";
import Field from "../Field/Field.schema";
import { IRecord, RecordField, IRecordBody } from './Record.interface';
import FluidError from "../FluidError";
import { STATUS } from '../Types/enums';
import mongoose from 'mongoose';

class RecordDao {

	private static async getFieldAlias(id: string): Promise<string> {
		let field = await Field.findOne({ _id: id }) as IFieldReturn;
		return field.alias
	}

	static async createRecord(recordBody: { [key: string]: string }, projectID: string, modelID: string) {
		try {
			let record = new Record({
				model_id: modelID,
				_id: nanoid(10) as string,
			}) as IRecord;

			let schemafields = await FieldDao.getAllFields(modelID);

			record.fields = schemafields.map((f) => {
				return {
					field_id: f._id as string,
					value: "",
				};
			});

			let fieldAliases: { [fieldID: string]: string } = {}; //fieldId to alias map

			await Promise.all(
				Object.keys(recordBody).map(async (e: string) => {
					let field = await FieldDao.getOneField(e, modelID);

					// ToDo- Validate if field eID exists in model
					let fieldInd = record.fields.findIndex(
						(f: any) => f.field_id == field?._id
					) as any;

					if (fieldInd === -1)
						throw new FluidError("Field " + e + "doesn't exists on model", STATUS.BAD_REQUEST)

					let recordField = record.fields[fieldInd];
					fieldAliases[recordField.field_id] = field.alias;
					record.fields[fieldInd] = {
						field_id: recordField.field_id,
						value: recordBody[e],
					};
				})
			);

			await record.save();
			const recordResponse = {
				_id: record._id,
				model_id: record.model_id,
				fields: record.fields.map((_r: RecordField) => {
					return {
						field_id: _r.field_id,
						[fieldAliases[_r.field_id]]: _r.value,
					};
				}),
			}
			return recordResponse;

		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async getOneRecord(recordID: string): Promise<{ model_id: string, model_alias: string, fields: { [key: string]: string } }> {
		try {
			console.log("getOneRecord")

			const record = await Record.findById(recordID).select("-__v");

			if (!record) throw new FluidError("Record Not found", STATUS.BAD_REQUEST);

			let model = await Model.findOne({ _id: record.model_id });
			if (!model) throw new FluidError("Model Not found", STATUS.BAD_REQUEST);

			let fieldsObj: { [key: string]: string } = {};

			for (let f of record.fields) {
				fieldsObj[await this.getFieldAlias(f.field_id)] = f.value;
			}
			return {
				model_id: record.model_id,
				model_alias: model.alias,
				fields: fieldsObj
			}
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}

	}

	static async getAllRecords(projectID: string, modelAlias: string) {
		try {
			let model = await Model.findOne({
				alias: modelAlias,
				project_id: projectID,
			});

			if (!model) throw new FluidError("Model Not found", STATUS.BAD_REQUEST);

			const records = await Record.find({
				model_id: model._id,
			}).select("-__v");

			if (!records) throw new FluidError("Record Not found", STATUS.BAD_REQUEST);

			// GET DATA IN FOMRATED FORM
			let respo: { recordID: string, fields: { [key: string]: string } }[] = await Promise.all(
				records.map(async (e: IRecordBody & { _id: string }) => {
					let fields: { [key: string]: string } = {};
					for (let i of e.fields) {
						let alias = await this.getFieldAlias(i.field_id);
						if (alias) {
							fields[alias] = i.value;
						}
					}
					return {
						recordID: e._id,
						fields,
					};
				})
			);

			return respo;

		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async deleteRecord(recordID: string) {
		try {
			const record = await Record.findOne({ _id: recordID });
			if (!record) throw new FluidError("record not found", STATUS.BAD_REQUEST);
			await record.remove();
			return 'Record deleted'
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async deleteRecords(recordIDs: Array<string>) {
		try {
			if (!recordIDs) throw new FluidError("Missing ids in body", STATUS.BAD_REQUEST);
			await Record.deleteMany({ _id: { $in: recordIDs } });
			return "Records deleted";
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

}


export default RecordDao;