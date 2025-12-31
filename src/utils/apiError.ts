import type HttpCodes from "../constants/httpCodes.js";

class ApiError extends Error {
  public status: number;
  public message: string;

  constructor(status: HttpCodes, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default ApiError;
