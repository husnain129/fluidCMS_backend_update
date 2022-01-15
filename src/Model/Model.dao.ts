import Model from './Model.schema';
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums';
import mongoose from 'mongoose';
import { IModelReturn } from "./Model.interface";
import ProjectService from '../Project/Project.service'
import FieldService from '../Field/Field.service';
import { IFieldReturn } from "../Field/Field.interface";
import FieldDao from '../Field/Field.dao'

type TModelResponse = Omit<IModelReturn, "project_id"> & { fields: IFieldReturn[] };

class ModelDao {
	static async createModel(projectID: string, name: string, alias: string): Promise<{ model_id: string }> {
		try {
			const existModelAlias = await Model.find({
				project_id: projectID,
				alias: alias,
			});
			if (existModelAlias.length > 0) throw new FluidError("Model exist", STATUS.BAD_REQUEST)
			const model = new Model({
				name,
				alias,
				project_id: projectID
			})
			await model.save();
			return {
				model_id: model._id
			}
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async getOneModel(projectID: string, modelAlias: string): Promise<TModelResponse> {
		try {
			const model = await Model.findOne({
				projectID,
				alias: modelAlias,
			});
			if (!model) throw new FluidError("Model not found", STATUS.BAD_REQUEST);
			let fields = await FieldDao.getAllFields(model._id) as IFieldReturn[];
			const modelResponse: TModelResponse = {
					_id:model._id,
					name: model.name,
					alias: model.alias,
					fields: [...fields],	
			}
			return modelResponse;
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async getAllModel(projectID: string): Promise<Omit<IModelReturn, "project_id">[]> {
		try {
			const project = await ProjectService.getOneProject(projectID);
			const models = await Model.find({
				project_id: project._id,
			});

			if (!models) throw new FluidError("Models not found", STATUS.BAD_REQUEST);
			let response: (Omit<IModelReturn, "project_id"> & { fields: Omit<IFieldReturn, "model_id">[] })[] = [];

			await Promise.all(
				models.map(async (m) => {
					let fields = await FieldDao.getAllFields(m._id) as IFieldReturn[]
					response.push({
						_id: m._id,
						name: m.name,
						alias: m.alias,
						fields: fields.map((_f) => {
							return {
								_id: _f._id,
								name: _f.name,
								alias: _f.alias,
								field_type: _f.field_type,
								validation: _f.validation,
							};
						}),
					})
				})
			)

			return response;
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async deleteModel(projectID: string, alias: string) {
		try {
			const model = await Model.findOne({ alias, project_id: projectID })
			if (!model) throw new FluidError("Model not found", STATUS.BAD_REQUEST);
			model.remove()
			return "Delete"
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}

	static async updateModel(projectID: string, modelAlias: string, name: string, updatedAlias: string) {
		try {
			const model = await Model.findOne({
				project_id: projectID,
				alias: modelAlias,
			});

			if (!model) throw new FluidError("Model not found", STATUS.BAD_REQUEST);

			model.name = name || model.name;
			model.alias = updatedAlias || model.alias;
			await model.save();
			return "Model Updated"
		} catch (err: any) {
			if (err instanceof mongoose.Error) {
				throw new FluidError(err.message, STATUS.BAD_REQUEST);
			} else {
				throw new FluidError(err, STATUS.INTERNAL_SERVER_ERROR);
			}
		}
	}
}

export default ModelDao;