import multer from "multer";
import fs from 'fs';
import path from 'path';

export const multerUploadLocally = (customPath) => {
    if (!customPath) {
        customPath = 'General'
    }
    const destPath = path.resolve(`uploads/${customPath}`);

    if(!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
    }
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destPath);
        },
        filename: function (req, file, cb) {
            const uniqueFileName = Date.now() + " " + Math.round(Math.random() * 1e9) + "-" + file.originalname;
            cb(null, uniqueFileName);
        },
    });
    const fileUpload = multer({storage});
    return fileUpload;
}
