import * as express from 'express';
import { join } from 'path';
import favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import dotenv from 'dotenv';
import login from './routes/login';
import admin from './routes/admin';
import api from './routes/api';
require('dotenv').config();

const app = express();
mongoose.connect( 'mongodb://' + process.env.IP + ':27017/boxes');
//mongod --bind_ip=$IP --nojournal
//mongod --dbpath /data/db --repair

// uncomment after placing your favicon in /public
//app.use(favicon(join(__dirname, 'public', 'favicon.ico')));

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Token');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
    next();
});

app.use('/api', api);
app.use('/api/login', login);
app.use('/api/admin', admin);

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