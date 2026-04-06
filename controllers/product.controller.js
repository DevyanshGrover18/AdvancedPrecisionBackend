import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import { AppError } from '../utils/appError.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProduct = async (req, res) => {
    const product = await Product.create(req.body);

    return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
    });
};

export const getProducts = async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError('Invalid product id', 400);
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return res.status(200).json({
        success: true,
        data: product
    });
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError('Invalid product id', 400);
    }

    const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
    });
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new AppError('Invalid product id', 400);
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
};
