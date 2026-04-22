import fs from 'fs';
import path from 'path';
import Gallery from '../models/gallery.model.js';
import { AppError } from '../utils/appError.js';

const BASE_URL = 'http://node.advanceprecisionmold.com/uploads/';


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
  try {
    let uploaded = [];

    // single image
    if (req.files?.image) {
      const file = req.files.image[0];
      uploaded.push(BASE_URL + file.filename);
    }

    // multiple images
    if (req.files?.images) {
      const files = req.files.images.map((file) => BASE_URL + file.filename);
      uploaded = [...uploaded, ...files];
    }

    return res.json({
      success: true,
      images: uploaded,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
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

  const image = await Gallery.findById(id);

  if (!image) {
    throw new AppError("Gallery image not found", 404);
  }

  // 🔥 delete from disk
  const filePath = path.join("uploads", image.url.split("/uploads/")[1]);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await image.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Gallery image deleted successfully",
  });
};
