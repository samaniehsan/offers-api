import express from 'express';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import logger from './logger'
import morgan from 'morgan';

// Init express
const app = express();

app.use(morgan('dev'));

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

app.get('/', (req: Request, res: Response) => {
    res.sendFile('index.html', {root: viewsDir});
});


// Export express instance
export default app;
