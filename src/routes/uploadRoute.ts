import { Router, Request, Response, NextFunction } from 'express';
import { UploadController } from '../controllers/uploadController';
import multerConfig from '../config/multerConfig';
import multer from 'multer';
import { uploadFileToFirebase } from '../services/firebaseService';

const uploadRoute = Router();

const uploadConfig = multer(multerConfig);

uploadRoute.get('/upload', (req: Request, res: Response) => {
    res.json({
        message: 'Forneça a description e o send_file para o envio correto do(s) arquivo(s) !',
        validFormats: ['.png', '.jpeg', '.gif', '.jpg',
            'msword', '.pdf', 'markdown', 'richtext', 'text',
            'mpeg', 'audio .mp4', 'video .mp4'
        ]
    });
});

// send_file = Nome do CAMPO Existente na API que ENVIARÁ os Arquivos (eu escolhi, óbvio...) !! <<
uploadRoute.post('/upload', uploadConfig.array('send_file'), UploadController.uploadFile, uploadFileToFirebase);

type errorType = { code: string; };

uploadRoute.use((error: errorType, req: Request, res: Response, next: NextFunction) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return errorToUpload(400, 'File too large !');
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return errorToUpload(400, 'Unexpected field !');
    }

    function errorToUpload(statusCode: number, message: string) {
        res.status(statusCode).json({
            error: message
        });
    }
});

export default uploadRoute;