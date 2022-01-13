import { Document } from 'mongoose';

export interface IModel extends Document {
  name: String;
  alias: string;
  project_id?: string;
}


export interface IModelReturn {
  model_id:string;
  name: IModel["name"];
  alias: IModel["alias"];
  project_id: IModel["project_id"];
}

export interface IModelBody {
  name: IModel["name"];
  alias: IModel["alias"];
}
