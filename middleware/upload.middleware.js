import multer from 'multer';
import { AppError } from '../utils/appError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        cb(null, true);
        return;
    }

    cb(new AppError('Only image files are allowed', 400), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default upload;
