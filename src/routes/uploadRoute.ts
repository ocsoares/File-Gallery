import { Router, Request, Response } from 'express';
import { UploadController } from '../controllers/uploadController';
import multerConfig from '../config/multerConfig';
import multer from 'multer';

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

// send_file = Nome do CAMPO Existente na API que ENVIARÁ os Arquivos !! <<
uploadRoute.post('/upload', uploadConfig.array('send_file'), UploadController.uploadFile);

export default uploadRoute;