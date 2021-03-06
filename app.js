const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://rnnwkals1:rnwkals1@ds023603.mlab.com:23603/high');

const routes = require('./routes/index');
const users = require('./routes/users');
const board = require('./routes/board');
const search = require('./routes/search');

const app = express();

const UserSchema = new mongoose.Schema({
    userid: {
        type: String,
        unique: true
    },
    pw: {
        type: String
    },
    name: {
        type: String
    },
    token: {
        type: String
    },
});

const BoardSchema = new mongoose.Schema({
    boardid: {
        type: String
    },
    title: {
        type: String
    },
    contents: {
        type: String
    },
    writer: {
        type: String
    },
    writerToken: {
        type: String
    },
    date: {
        type: Date
    },
    comments: [{
        writer: {
            type: String
        },
        date: {
            type: Date
        },
        summary: {
            type: String
        }
    }]
});


Users = mongoose.model('users', UserSchema);
Boards = mongoose.model('boards', BoardSchema);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'));

app.use('/', routes);
app.use('/users', users);
app.use('/board', board);
app.use('/search',search);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
