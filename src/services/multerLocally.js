import multer from "multer";

export const multerUploadLocally = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("🚀 ~ file: multerLocally.js:6 ~ multerUploadLocally ~ file:", file)
            cb(null, "Uploads/User");
        },
        filename: function (req, file, cb) {
            console.log("🚀 ~ file: multerLocally.js:10 ~ multerUploadLocally ~ file:", file)
            const uniqueFileName = Date.now() + " " + Math.round(Math.random() * 1e9) + "-" + file.originalname;
            cb(null, uniqueFileName);
        },
    });

    const fileUpload = multer({storage});
    console.log("🚀 ~ file: multerLocally.js:17 ~ multerUploadLocally ~ fileUpload:", fileUpload)
    return fileUpload;
}
