import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { UploadModel } from '../models/UploadModel';

export class UploadController {
    static async uploadFile(req: Request, res: Response, next: NextFunction) {
        const { description } = req.body;

        if (!req.description) {
            return res.status(400).json({
                error: 'Insira uma description !'
            });
        }

        if (!req.uploaded) {
            return res.status(400).json({
                error: 'Formato de arquivo inválido !'
            });
        }

        // Tipei DIRETAMENTE para Tipar também no map, porque sem isso NÃO estava !! <<
        const requestFiles = req.files as Express.Multer.File[];

        const filenameArray = requestFiles!.map(files => files.filename);

        const fileExtensionArray = filenameArray.map((names, index) => `${index + 1}_${path.extname(names)}`);

        const saveUpload = new UploadModel({
            description,
            file_name: filenameArray,
            file_extension: fileExtensionArray
        });

        await saveUpload.save();

        res.status(201).json({
            message: 'Upload file successfully !',
            saveUpload
        });

        next();
    }
}