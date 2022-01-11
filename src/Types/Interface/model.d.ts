import { Document } from "mongoose";

export interface IModel extends Document {
  _id?: string;
  name: String;
  alias: string;
  project_id?: string;
}

export interface IModelFields {
  name: IModel["name"];
  alias: IModel["alias"];
  project_id: IModel["project_id"];
}
