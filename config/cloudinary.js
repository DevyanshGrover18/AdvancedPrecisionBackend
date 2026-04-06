import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

export const isCloudinaryConfigured = Boolean(
    cloudName && apiKey && apiSecret
);

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });
} else {
    const missingKeys = [
        !cloudName ? 'CLOUDINARY_CLOUD_NAME' : null,
        !apiKey ? 'CLOUDINARY_API_KEY' : null,
        !apiSecret ? 'CLOUDINARY_API_SECRET' : null
    ].filter(Boolean);

    console.warn(
        `Cloudinary is not configured. Missing env vars: ${missingKeys.join(', ')}`
    );
}

export default cloudinary;
