import ModelDao from './Model.dao'
class ModelService{
	static async createModel(projectID:string,name:string,alias:string){
		return await ModelDao.createModel(projectID, name, alias)
	}
}

export default ModelDao;