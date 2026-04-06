import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        publicId: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        originalName: {
            type: String,
            default: '',
            trim: true
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
