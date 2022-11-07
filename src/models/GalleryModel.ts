import mongoose, { Schema } from "mongoose";

export const GalleryModel = mongoose.model('gallery', new Schema({
    file_name: { type: String, required: true },
    upload_url: { type: String, required: true }
}));