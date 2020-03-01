import './load-env';
import express from 'express';
import {Application, Request, Response, NextFunction } from 'express';
import app from './server';
import logger from './logger';

const port = Number(process.env.PORT || 3000);
console.log(`port number:${port}`);
logger.info(`test info`);
logger.error(`test error`);
logger.debug(`test debug`);
logger.verbose(`test verbose`);

app.listen(port, () => {
    logger.info(`Express server started on port:${port}`);
});