import { NextFunction, Request, Response } from "express";
import FluidError from "../FluidError";
import ProjectService from "./Project.service";
import { IProjectBody } from "./Project.interface";
import mongoose from 'mongoose';
import { STATUS } from '../Types/enums';

class Project {
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body as IProjectBody;
      if (!title) return next(new FluidError("Proivde Project Title", 404));
      res.status(STATUS.OK).json({
        ok: true,
          project: await ProjectService.create(title),
      });
    } catch (err) {
      next(err)
    }
  }

  static async getOneProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return next(new FluidError("project id missing", 404));
      res.status(STATUS.OK).json({
        ok: true,
        project: await ProjectService.getOneProject(id)
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const userID = '123';
      if (!userID) return next(new FluidError("user id not found", 404));
      res.status(STATUS.OK).json({
        ok: true,
        projects: await ProjectService.getAllProjects(userID)
      })
    } catch (err) {
      next(err)
    }
  }

  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      if (!id) return next(new FluidError("Id not Provided", 404))
      res.status(STATUS.OK).json({
        ok: true,
        message: await ProjectService.updateProject(id, title)
      })
    } catch (err) {
      next(err)
    }
  }

  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    try {
      res.status(STATUS.OK).json({
        ok: true,
        message: ProjectService.deleteProject(id)
      })
    } catch (err) {
      next(err);
    }
  }
}

export default Project;
