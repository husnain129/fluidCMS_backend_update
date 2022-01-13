import Model from './Model.schema';
import FluidError from '../FluidError';
import { STATUS } from '../Types/enums';
import mongoose from 'mongoose';
import { IModelReturn } from "./Model.interface";

class ModelDao {
	static async createModel(projectID: string, name: string, alias: string):Promise<Pick<IModelReturn,"model_id">>{
		try {
			const existModelAlias = await Model.find({
				projectID,
				alias: alias,
			});
			if (existModelAlias.length > 0) throw new FluidError("Model exist", STATUS.BAD_REQUEST)
			const model = new Model({
				name,
				alias,
				projectID
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
}

export default ModelDao;