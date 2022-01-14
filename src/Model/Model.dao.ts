import Model from './Model.schema';
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums';
import mongoose from 'mongoose';
import { IModelReturn } from "./Model.interface";
import ProjectService from '../Project/Project.service'

class ModelDao {
	static async createModel(projectID: string, name: string, alias: string): Promise<Pick<IModelReturn, "model_id">> {
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

	static async getOneModel(projectID: string, modelAlias: string): Promise<Partial<IModelReturn>> {
		const model = await Model.findOne({
			projectID,
			alias: modelAlias,
		});

		if (!model) throw new FluidError("Model not found", STATUS.BAD_REQUEST);
		return {
			name: model.name,
			alias: model.alias
		}
	}

	static async getAllModel(projectID: string): Promise<Partial<IModelReturn>[]> {
		try {
			const project = await ProjectService.getOneProject(projectID);
			const models = await Model.find({
				project_id: project._id,
			});

			if (!models) throw new FluidError("Models not found", STATUS.BAD_REQUEST);

			let response = models.map((m) => {
				return {
					_id: m._id,
					name: m.name,
					alias: m.alias,
				}
			})
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