import express from "express";
class FluidRouter {
  private static instance: express.Router;
  static getInstace(): express.Router {
    if (!FluidRouter.instance) {
      FluidRouter.instance = express.Router();
    }
    return FluidRouter.instance;
  }
}

export default FluidRouter;
