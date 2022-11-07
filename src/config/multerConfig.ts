
import multer, { Options } from 'multer';
import { UTF8Decode } from '../helpers/UT8CodeAndDecode';

// Armazenamento LOCAL, com diskStorage !! <<
// const storageDestination: string = path.join(__dirname, '../../uploads');
// destination: storageDestination,
//         filename(req, file, callback) {
//             callback(null, `${Date.now()}_${file.originalname}`);
//         },

const fileSize = 10 * 1024 * 1024; // 10MB

export default {
    storage: multer.memoryStorage(),  // diskStorage = LOCAL    // memoryStorage = Armazenamento EXTERNO !!
    limits: {
        fileSize
    },
    fileFilter: (req, file, callback) => {
        const { description } = req.body;

        file.filename = `${Date.now()}_${UTF8Decode(file.originalname)}`;

        if (!file) {
            req.fileExist = false;
            return callback(null, false);
        }
        req.fileExist = true;

        if (!description) {
            req.descriptionExist = false;
            return callback(null, false); // callback(Erro, Permissão para ENVIAR o Arquivo) !! <<
        }
        req.descriptionExist = true;

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