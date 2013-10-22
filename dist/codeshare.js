/*
 * codeshare
 * https://github.com/nicolasbrugneaux/codeshare
 *
 * Copyright (c) 2013 Nicolas Brugneaux
 * Licensed under the MIT license.
*/


/*
	Modules dependencies
*/


(function() {
  var codeshare, express, http, io, path, routes, server;

  express = require('express');

  routes = require('./routes');

  http = require('http');

  path = require('path');

  io = require('socket.io');

  codeshare = module.exports = express();

  /*
  	Configuration
  */


  codeshare.configure(function() {
    var MemStore;
    codeshare.set('port', process.env.PORT || 8888);
    codeshare.set('views', __dirname + '/views');
    codeshare.set('view engine', 'jade');
    codeshare.use(express.logger('dev'));
    codeshare.use(express.bodyParser());
    codeshare.use(express.methodOverride());
    codeshare.use(express.cookieParser('I Love Cookies <3'));
    MemStore = express.session.MemoryStore;
    codeshare.use(express.session({
      secret: 'I Love Cookies <3',
      store: MemStore({
        reapInterval: 60000 * 10
      })
    }));
    codeshare.use(express["static"](path.join(__dirname, 'static')));
    codeshare.use('/static/public', express["static"](path.join(__dirname, 'public')));
    codeshare.use(codeshare.router);
    if (codeshare.get('env') === 'development') {
      codeshare.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
      }));
    }
    if (codeshare.get('env') === 'production') {
      return codeshare.use(express.errorHandler());
    }
  });

  if (codeshare.get('env') === 'development') {
    codeshare.use(express.errorHandler());
  }

  /*
  	Routes
  */


  codeshare.get('/', routes.index);

  server = http.createServer(codeshare);

  io = io.listen(server);

  io.sockets.on('connection', function(socket) {
    socket.broadcast.emit('news', {
      hello: 'world'
    });
    return socket.on('my other event', function(data) {
      return console.log(data);
    });
  });

  server.listen(codeshare.get('port'), function() {
    return console.log('Express server listening on port ' + codeshare.get('port'));
  });

}).call(this);
