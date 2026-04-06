import { Readable } from 'node:stream';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import Gallery from '../models/gallery.model.js';
import { AppError } from '../utils/appError.js';

const uploadStream = (buffer, folder) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        Readable.from([buffer]).pipe(stream);
    });

const normalizeFiles = (req) => {
    if (Array.isArray(req.files) && req.files.length > 0) {
        return req.files;
    }

    if (req.files && typeof req.files === 'object') {
        const files = [];

        if (Array.isArray(req.files.image)) {
            files.push(...req.files.image);
        }

        if (Array.isArray(req.files.images)) {
            files.push(...req.files.images);
        }

        return files;
    }

    if (req.file) {
        return [req.file];
    }

    return [];
};

export const uploadGalleryImages = async (req, res) => {
    const files = normalizeFiles(req);

    if (files.length === 0) {
        throw new AppError('At least one image file is required', 400);
    }

    if (!isCloudinaryConfigured) {
        throw new AppError('Cloudinary is not configured', 500);
    }

    const uploadedImages = await Promise.all(
        files.map(async (file) => {
            const result = await uploadStream(file.buffer, 'gallery');

            return Gallery.create({
                imageUrl: result.secure_url,
                publicId: result.public_id,
                originalName: file.originalname,
                uploadedBy: req.admin?._id || null
            });
        })
    );

    return res.status(201).json({
        success: true,
        message: 'Images uploaded successfully',
        count: uploadedImages.length,
        data: uploadedImages
    });
};

export const getGalleryImages = async (req, res) => {
    const images = await Gallery.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: images.length,
        data: images
    });
};

export const deleteGalleryImage = async (req, res) => {
    const { id } = req.params;

    if (!isCloudinaryConfigured) {
        throw new AppError('Cloudinary is not configured', 500);
    }

    const image = await Gallery.findById(id);

    if (!image) {
        throw new AppError('Gallery image not found', 404);
    }

    await cloudinary.uploader.destroy(image.publicId, {
        resource_type: 'image'
    });

    await image.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Gallery image deleted successfully'
    });
};
