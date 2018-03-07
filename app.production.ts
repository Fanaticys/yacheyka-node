import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import * as express from 'express';
import { join } from 'path';
import favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as domino from 'domino';
import { renderModuleFactory } from '@angular/platform-server';
import { readFileSync } from 'fs';
import { enableProdMode } from '@angular/core';
import dotenv from 'dotenv';
import login from './routes/login';
import admin from './routes/admin';
import api from './routes/api';
require('dotenv').config();
enableProdMode();

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');
const app = express();
const DIST_FOLDER = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
const win = domino.createWindow(template);

global['window'] = win;
mongoose.connect('mongodb://' + process.env.IP + ':27017/boxes');
//mongod --bind_ip=$IP --nojournal
//mongod --dbpath /data/db --repair

// uncomment after placing your favicon in /public
//app.use(favicon(join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.engine('html', (_, options, callback) => {
    renderModuleFactory(AppServerModuleNgFactory, {
        // Our index.html
        document: template,
        url: options.req.url,
        // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
        extraProviders: [
            provideModuleMap(LAZY_MODULE_MAP)
        ]
    }).then(html => {
        callback(null, html);
    });
});

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use('/api', api);
app.use('/api/login', login);
app.use('/api/admin', admin);

app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

app.get('*', (req, res) => {
    res.render(join(DIST_FOLDER, 'browser', 'index.html'), { req });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ error: err.message });
});

export default app;