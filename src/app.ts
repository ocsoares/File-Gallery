import 'dotenv/config';
import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectionAtlas } from './database/mongoose';
import uploadScreenRoute from './routes/uploadScreenRoute';

const server = express();

const localhost = 'http://localhost';
const port = 5000;

server.set('view engine', 'ejs');

server.use(express.static(__dirname + '/src/views'));
server.use(express.static(__dirname + '/src/public'));
server.use(express.static(__dirname + '/dist'));
server.use(express.static(__dirname + '/assets'));

server.use(cors());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.text({ type: 'text/json' }));

server.use(cors());

server.use(cookieParser(process.env.COOKIE_SECRET));

server.use(session({
    name: 'file_gallery_session',
    secret: process.env.COOKIE_SECRET as string,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongoUrl: process.env.ATLAS_URL,
        ttl: 18000
    }),
    cookie: {
        httpOnly: true,
        maxAge: 18000
    }
}));

server.use(uploadScreenRoute);

server.listen(port, async () => {
    await connectionAtlas();

    console.log(`Servidor rodando remotamente em ${localhost}:${port}`);
});