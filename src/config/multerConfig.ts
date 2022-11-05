
import multer, { Options } from 'multer';
import path from 'path';

const storageDestination: string = path.join(__dirname, '../../uploads');

export default {
    storage: multer.diskStorage({
        destination: storageDestination,
        filename(req, file, callback) {
            callback(null, `${Date.now()}_${file.originalname}`);
        },

    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, callback) => {
        const { description } = req.body;

        if (!description) {
            req.description = false;
            return callback(null, false); // callback(Erro, Permissão para ENVIAR o Arquivo) !! <<
        }
        req.description = true;

        const mimiType: string[] = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg',
            'application/msword', 'application/pdf', 'text/markdown', 'text/richtext', 'text/plain',
            'audio/mpeg', 'audio/mp4', 'video/mp4'
        ];

        if (!mimiType.includes(file.mimetype)) {
            req.uploaded = false;
            return callback(null, false);
        }
        req.uploaded = true;

        callback(null, true);
    }
} as Options;