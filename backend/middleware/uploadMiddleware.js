import fs from 'fs';
import path from 'path';
import os from 'os';
import multer from 'multer';

const uploadDir = path.join(os.tmpdir(), 'climate_uploads');
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
  } catch (e) {
    // Fall back gracefully if creation fails
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fs.existsSync(uploadDir) ? uploadDir : os.tmpdir());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /csv/;
  const mimetype = 
    file.mimetype === 'text/csv' || 
    file.mimetype === 'application/vnd.ms-excel' ||
    file.mimetype === 'application/csv';
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype || extname) {
    return cb(null, true);
  }
  cb(new Error('Only CSV file uploads are allowed!'), false);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
