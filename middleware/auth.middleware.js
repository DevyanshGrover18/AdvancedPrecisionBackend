import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import { AppError } from '../utils/appError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';

export const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Authorization token is required', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            throw new AppError('Admin not found', 404);
        }

        req.admin = admin;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Invalid or expired token', 401);
    }
};
