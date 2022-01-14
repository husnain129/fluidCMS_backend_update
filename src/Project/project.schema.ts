import mongoose, { model, Schema } from "mongoose";
import { IProject } from "./Project.interface";

const projectSchema = new Schema({
  user_id: {
    type: String,
    default: "husnain",
  },

  title: {
    type: String,
    required: true,
  },
  access_tokens: [{ token: String, access_type: Number }],

  created_at: {
    type: Date,
    default: Date.now,
  },
});


export default model<IProject>("Project",projectSchema);