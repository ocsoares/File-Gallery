import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { UploadModel } from '../models/UploadModel';

export class UploadController {
    static async uploadFile(req: Request, res: Response, next: NextFunction) {
        const { description } = req.body;

        if (!req.fileExist) {
            return errorToUpload(400, 'Forneça algum arquivo para upload !');
        }

        if (!req.descriptionExist) {
            return errorToUpload(400, 'Insira uma description !');
        }

        if (!req.uploaded) {
            return errorToUpload(400, 'Formato de arquivo inválido !');
        }

        // Tipei DIRETAMENTE para Tipar também no map, porque sem isso NÃO estava !! <<
        const requestFiles = req.files as Express.Multer.File[];

        if (!requestFiles) {
            return res.status(400).json({
                error: 'Forneça algum arquivo !'
            });
        }

        const filenameArray = requestFiles!.map(files => files.filename);

        const fileExtensionArray = filenameArray.map((names, index) => `${index + 1}_${path.extname(names)}`);

        const saveUpload = new UploadModel({
            description,
            file_name: filenameArray,
            file_extension: fileExtensionArray,
            storage_location: 'locally'
        });

        await saveUpload.save();

        res.status(201).json({
            message: 'Upload file successfully !',
            saveUpload
        });

        function errorToUpload(statusCode: number, message: string) {
            res.status(statusCode).json({
                error: message
            });
        }

        next();
    }
}