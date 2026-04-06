import { Router } from 'express';
import {
    login,
    signup,
    updatePassword
} from '../controllers/admin.controller.js';
import { isAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-password', isAdmin, updatePassword);

export default router;
