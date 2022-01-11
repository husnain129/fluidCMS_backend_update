import { Document } from "mongoose";
import { AccessToken } from "../Types/enums";

export interface IProject extends Document {
  _id: string;
  user_id?: string;
  title: string;
  created_at: Date;
  access_tokens: {
    token: string;
    access_type: AccessToken;
  }[];
}

export interface IProjectReturn {
  _id: IProject["_id"];
  title: IProject["title"];
  created_at: string;
  access_tokens: IProject["access_tokens"];
}

export interface IProjectBody {
  title: IProject["title"];
}
