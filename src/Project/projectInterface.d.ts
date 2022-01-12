import { Document } from "mongoose";
import { AccessToken } from "../Types/enums";

export type TAccess = {
  token: string;
  access_type: AccessToken;
}

export interface IProject extends Document {
  user_id: string;
  title: string;
  created_at: Date;
  access_tokens: TAccess[];
}

export interface IProjectReturn {
  _id: string;
  title: IProject["title"];
  created_at: string;
  access_tokens: IProject["access_tokens"];
}

export interface IProjectBody {
  title: IProject["title"];
}
