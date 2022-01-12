import FluidError from "../FluidError";
import { AccessToken } from "../Types/enums";
import { generateAccessToken } from "./../utils/generateAccessToken";
import Project from "./project.schema";
import { IProjectReturn, TAccess } from "./projectInterface";
import moment from 'moment';
class ProjectDao {
  static async createProject(title: string): Promise<IProjectReturn> {
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
  }

  static async getOneProject(id: string): Promise<IProjectReturn> {
    const project = await Project.findById(id);
    if (!project) new FluidError("Project not found", 404);
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
  }

  static async getAllProjects(userID: string = "123"): Promise<IProjectReturn[]> {
    const projects = await Project.find({ user_id: userID }).select("-__v");
    if (!projects) new FluidError("Projects not found", 404);
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
    }))
    return projectRefactor;
  }

  static async updateProject(projectID: string, title: string) {
    const project = await Project.findById(projectID);
    if (!project) new FluidError("Project not found", 404);
    project!.title = title;
    await project!.save();
    return "Project updated";
  }
}

export default ProjectDao;
