/**
 *
 * Created by jl on 3/19/15.
 */
var mosca = require('mosca');




var moscaSettings = {
    port: 1883
};


var authenticate = function(client, username, password, callback) {
    console.log('haha c');
    var authorized = (username === 'alice' && password === 'secret');
    if (authorized) client.user = username;
    callback(null, authorized);
};

// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizePublish = function(client, topic, payload, callback) {
    console.log('ac');
    callback(null, client.user == topic.split('/')[1]);
};

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizeSubscribe = function(client, topic, callback) {
    console.log('blabla');
    callback(null, client.user == topic.split('/')[1]);
};


var server = new mosca.Server(moscaSettings);



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
    //var message = {
    //    topic: '/hello/world',
    //    payload: 'abcde', // or a Buffer
    //    qos: 0, // 0, 1, or 2
    //    retain: false // or true
    //};
    //
    //server.publish(message, function() {
    //    console.log('done!');
    //});
}



server.on('ready', setup);


module.exports = server;
