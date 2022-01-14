import { NextFunction, Request, Response } from "express";
import { AccessToken } from "../Types/enums";
import FluidError from "../FluidError";
import Project from "../Project/Project.schema";
import { STATUS } from '../Types/enums'

const access = (requiredAccess: AccessToken) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token: any;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new FluidError("API token is required.", STATUS.BAD_REQUEST));
    }

    let TokenAccess = async () => {
      let type = await Project.find().select("_id access_tokens");
      let t: any = null;
      type.map((item: any) => {
        let p = item.access_tokens.find((_t: any) => {
          if (token === _t.token) {
            return true;
          }
          return false;
        });
        if (p) {
          t = {
            project_id: item._id,
            type: p.access_type,
          };
        }
      });
      return t;
    };
    let project = await TokenAccess();
    if (!project) {
      return next(new FluidError("Invalid token", STATUS.UNAUTHORIZE));
    }

    let accessType = project?.type;
    if (accessType === null) return next(new FluidError("Invalid token.", STATUS.BAD_REQUEST));

    (req as any).projectID = project.project_id;

    if (accessType === AccessToken.FULL) {
      next();
      return;
    }
    if (
      accessType === AccessToken.READ &&
      requiredAccess === AccessToken.FULL
    ) {
      return next(new FluidError("Permission denied.", STATUS.UNAUTHORIZE));
    }
    next();
  };
};

export default access;