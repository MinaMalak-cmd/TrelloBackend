import multer from "multer";
import fs from 'fs';
import path from 'path';
import { allowedExtensions } from "../utils/allowedExtensions.js";

export const multerCloudUpload = (allowedExtensionsArr) => {
    if(!allowedExtensionsArr){
        allowedExtensionsArr = allowedExtensions.Image;
    }

    //================================== Storage =============================
    const storage = multer.diskStorage();

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
