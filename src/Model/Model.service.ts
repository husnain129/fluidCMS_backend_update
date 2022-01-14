import ModelDao from './Model.dao'
class ModelService{
	static async createModel(projectID:string,name:string,alias:string){
		return await ModelDao.createModel(projectID, name, alias)
	}

	static async getOneModel(projectID:string,alias:string){
		return await ModelDao.getOneModel(projectID, alias);
	}

	static async getAllModel(projectID: string){
		console.log("projectID",projectID)
		return await ModelDao.getAllModel(projectID);
	}

	static async deleteModel(projectID:string, alias: string) {
		return await ModelDao.deleteModel(projectID, alias);
	}

	static async updateModel(projectID: string, modelAlias:string,name:string,updatedAlias:string){
		return await ModelDao.updateModel(projectID, modelAlias, name, updatedAlias);
	}
}

export default ModelDao;