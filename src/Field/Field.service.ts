import { IFieldBody } from './Field.interface';
import FieldDao from './Field.dao';
import ProjectService from '../Project/Project.service';
import ModelDao from '../Model/Model.dao';

class FieldService {
	static async createField({ projectID, modelAlias, name, alias, field_type, validation }: Omit<IFieldBody, "model_id"> & { projectID: string } & { modelAlias: string }) {
		const project = await ProjectService.getOneProject(projectID);
		const model = await ModelDao.getOneModel(project._id, modelAlias);
		return await FieldDao.createField({ model_id: model._id, name, alias, field_type, validation });
	}

	static async getOneField(projectID: string, fieldAlias: string, modelAlias: string) {
		const model = await ModelDao.getOneModel(projectID, modelAlias);
		return await FieldDao.getOneField(fieldAlias, model._id);
	}

	static async getAllFields(modelAlias:string,projectID:string){
		const model = await ModelDao.getOneModel(projectID, modelAlias);
		return await FieldDao.getAllFields(model._id);
	}
}

export default FieldService;