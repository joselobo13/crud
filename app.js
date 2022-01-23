const http = require('http');
const express = require('express');
const app = express();
const io = require('socket.io');
const server = http.createServer(app);

app.set('port', 3000 )
app.use(express.static(__dirname + "/public/www"))

server.listen(app.get('port'), function () {
  console.log('Servidor iniciado');
});

//router
var productos  = require('./BBDD/productos');

// use router
app.use('/', productos);


module.exports = app;