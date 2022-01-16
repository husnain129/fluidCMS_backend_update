import ModelDao from './Model.dao'
import FieldDao from '../Field/Field.dao'
import RecordDao from '../Record/Record.dao'
import FieldService from '../Field/Field.service'
import { IFieldReturn } from '../Field/Field.interface'
import { IModelReturn } from './Model.interface'

class ModelService {
	static async createModel(projectID: string, name: string, alias: string) {
		return await ModelDao.createModel(projectID, name, alias)
	}

	static async getOneModel(projectID: string, alias: string) {
		return await ModelDao.getOneModel(projectID, alias);
	}

	static async getAllModel(projectID: string) {
		return await ModelDao.getAllModel(projectID);
	}

	static async deleteModel(projectID: string, modelAlias: string) {
		const fields = await FieldService.getAllFields(modelAlias, projectID);
		const records = await RecordDao.getAllRecords(projectID,modelAlias);
		await Promise.all(
			fields.map(async (f) => {
				await FieldService.deleteField(projectID, modelAlias, f.alias);
			})
		)
		
		await Promise.all(
			records.map(async (f) => {
				await RecordDao.deleteRecord(f.recordID);
			})
		)

		return await ModelDao.deleteModel(projectID, modelAlias);
	}

	static async updateModel(projectID: string, modelAlias: string, name: string, updatedAlias: string) {
		return await ModelDao.updateModel(projectID, modelAlias, name, updatedAlias);
	}
}

export default ModelService;