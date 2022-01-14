import ModelDao from './Model.dao'
import FieldDao from '../Field/Field.dao'
import { IFieldReturn } from '../Field/Field.interface'
import { IModelReturn } from './Model.interface'

class ModelService {
	static async createModel(projectID: string, name: string, alias: string) {
		return await ModelDao.createModel(projectID, name, alias)
	}

	static async getOneModel(projectID: string, alias: string) {
		const model = await ModelDao.getOneModel(projectID, alias);
		let fields = await FieldDao.getAllFields(model._id) as IFieldReturn[];
		const modelResponse = { ...model, fields: [...fields] }
		return modelResponse;
	}

	static async getAllModel(projectID: string) {
		const models = await ModelDao.getAllModel(projectID);
		let response: (Omit<IModelReturn, "project_id"> & { fields: Omit<IFieldReturn, "model_id">[] })[] = [];
		await Promise.all(
			models.map(async (m) => {
				if (m.alias) {
					let fields = await FieldDao.getAllFields(m._id) as IFieldReturn[]
					response.push({
						...m,
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
				}
			})
		)
		return response;
	}

	static async deleteModel(projectID: string, alias: string) {
		return await ModelDao.deleteModel(projectID, alias);
	}

	static async updateModel(projectID: string, modelAlias: string, name: string, updatedAlias: string) {
		return await ModelDao.updateModel(projectID, modelAlias, name, updatedAlias);
	}
}

export default ModelService;