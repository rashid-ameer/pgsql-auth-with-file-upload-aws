import multer from "multer";

import { storage, limits, allowedFilesTypes } from "../config/multer.js";
import ApiError from "../utils/apiError.js";
import HTTP_CODES from "../constants/httpCodes.js";

const upload = multer({
  storage,
  limits,
  fileFilter(_, file, callback) {
    if (!allowedFilesTypes.includes(file.mimetype)) {
      return callback(
        new ApiError(HTTP_CODES.BAD_REQUEST, "Uploaded invalid file type.")
      );
    }
    callback(null, true);
  },
});

export default upload;
