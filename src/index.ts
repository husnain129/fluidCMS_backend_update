require("dotenv").config();
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import FluidError from "FluidError";
import { connect } from "mongoose";
import FluidRouter from "./FluidRouter";
// const mongoose = require("mongoose");
connect("mongodb://127.0.0.1:27017/Fluid").then(() =>
  console.log("DB Connected")
);

const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

import("./Project/project.route");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

// -------------MIDDLEEARE------------- //

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(FluidRouter.getInstace());

// -------------MIDDLEEARE END------------- //

app.get("/", (req: Request, res: Response) => {
  // res.sendFile(path.resolve(__dirname, "../src/route.html"));
  res.redirect("https://m-h9.github.io/FluidCMS_documentation/docs/fields/");
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  // let duplicateError =
  //   (error as any).statusCode === 500 &&
  //   error.message.split(" ")[0] === "E11000";

  res.status((error as FluidError).statusCode || 500).json({
    ok: false,
    error: error.message,
  });
  // console.warn(error);
});

const PORT: number = parseInt(process.env.PORT || "3001");

app.listen(PORT, () => console.log(`Server is Listening On PORT ${PORT}...`));
