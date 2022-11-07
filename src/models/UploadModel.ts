import mongoose, { Schema } from "mongoose";

export const UploadModel = mongoose.model('upload', new Schema({
    description: { type: String, required: true },
    file_name: { type: [String], required: true },
    file_extension: { type: [String], required: true },
    storage_location: { type: String, required: true, enum: ['locally', 'external_service'] },
},
    {
        timestamps: true
    }
));