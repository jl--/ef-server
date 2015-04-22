;'use strict';

var config = require('./configs/config');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = require('./router');
var init = require('./configs/init');

var mqttServer = require('./utils/mqttServer');

// init
init();


app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.raw());
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});


// app router
// ================================
app.use('/accounts',router.account);
app.use('/sessions',router.session);
app.use('/profiles',router.profile);
app.use('/messages',router.message);
app.use('/calls',router.call);
app.use('/contacts',router.contact);
app.use('/webupload', router.webupload);


//mqttServer.attachHttpServer(app);

app.listen(config.server.port, config.server.address);
console.log(config.server.address + ':' + config.server.port);
