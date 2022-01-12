import { NextFunction, Request, Response } from "express";
import FluidError from "../FluidError";
import ProjectService from "./Project.service";
import { IProjectBody } from "./projectInterface";
import mongoose from 'mongoose';

class Project {
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body as IProjectBody;
      if (!title) return next(new FluidError("Proivde Project Title", 404));
      res.status(200).json({
        project: await ProjectService.create(title),
      });
    } catch (err: any) {
      if (err instanceof mongoose.Error) {
        return next(new FluidError("mongoDB:" + err.message, 404))
      } else {
        return next(new FluidError(err.message, 404))
      }
    }
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

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { title } = req.body;
    if (!id) return next(new FluidError("Id not Provided", 404))
    res.status(200).json({
      message: await ProjectService.updateProject(id, title)
    })
  }
}

export default Project;
