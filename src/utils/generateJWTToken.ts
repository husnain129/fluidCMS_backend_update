const jwt = require("jsonwebtoken");

const generateJWTToken = (id: string): string => {
  return jwt.sign({ id }, "" + process.env.JWT_SECRET || "");
};

export default generateJWTToken;