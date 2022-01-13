import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  passwordConfirm: string;
  created_at: Date;
  profile: {
    thumb: {
      url: string;
      cdn_url: string;
    };
    profile_img: {
      url: string;
      cdn_url: string;
    };
  };
  token: string;
  matchPassword: (
    candidataPassword: string,
    userPassword: string
  ) => Promise<boolean>;
}


export interface IUserBody {
  email: IUser["email"];
  first_name: IUser["first_name"];
  last_name: IUser["last_name"];
  password: IUser["password"];
  passwordConfirm: IUser["passwordConfirm"];
  profile: IUser["profile"];
}

export interface IUserReturn {
  _id: string;
  first_name: IUser["first_name"];
  last_name: IUser["last_name"];
  profile: IUser["profile"];
  token:string,
  created_at: string
}