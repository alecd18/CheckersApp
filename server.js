/*jshint esversion: 6 */
'use strict';
const fs = require('fs');
const http = require('http');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io').listen(server);
const winston = require('winston');
const winstonCouch = require('winston-couchdb').Couchdb;
const nano = require('nano')('http://192.241.142.64:5984').use('winston');

winston.add(winstonCouch, {
    host: '192.241.142.64',
    port: 5984,
    level: 'info'
});

var port = 3000;
app.use(express.static(__dirname + '/app/controllers'));
app.use('/views', express.static(__dirname + '/app/views'));
app.use(express.static(__dirname + '/app/css'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-ui-bootstrap/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-animate'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-route'));
app.use('/board', express.static(__dirname + '/app/board/js'));
app.use('/styles', express.static(__dirname + '/app/board/css'));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/styles', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/images', express.static(__dirname + '/app/board/img/chesspieces/wikipedia'));
app.use('/scripts', express.static(__dirname + '/node_modules/socket.io-client/'));
app.use('/scripts', express.static(__dirname + '/node_modules/socket.io/node_modules/socket.io-client/'));
app.use('/scripts', express.static(__dirname + '/node_modules/bootstrap-validator/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/particles.js'));

app.use(express.static(__dirname + '/app/services'));

let connections = [];

let users = [];
let user = {};

//socket.io
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf((socket)), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
        users.splice(users.indexOf(socket), 1);
    });

    socket.on('send message', function (data) {
        user[data] = socket.id;
        users.push(data);
        io.sockets.emit('new message', users);
    });

    socket.on('request game', function (requester, data) {
        let opponent = user[data];
        io.to(opponent).emit('new game request', requester);
    });

    socket.on('game accepted', function (responder, data) {
        winston.info({player: data});
        let opponent = user[data];
        io.to(opponent).emit('game request response', responder, 'accepted');
    });

    socket.on('game rejected', function (responder, data) {
        let opponent = user[data];
        io.to(opponent).emit('game request response', responder, 'rejected');
    });

    socket.on('player forfeit', function(forfeiter, data) {
        let opponent = user[data];
        io.to(opponent).emit('opponent forfeit', forfeiter);
    });

    socket.on('player move', function(board, data) {
        let opponent = user[data];
        io.to(opponent).emit('opponent move', board);
    });

    socket.on('player lost', function(data) {
        let opponent = user[data];
        io.to(opponent).emit('lost');
    });
});

//end of socket.io
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/index.html')
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/app/views/Match.html')
});

app.get('/getAnalytics', function (req,res) {
    nano.view('Logs', 'byTimestamp', function(err, body) {
        const repsonse = JSON.stringify(body, null, 2);
        res.set('Content-Type', 'application/javascript');
        res.send(repsonse);
    });
});

server.listen(port || process.env.PORT, function () {
    console.log('Server listening on http://localhost:' + port);
});


