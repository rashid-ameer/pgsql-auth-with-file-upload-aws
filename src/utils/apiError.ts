import type ERROR_CODES from "../constants/errorCodes.js";
import HTTP_ERRORS from "../constants/httpCodes.js";

class ApiError extends Error {
  public status: number;
  public message: string;
  public errorCode: ERROR_CODES | undefined;

  constructor(status: HTTP_ERRORS, message: string, errorCode?: ERROR_CODES) {
    super(message);
    this.status = status;
    this.message = message;
    this.errorCode = errorCode;
  }
}

export default ApiError;
