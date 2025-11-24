import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { generateKey } from "../utils/common.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const storage = multer.diskStorage({
  destination(_, __, callback) {
    const folderPath = path.join(__dirname, "../uploads");
    callback(null, folderPath);
  },
  filename(_, file, callback) {
    const uniqueSuffix = generateKey();
    callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const multerErrorMessages: Record<string, string> = {
  LIMIT_PART_COUNT: "Too many form fields were sent.",
  LIMIT_FILE_SIZE: "The uploaded file is too large.",
  LIMIT_FILE_COUNT: "Too many files were uploaded.",
  LIMIT_FIELD_KEY: "The form field name is too long.",
  LIMIT_FIELD_VALUE: "The form field value is too long.",
  LIMIT_FIELD_COUNT: "Too many form fields were sent.",
  LIMIT_UNEXPECTED_FILE: "An unexpected file was uploaded.",
  MISSING_FIELD_NAME: "A required file field is missing.",
};

export const allowedFilesTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const limits = { fileSize: 5 * 1024 * 1024 };
