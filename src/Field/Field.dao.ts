import { IFieldBody, IFieldReturn } from './Field.interface';
import ProjectService from '../Project/Project.service';
import ModelService from '../Model/Model.service';
import Record from '../Record/Record.schema';
import Field from './Field.schema'
import FluidError from '../FluidError';
import { STATUS, FieldType } from '../Types/enums';
import mongoose from 'mongoose';

class FieldDao {
	static async createField({ model_id, name, alias, field_type, validation }: IFieldBody): Promise<{ field_id: string }> {
		try {
			let exitFields = await Field.find({ model_id: model_id });
			let existAlias = exitFields.find((f) => f.alias === alias);

			if (existAlias)
				throw new FluidError(`Already exists`, STATUS.BAD_REQUEST);


			const field = new Field({
				model_id: model_id,
				name: name,
				alias: alias,
				field_type: field_type as FieldType,
				validation: validation,
			});

			await field.save();

			// update all the records of this model

			if (field._id) {
				let records = await Record.find({ model_id: model_id });
				if (records && records.length > 0) {
					for (let r of records) {
						r.fields.push({
							field_id: field._id,
							value: "",
						});
						r.save();
					}
				}
			}

			return { field_id: field._id }

		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async getOneField(fieldAlias: string, modelID: string): Promise<IFieldReturn> {

		try {
			let field = await Field.findOne({
				alias: fieldAlias,
				model_id: modelID,
			});

			if (!field) throw new FluidError(`Field not found`, STATUS.BAD_REQUEST);
			return {
				_id: field._id,
				model_id: field.model_id,
				name: field.name,
				alias: field.alias,
				field_type: field.field_type as FieldType,
				validation: field.validation,
			}
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}

	}

	static async getAllFields(modelID: string): Promise<Omit<IFieldReturn, "model_id">[]> {
		try {
			let fields = await Field.find({ model_id: modelID });
			if (!fields) throw new FluidError(`Fields not found`, STATUS.BAD_REQUEST);
			const fieldsResponse = fields.map((val: any) => {
				return {
					_id: val._id,
					name: val.name,
					alias: val.alias,
					field_type: val.field_type as FieldType,
					validation: val.validation,
				};
			});
			return fieldsResponse;
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async deleteField(modelID: string, fieldAlias: string) {
		let field = await Field.findOne({ alias:fieldAlias, modelID });
		if (!field) throw new FluidError( `Field not found`,STATUS.BAD_REQUEST);
		let record = await Record.find({ model_id: field.model_id });

		await Promise.all(
			record.map(async (val: any, ind: number) => {
				record[ind].fields = val.fields.filter((val: any) => {
					return val.field_id.toString() !== field?._id?.toString();
				});
				await record[ind].save();
			})
		);
		await Field.deleteOne({ _id: field._id });
		return "Field deleted"
	}
}


export default FieldDao;