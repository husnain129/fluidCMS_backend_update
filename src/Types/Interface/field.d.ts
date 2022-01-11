import { Document } from "mongoose";
import { FieldType } from "Types/enums";
export interface IField extends Document {
  _id?: string;
  name: string;
  model_id?: string;
  alias: string;
  field_type: FieldType;
  validation: {
    isRequired: boolean;
    regex: string;
  };
}

export interface IFieldFields {
  _id?: IField["_id"];
  name: IField["name"];
  model_id: IField["model_id"];
  alias: IField["alias"];
  field_type: IField["field_type"];
  validation: IField["validation"];
}
