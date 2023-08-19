import multer from "multer";
import fs from "fs";
import path from "path";
import { allowedExtensions } from "../utils/allowedExtensions.js";
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(import.meta.url)

export const multerUploadLocally = (allowedExtensionsArr=allowedExtensions.Image, customPath="General") => {

  // const destPath = path.resolve(`uploads/${customPath}`);
  const destPath = path.join(__dirname,`../../uploads/${customPath}`); // to save inside nested folder 

  //================================== Custom Path =============================
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  //================================== Storage =============================
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() +
        " " +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
      // or you can use nanoid library
      // uniqueFileName = nanoid() + " " + file.originalname
      file.finalDest = `uploads/${customPath}`;
      // you must assign this value to the database instead of fle.path
      // 34an mt3ml4 conversions backslashes to slash 3ady
      cb(null, uniqueFileName);
    },
  });

  //================================== File Filter =============================
  const fileFilter = function (req, file, cb) {
    if (allowedExtensionsArr.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error("invalid extension", { cause: 400 }), false);
  };

  //you have to put fileFilter before storage 
  // 34an tt check abl mt5zn
  const fileUpload = multer({
    fileFilter,
    storage,
    // limits: {
    //   //   fields: 2,
    //   //   files: 2,
    // },
  });
  return fileUpload;
};
