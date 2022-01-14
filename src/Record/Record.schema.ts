import { model, Schema } from "mongoose";
import { IRecord } from "./Record.interface";

let recordSchema = new Schema({
  _id: String,
  model_id: {
    type: Schema.Types.ObjectId,
    ref: "Model",
    required: true,
  },

  fields: [
    {
      field_id: {
        type: String,
        required: true,
      },
      value: String,
    },
  ],
});

export default model<IRecord>("Record", recordSchema);
