import { NextFunction, Request, Response } from "express";
import FluidError from "../FluidError";
import ProjectService from "./Project.service";
import { IProjectBody } from "./projectInterface";

class Project {
  static async createProject(req: Request, res: Response, next: NextFunction) {
    const { title } = req.body as IProjectBody;
    if (!title) return next(new FluidError("Proivde Project Title", 404));
    res.status(200).json({
      project: await ProjectService.create(title),
    });
  }

  static async getOneProject(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (!id) return next(new FluidError("project id missing", 404));
    res.status(200).json({
      project: await ProjectService.getOneProject(id)
    });
  }

  static async getAllProjects(req: Request, res: Response, next: NextFunction) {
    const userID = '123';
    if (!userID) return next(new FluidError("user id not found", 404));
    res.status(200).json({
      projects: await ProjectService.getAllProjects(userID)
    })
  }
}

export default Project;
