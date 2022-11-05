import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import { connectionAtlas } from './database/mongoose';
import uploadRoute from './routes/uploadRoute';
import path from 'path';

const server = express();

const localhost = 'http://localhost';
const port = 5000;

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text({ type: 'text/json' }));

const storageUploadFolder = path.join(__dirname, '../uploads');

server.use('/api', express.static(storageUploadFolder),
    uploadRoute
);

server.listen(port, async () => {
    await connectionAtlas();

    console.log(`Servidor rodando remotamente em ${localhost}:${port}`);
});