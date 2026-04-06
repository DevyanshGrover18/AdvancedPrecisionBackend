import { Router } from 'express';
import {
    deleteGalleryImage,
    getGalleryImages,
    uploadGalleryImages
} from '../controllers/gallery.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router
    .route('/')
    .get(getGalleryImages)
    .post(
        isAdmin,
        upload.fields([
            { name: 'image', maxCount: 1 },
            { name: 'images', maxCount: 10 }
        ]),
        uploadGalleryImages
    );
router.delete('/:id', isAdmin, deleteGalleryImage);

export default router;
