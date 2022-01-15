import ModelDao from '../Model/Model.dao'
import RecordDao from './Record.dao'

class RecordService {
	static async createRecord(recordBody: { [key: string]: string }, projectID: string, modelAlias: string) {
		const model = await ModelDao.getOneModel(projectID, modelAlias);
		return await RecordDao.createRecord(recordBody, projectID, model._id);
	}

	static async getOneRecord(recordID:string){
		return await RecordDao.getOneRecord(recordID);
	}

	static async getAllRecords(projectID: string, modelAlias: string) {
		return await RecordDao.getAllRecords(projectID, modelAlias);
	}
}

export default RecordService;