import { nanoid } from "nanoid";
import { AccessToken } from "../Types/enums";

export const generateAccessToken = (access: AccessToken) => {
  return {
    token: nanoid(12) as string,
    access_type: access,
  };
};
