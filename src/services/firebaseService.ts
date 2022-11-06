import 'dotenv/config';
import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

import serviceAccount from '../config/firebase-key.json';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    storageBucket: process.env.STORAGE_BUCKET_URL
});

const storageBucket = admin.storage().bucket();

// MODO para UM Arquivo, tentar fazer para ARRAY !! <<
export const uploadFileToFirebase = (req: Request, res: Response, next: NextFunction) => {
    const requestFiles = req.files as Express.Multer.File[];

    const toObject = requestFiles[0];

    const filesMimeType = toObject.mimetype;

    const fileNames = toObject.filename;

    const fileInBucket = storageBucket.file(fileNames);

    const sendFileToFirebase = fileInBucket.createWriteStream({
        metadata: {
            contentType: filesMimeType
        }
    });

    sendFileToFirebase.on('error', (error) => {
        console.log(error.message);
    });

    sendFileToFirebase.on('finish', async () => {
        // Torna o Arquivo PÚBLICO
        await fileInBucket.makePublic();
    });

    sendFileToFirebase.end(toObject.buffer); // ENVIA !! <<

    console.log('TESTE:', toObject);

    next();
};