
export type APIStatusCode = 200 | 400 | 401 | 404 | 500;

class FluidError extends Error {
  statusCode: APIStatusCode;
  message: string;
  constructor(message: string, statusCode: APIStatusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default FluidError;
