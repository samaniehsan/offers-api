import './load-env';
import express from 'express';
import { Server }  from 'http';
import {Application, Request, Response, NextFunction } from 'express';
import app from './server';
import logger from './logger';

let hostname = process.env.HOST;

logger.info(`using hostname:${hostname}`);

const port = Number(process.env.PORT || 3000);
logger.info(`using port number:${port}`);

let runningServer: Server;
function onServerRunning()  {
    logger.info(`Express server started on host:${hostname} port:${port}`);
    logger.debug(`runningServer ${JSON.stringify(runningServer)}`);
}
if (hostname) {
    runningServer = app.listen(port, hostname, onServerRunning);
} else {
    runningServer = app.listen(port, onServerRunning);
}
