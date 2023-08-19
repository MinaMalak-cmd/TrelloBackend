import multer from "multer";
import { allowedExtensions } from "../utils/allowedExtensions.js";

export const multerCloudUpload = (allowedExtensionsArr = allowedExtensions.Image) => {

  //================================== Storage =============================
  const storage = multer.diskStorage({});

  //================================== File Filter =============================
  const fileFilter = function (req, file, cb) {
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("invalid extension", { cause: 400 }), false);
  };

  const fileUpload = multer({
    fileFilter,
    storage,
  });
  return fileUpload;
};
