import multer from "multer";
import fs from "fs";

const uploadBasePath = "uploads/rental-applications";

if (!fs.existsSync(uploadBasePath)) {
  fs.mkdirSync(uploadBasePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadBasePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${file.fieldname}-${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, JPEG, PNG, and PDF files are allowed"),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024,
  },
});

const rentalApplicationUpload = upload.fields([
  { name: "nidDocument", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "additionalDocument", maxCount: 1 },
]);

export default rentalApplicationUpload;