declare namespace Express {
    interface Request {
        uploaded: boolean;
        descriptionExist: boolean;
        fileExist: boolean;
    }
}