import './load-env';
import express from 'express';
import {Application, Request, Response, NextFunction } from 'express';
import app from './server';
import logger from './logger';

const port = Number(process.env.PORT || 3000);
logger.info(`using port number:${port}`);

app.listen(port, () => {
    logger.info(`Express server started on port:${port}`);
});