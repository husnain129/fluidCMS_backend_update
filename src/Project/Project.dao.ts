import FluidError from "../FluidError";
import { AccessToken, STATUS } from "../Types/enums";
import { generateAccessToken } from "./../utils/generateAccessToken";
import { IProjectReturn, TAccess } from "./Project.interface";
import Project from "./Project.schema";

class ProjectDao {
  static async createProject(title: string): Promise<IProjectReturn> {
    try {
      const project = new Project({
        user_id: "123",
        title,
        access_tokens: [
          generateAccessToken(AccessToken.READ),
          generateAccessToken(AccessToken.FULL),
        ],
      });
      await project.save();
      return {
        _id: project._id,
        title: project.title,
        created_at: project.created_at.toISOString(),
        access_tokens: project.access_tokens.map((e: TAccess) => {
          return {
            token: e.token,
            access_type: e.access_type,
          };
        }),
      };
    } catch (err: any) {
      throw new FluidError(err.message, STATUS.NOT_FOUND);
    }
  }

  static async getOneProject(id: string): Promise<IProjectReturn> {
    try {
      const project = await Project.findById(id);
      if (!project) throw new FluidError("Project not found", STATUS.NOT_FOUND);
      return {
        _id: project!._id,
        title: project!.title,
        created_at: project!.created_at.toISOString(),
        access_tokens: project!.access_tokens.map((e: TAccess) => {
          return {
            token: e.token,
            access_type: e.access_type,
          };
        }),
      };
    } catch (err: any) {
      throw new FluidError(err, STATUS.NOT_FOUND);
    }
  }

  static async getAllProjects(userID: string): Promise<IProjectReturn[]> {
    try {
      const projects = await Project.find({ user_id: userID }).select("-__v");
      if (!projects)
        throw new FluidError("Projects not found", STATUS.NOT_FOUND);

      const projectRefactor = projects.map((p) => ({
        _id: p._id,
        title: p.title,
        created_at: p.created_at.toISOString(),
        access_tokens: p.access_tokens.map((t: TAccess) => {
          return {
            token: t.token,
            access_type: t.access_type,
          };
        }),
      }));
      return projectRefactor;
    } catch (err: any) {
      throw new FluidError(err, STATUS.NOT_FOUND);
    }
  }

  static async updateProject(projectID: string, title: string) {
    try {
      const project = await Project.findById(projectID);
      if (!project) throw new FluidError("Project not found", STATUS.NOT_FOUND);
      project!.title = title;
      await project!.save();
      return "Project updated";
    } catch (err: any) {
      throw new FluidError(err, STATUS.NOT_FOUND);
    }
  }

  static async deleteProject(projectID: string) {
    try {
      let project = await Project.findById(projectID);
      if (!project) throw new FluidError("Project not found", STATUS.NOT_FOUND);
      await project.remove();
      return "Project deleted";
    } catch (err: any) {
      throw new FluidError(err, STATUS.NOT_FOUND);
    }
  }
}

export default ProjectDao;
