import ProjectDao from "./Project.dao";
class ProjectService {
  static async create(title: string) {
    return await ProjectDao.createProject(title);
  }

  static async getOneProject(id:string){
    return await ProjectDao.getOneProject(id);
  }

  static async getAllProjects(userID:string){
    return await ProjectDao.getAllProjects();
  }
}

export default ProjectService;
