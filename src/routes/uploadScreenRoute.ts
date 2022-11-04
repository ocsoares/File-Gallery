import { Router, Request, Response } from 'express';
import path from 'path';

const uploadScreenRoute = Router();

const __dirname = path.resolve();

const uploadScreenEJS = path.join(__dirname, '/src/views/index.ejs');

uploadScreenRoute.get('/', (req: Request, res: Response) => {
    return res.render(uploadScreenEJS);
});

export default uploadScreenRoute;