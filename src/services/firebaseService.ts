import 'dotenv/config';
import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

import { shortURLAPI } from './shortURLService';
import { GalleryModel } from '../models/GalleryModel';
import path from 'path';

const teste = path.resolve();
const folder = path.join(teste, '/src/firebase-key.json');
console.log(folder);

// fs.readdirSync(folder).forEach(file => {
//     console.log(file);
// });

// const serviceAccount = {
//     name: 'dsfsdffs'
// };

if (process.env.NODE_ENV) {
    console.log('PRODUÇÃO !!!');
    const serviceAccount = require('../firebase-key.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as object),
        storageBucket: process.env.STORAGE_BUCKET_URL
    });
}
else {
    console.log('DESENVOLVIMENTO !!!');
    const serviceAccount = require('../config/firebase-key.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as object),
        storageBucket: process.env.STORAGE_BUCKET_URL
    });
}

const storageBucket = admin.storage().bucket();

export const uploadFileToFirebase = async (req: Request, res: Response, next: NextFunction) => {

    const requestFiles = req.files as Express.Multer.File[];

    // Enviando múltiplos Arquivos !! <<
    requestFiles.forEach(files => {
        const filesMimeType = files.mimetype;

        const fileNames = files.filename;

        const fileInBucket = storageBucket.file(fileNames);

        const sendFileToFirebase = fileInBucket.createWriteStream({
            metadata: {
                contentType: filesMimeType
            }
        });

        // 200 Anos !
        const currentDate = new Date();
        const newDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 200)).toString();

        // Cria um link que dá Acesso a alguma funcionalidade da Conta, especificada no action, por um Determinado tempo (expires) !! <<
        fileInBucket.getSignedUrl({ action: 'read', expires: newDate }).then(async (url) => {
            const upload_url = await shortURLAPI(url.toString());

            const saveUploadURL = new GalleryModel({
                file_name: fileNames,
                upload_url: upload_url.data.shortUrl
            });

            await saveUploadURL.save();
        });

        sendFileToFirebase.on('error', (error) => {
            console.log(error.message);
        });

        sendFileToFirebase.on('finish', async () => {
            // Torna o Arquivo PÚBLICO
            await fileInBucket.makePrivate();
        });

        sendFileToFirebase.end(files.buffer); // ENVIA os Arquivos !! <<

    });

    console.log('Arquivo(s) enviado(s) com sucesso para o Firebase !');

    next();
};