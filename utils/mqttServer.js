var mosca = require('mosca');
var http = require('http');
var httpServer = http.createServer();

var settings = {
    port: 1886
};

var server = new mosca.Server(settings);
server.attachHttpServer(httpServer);


var authenticate = function(client, username, password, callback) {
    var authorized = (username === 'alice' && password === 'secret');
    if (authorized) client.user = username;
    callback(null, authorized);
};

var authorizePublish = function(client, topic, payload, callback) {
    console.log('ac');
    callback(null, client.user == topic.split('/')[1]);
};

var authorizeSubscribe = function(client, topic, callback) {
    console.log('blabla');
    callback(null, client.user == topic.split('/')[1]);
};





server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});

server.on('clientConnecting',function(){
    console.log('jljl');
});

// fired when the mqtt server is ready
function setup() {
    //server.authenticate = authenticate;
    //server.authorizePublish = authorizePublish;
    //server.authorizeSubscribe = authorizeSubscribe;
    console.log('Mosca server is up and running');
}

//server.on('ready', setup);

httpServer.listen(1885);
module.exports = server;
