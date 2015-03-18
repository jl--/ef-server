;'use strict';

exports.db = {
    connectionUrl: 'mongodb://localhost:27017/ef',
    options:{
        server:{
            socketOptions:{
                keepAlive: 1
            }
        } 
    }
};

exports.server = {
    address: process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
    port: process.env.OPENSHIFT_NODEJS_PORT || 6002
};
/////////// config the account for your site.
exports.account = {
    phone: '13141474751', // your own email, 
    password: 'mmkkk' // password
};


exports.auth = {
    secretToken: 'secretToken',
    expiresInMinutes: 600
};


exports.app = {
    perPage: 4
};