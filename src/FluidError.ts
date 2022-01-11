class FluidError extends Error {
  status: string;
  statusCode: number;
  constructor(msg: string, statusCode: number) {
    super(msg);
    this.statusCode = statusCode;
    this.status = `${msg}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}
export default FluidError;
