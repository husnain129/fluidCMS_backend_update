import { model, Schema } from "mongoose";
import { IMedia } from './Media.interface';

const mediaSchema = new Schema({
  sm: {
    url: String,
    cdn_id: String,
  },
  md: {
    url: String,
    cdn_id: String,
  },
  raw: {
    url: String,
    cdn_id: String,
  },
});

export default model<IMedia>("Media", mediaSchema);
