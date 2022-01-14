import { Document } from 'mongoose';

export interface RecordField {
  field_id: string;
  value: string;
}


export interface IRecord extends Document {
  _id: string;
  model_id: string;
  fields: [RecordField];
}

export interface IRecordFields {
  _id: IRecord["_id"];
  model_id: IRecord["model_id"];
  fields: IRecord["fields"];
}
