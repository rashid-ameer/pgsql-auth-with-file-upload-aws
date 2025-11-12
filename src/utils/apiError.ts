import HTTP_ERRORS from "../constants/httpCodes.js";

class ApiError extends Error {
  public status: number;
  public message: string;

  constructor(status: HTTP_ERRORS, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default ApiError;
