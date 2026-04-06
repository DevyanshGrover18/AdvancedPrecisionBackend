import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import { AppError } from '../utils/appError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (adminId) =>
    jwt.sign({ adminId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });

const sanitizeAdmin = (admin) => {
    const adminData = admin.toObject ? admin.toObject() : admin;
    delete adminData.password;
    return adminData;
};

export const signup = async (req, res) => {
    const { username, password } = req.body;

    if ( !username || !password) {
        throw new AppError('Name, username and password are required', 400);
    }

    const normalizedUsername = username.toLowerCase();

    const existingAdmin = await Admin.findOne({ username: normalizedUsername });

    if (existingAdmin) {
        throw new AppError('Admin already exists', 409);
    }

    const admin = await Admin.create({
        username: normalizedUsername,
        password
    });

    const token = generateToken(admin._id);

    return res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        token,
        data: sanitizeAdmin(admin)
    });
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new AppError('Username and password are required', 400);
    }

    const admin = await Admin.findOne({ username: username.toLowerCase() }).select(
        '+password'
    );

    if (!admin) {
        throw new AppError('Invalid username or password', 401);
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
        throw new AppError('Invalid username or password', 401);
    }

    const token = generateToken(admin._id);

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        data: sanitizeAdmin(admin)
    });
};

export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400);
    }

    const admin = await Admin.findById(req.admin._id).select('+password');

    if (!admin) {
        throw new AppError('Admin not found', 404);
    }

    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
    }

    admin.password = newPassword;
    await admin.save();

    const token = generateToken(admin._id);

    return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
        token,
        data: sanitizeAdmin(admin)
    });
};
