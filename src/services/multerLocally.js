import multer from "multer";
import fs from 'fs';
import path from 'path';
import { allowedExtensions } from "../utils/allowedExtensions.js";

export const multerUploadLocally = (allowedExtensionsArr, customPath) => {
    if(!allowedExtensionsArr){
        allowedExtensionsArr = allowedExtensions.Image;
    }
    if (!customPath) {
        customPath = 'General'
    }
    const destPath = path.resolve(`uploads/${customPath}`);

    //================================== Custom Path =============================
    if(!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
    }

    //================================== Storage =============================
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destPath);
        },
        filename: function (req, file, cb) {
            const uniqueFileName = Date.now() + " " + Math.round(Math.random() * 1e9) + "-" + file.originalname;
            cb(null, uniqueFileName);
        },
    });

    //================================== File Filter =============================
    const fileFilter = function (req, file, cb) {
        if (allowedExtensionsArr.includes(file.mimetype)) {
          return cb(null, true)
        }
        cb(new Error('invalid extension', { cause: 400 }), false)
      }
    
    const fileUpload = multer({
    fileFilter,
    storage,
    // limits: {
    //   //   fields: 2,
    //   //   files: 2,
    // },
    })
    return fileUpload;
}
