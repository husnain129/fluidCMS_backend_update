import { model, Schema } from "mongoose";
import { IField } from "./Field.interface";

const fieldSchema = new Schema({
  model_id: {
    type: Schema.Types.ObjectId,
    ref: "Model",
  },
  name: {
    type: String,
  },
  alias: {
    type: String,
  },
  field_type: Number,

  validation: {
    isRequired: {
      type: Boolean,
      default: false,
    },
    regex: {
      type: String,
      default: "",
    },
  },
});

export default model<IField>("Field", fieldSchema);
