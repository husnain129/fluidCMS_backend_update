import { model, Schema } from "mongoose";
import { IModel } from "./Model.interface";

const modelSchema = new Schema<IModel>({
  name: String,
  alias: String,
  project_id: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
});

export default model<IModel>("Model", modelSchema);
