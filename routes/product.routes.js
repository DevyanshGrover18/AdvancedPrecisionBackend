import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    updateProduct,
    uploadProductImage
} from '../controllers/product.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = Router();

router.route('/').get(getProducts).post(createProduct);
router.post('/upload-image', isAdmin, upload.single('image'), uploadProductImage);
router
    .route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

export default router;
